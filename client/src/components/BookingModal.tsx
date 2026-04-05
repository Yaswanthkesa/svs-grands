import { useState, useEffect } from 'react';
import { createBooking } from '../services/api';
import type { BookingResponse } from '../types';
import { calculatePrice, ROOM_NAMES, NORMAL_RATES } from '../utils/pricing';
import type { RoomId } from '../utils/pricing';

interface ReservationData {
  checkIn: string;
  checkOut: string;
  roomType: string;
  guests: number;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservationData?: ReservationData;
}

export default function BookingModal({ isOpen, onClose, reservationData }: BookingModalProps) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState<BookingResponse | null>(null);
  const [formError, setFormError] = useState('');
  
  const [pricingDetails, setPricingDetails] = useState<{totalPrice: number, error?: string}>({ totalPrice: 0 });

  // Compute defaults for tomorrow at 12:00 PM if none provided
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultCheckInDate = tomorrow.toISOString().split('T')[0];
  
  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  const defaultCheckOutDate = dayAfterTomorrow.toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    roomType: 'SINGLE_AC_TV' as RoomId,
    checkInDate: defaultCheckInDate,
    checkInTime: '12:00',
    checkOutDate: defaultCheckOutDate,
    checkOutTime: '12:00',
    guestName: '',
    guestPhone: '',
    guestEmail: '',
    numberOfGuests: 2,
    specialRequests: '',
  });

  // Sync reservation data from the ReservationBar into the form
  useEffect(() => {
    if (isOpen && reservationData) {
      setFormData(prev => ({
        ...prev,
        roomType: (reservationData.roomType in ROOM_NAMES) ? (reservationData.roomType as RoomId) : prev.roomType,
        checkInDate: reservationData.checkIn || prev.checkInDate,
        checkOutDate: reservationData.checkOut || prev.checkOutDate,
        numberOfGuests: reservationData.guests || prev.numberOfGuests,
      }));
      setStep('form');
      setFormError('');
    }
  }, [isOpen, reservationData]);

  // Recalculate price dynamically whenever the form inputs change
  useEffect(() => {
    if (!formData.checkInDate || !formData.checkOutDate) return;
    try {
      const ci = new Date(`${formData.checkInDate}T${formData.checkInTime}`);
      const co = new Date(`${formData.checkOutDate}T${formData.checkOutTime}`);
      
      const result = calculatePrice(ci, co, formData.roomType, formData.numberOfGuests);
      setPricingDetails({ totalPrice: result.totalPrice, error: result.error });
    } catch {
      setPricingDetails({ totalPrice: 0, error: 'Invalid date/time format.' });
    }
  }, [formData.checkInDate, formData.checkInTime, formData.checkOutDate, formData.checkOutTime, formData.roomType, formData.numberOfGuests]);

  if (!isOpen) return null;

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFormError('');
  };

  // Generate WhatsApp message for booking fallback
  const generateWhatsAppUrl = (bookingId?: string) => {
    const ci = new Date(`${formData.checkInDate}T${formData.checkInTime}`);
    const co = new Date(`${formData.checkOutDate}T${formData.checkOutTime}`);
    const timeDiffMs = co.getTime() - ci.getTime();
    const hours = Math.max(0, Math.ceil(timeDiffMs / (1000 * 60 * 60)));

    const checkInDisplay = new Date(formData.checkInDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const checkOutDisplay = new Date(formData.checkOutDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    const message = encodeURIComponent(
      `🏨 *New Booking - SVS Grands*\n\n` +
      (bookingId ? `📋 *Booking ID:* ${bookingId}\n` : '') +
      `🛏️ *Room:* ${ROOM_NAMES[formData.roomType]}\n` +
      `📅 *Check-In:* ${checkInDisplay} at ${formData.checkInTime}\n` +
      `📅 *Check-Out:* ${checkOutDisplay} at ${formData.checkOutTime}\n` +
      `⏱️ *Duration:* ${hours} Hours\n` +
      `💰 *Total:* ₹${pricingDetails.totalPrice.toLocaleString('en-IN')}\n\n` +
      `👤 *Guest:* ${formData.guestName}\n` +
      `📞 *Phone:* ${formData.guestPhone}\n` +
      `👥 *Guests:* ${formData.numberOfGuests}\n` +
      (formData.specialRequests ? `📝 *Requests:* ${formData.specialRequests}\n` : '')
    );
    return `https://wa.me/918341199779?text=${message}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.checkInDate || !formData.checkOutDate || !formData.guestName || !formData.guestPhone) {
      setFormError('Please fill in all required fields (Dates, name, and phone).');
      return;
    }

    if (pricingDetails.error) {
      setFormError(pricingDetails.error);
      return;
    }

    setLoading(true);
    setFormError('');

    try {
      const checkIn = `${formData.checkInDate}T${formData.checkInTime}:00`;
      const checkOut = `${formData.checkOutDate}T${formData.checkOutTime}:00`;
      
      const ciDate = new Date(checkIn);
      const coDate = new Date(checkOut);
      const hours = Math.ceil((coDate.getTime() - ciDate.getTime()) / (1000 * 60 * 60));

      const result = await createBooking({
        guestName: formData.guestName,
        guestPhone: formData.guestPhone,
        guestEmail: formData.guestEmail,
        roomType: ROOM_NAMES[formData.roomType],
        checkIn,
        checkOut,
        duration: `${hours} hours`,
        numberOfGuests: formData.numberOfGuests,
        totalAmount: pricingDetails.totalPrice,
        specialRequests: formData.specialRequests,
      });

      setBookingResult(result);
      setStep('success');
    } catch {
      // Server is down or not connected — fallback to WhatsApp booking
      const whatsappUrl = generateWhatsAppUrl();
      const checkIn = `${formData.checkInDate}T${formData.checkInTime}:00`;
      const checkOut = `${formData.checkOutDate}T${formData.checkOutTime}:00`;
      const ciDate = new Date(checkIn);
      const coDate = new Date(checkOut);
      const hours = Math.ceil((coDate.getTime() - ciDate.getTime()) / (1000 * 60 * 60));

      setBookingResult({
        message: 'Booking sent via WhatsApp',
        booking: {
          bookingId: `WA-${Date.now()}`,
          guestName: formData.guestName,
          guestPhone: formData.guestPhone,
          roomType: ROOM_NAMES[formData.roomType],
          checkIn,
          checkOut,
          duration: `${hours} hours`,
          totalAmount: pricingDetails.totalPrice,
          status: 'pending',
        },
        whatsappUrl,
      });
      setStep('success');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('form');
    setBookingResult(null);
    setFormError('');
    onClose();
  };

  const today = new Date().toISOString().split('T')[0];
  const maxDateObj = new Date();
  maxDateObj.setFullYear(maxDateObj.getFullYear() + 1);
  const maxDate = maxDateObj.toISOString().split('T')[0];

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="booking-modal" onClick={e => e.stopPropagation()}>
        <div className="booking-modal-header">
          <h2>{step === 'form' ? '🏨 Book Your Stay' : '✅ Booking Confirmed'}</h2>
          <button className="booking-modal-close" onClick={handleClose}>✕</button>
        </div>

        <div className="booking-modal-body">
          {step === 'form' ? (
            <form onSubmit={handleSubmit}>
              {(formError || pricingDetails.error) && (
                <div className="booking-error">
                  ⚠️ {formError || pricingDetails.error}
                </div>
              )}

              {/* Room Type */}
              <div className="form-group">
                <label>Room Type</label>
                <select value={formData.roomType} onChange={e => handleChange('roomType', e.target.value)}>
                  {Object.entries(ROOM_NAMES).map(([id, name]) => (
                    <option key={id} value={id}>{name}</option>
                  ))}
                </select>
              </div>

              {/* Check-in Date & Time */}
              <div className="form-row">
                <div className="form-group">
                  <label>Check-In Date *</label>
                  <input type="date" required min={today} max={maxDate} value={formData.checkInDate}
                    onChange={e => handleChange('checkInDate', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Check-In Time *</label>
                  <input type="time" required value={formData.checkInTime}
                    onChange={e => handleChange('checkInTime', e.target.value)} />
                </div>
              </div>

              {/* Check-out Date & Time */}
              <div className="form-row">
                <div className="form-group">
                  <label>Check-Out Date *</label>
                  <input type="date" required min={formData.checkInDate || today} max={maxDate} value={formData.checkOutDate}
                    onChange={e => handleChange('checkOutDate', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Check-Out Time *</label>
                  <input type="time" required value={formData.checkOutTime}
                    onChange={e => handleChange('checkOutTime', e.target.value)} />
                </div>
              </div>

              {/* Guest Details */}
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" required placeholder="Enter your full name" value={formData.guestName}
                  onChange={e => handleChange('guestName', e.target.value)} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input type="tel" required placeholder="10-digit mobile" pattern="[0-9]{10}" 
                    value={formData.guestPhone}
                    onChange={e => handleChange('guestPhone', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>No. of Guests</label>
                  <select value={formData.numberOfGuests} onChange={e => handleChange('numberOfGuests', +e.target.value)}>
                    {
                      // dynamically list max persons for room. if 1-5
                      Array.from({ length: 5 }, (_, i) => i + 1).map(n => 
                        <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                      )
                    }
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Email (Optional)</label>
                <input type="email" placeholder="your@email.com" value={formData.guestEmail}
                  onChange={e => handleChange('guestEmail', e.target.value)} />
              </div>

              <div className="form-group">
                <label>Special Requests (Optional)</label>
                <textarea placeholder="Any special requests..." value={formData.specialRequests}
                  onChange={e => handleChange('specialRequests', e.target.value)} />
              </div>

              {/* Price Summary */}
              <div className="price-summary">
                <div className="price-summary-row">
                  <span>{ROOM_NAMES[formData.roomType as RoomId]}</span>
                  <span>{pricingDetails.error ? '—' : `₹${pricingDetails.totalPrice.toLocaleString('en-IN')}`}</span>
                </div>
                {formData.numberOfGuests > NORMAL_RATES[formData.roomType as RoomId].includedPersons && (
                  <div className="price-summary-row" style={{ color: 'var(--primary)'}}>
                    <span>Extra Persons Included</span>
                  </div>
                )}
                <div className="price-summary-row">
                  <span>Taxes</span>
                  <span style={{ color: 'var(--success)' }}>Inclusive</span>
                </div>
                <div className="price-summary-total">
                  <span>Dynamic Total</span>
                  <span>{pricingDetails.error ? '—' : `₹${pricingDetails.totalPrice.toLocaleString('en-IN')}`}</span>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-primary" 
                style={{ width: '100%', justifyContent: 'center', padding: '16px' }} 
                disabled={loading || !!pricingDetails.error}
              >
                {loading ? '⏳ Booking...' : '✅ Confirm Booking'}
              </button>
            </form>
          ) : (
            <div className="booking-success">
              <div className="booking-success-icon">🎉</div>
              <h3>Booking Confirmed!</h3>
              <p className="booking-id">Booking ID: {bookingResult?.booking?.bookingId}</p>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.7 }}>
                Your booking has been received. We will confirm it shortly via WhatsApp or call.
                <br />You can also reach us at <strong style={{ color: 'var(--secondary)' }}>083411 99779</strong>
              </p>
              <div className="booking-success-actions">
                {bookingResult?.whatsappUrl && (
                  <a href={bookingResult.whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                    💬 Share on WhatsApp
                  </a>
                )}
                <button className="btn-outline" onClick={handleClose}>Close</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
