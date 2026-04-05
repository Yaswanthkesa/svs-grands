import { Router, Request, Response } from 'express';
import Booking from '../models/Booking';

const router = Router();

// Generate unique booking ID like "SVS-20260401-001"
const generateBookingId = async (): Promise<string> => {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
  
  const todayCount = await Booking.countDocuments({
    createdAt: { $gte: todayStart, $lt: todayEnd },
  });
  
  const seq = String(todayCount + 1).padStart(3, '0');
  return `SVS-${dateStr}-${seq}`;
};

// POST /api/bookings - Create a new booking
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      guestName,
      guestPhone,
      guestEmail,
      roomType,
      checkIn,
      checkOut,
      duration,
      numberOfGuests,
      totalAmount,
      specialRequests,
    } = req.body;

    // Validation
    if (!guestName || !guestPhone || !roomType || !checkIn || !checkOut || !duration || !totalAmount) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const bookingId = await generateBookingId();

    const booking = new Booking({
      bookingId,
      guestName,
      guestPhone,
      guestEmail: guestEmail || '',
      roomType,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      duration,
      numberOfGuests: numberOfGuests || 1,
      totalAmount,
      specialRequests: specialRequests || '',
      status: 'pending',
    });

    await booking.save();

    // Generate WhatsApp notification message
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const whatsappMessage = encodeURIComponent(
      `🏨 *New Booking - SVS Grands*\n\n` +
      `📋 *Booking ID:* ${bookingId}\n` +
      `🛏️ *Room:* ${roomType} Room\n` +
      `📅 *Check-In:* ${checkInDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} at ${checkInDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}\n` +
      `📅 *Check-Out:* ${checkOutDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} at ${checkOutDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}\n` +
      `⏱️ *Duration:* ${duration === '12hr' ? '12 Hours' : '24 Hours'}\n` +
      `💰 *Total:* ₹${totalAmount.toLocaleString('en-IN')}\n\n` +
      `👤 *Guest:* ${guestName}\n` +
      `📞 *Phone:* ${guestPhone}\n` +
      `👥 *Guests:* ${numberOfGuests}\n` +
      (specialRequests ? `📝 *Requests:* ${specialRequests}\n` : '')
    );

    const whatsappUrl = `https://wa.me/918341199779?text=${whatsappMessage}`;

    res.status(201).json({
      message: 'Booking created successfully',
      booking: booking.toObject(),
      whatsappUrl,
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/bookings/:id - Get booking by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.id });
    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }
    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
