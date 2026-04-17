import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROOM_NAMES } from '../utils/pricing';
import type { RoomId } from '../utils/pricing';
import DateRangePicker from './DateRangePicker';

export default function ReservationBar() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [roomType, setRoomType] = useState<RoomId>('SINGLE_AC_TV');
  const [guests, setGuests] = useState(1);

  const handleBook = () => {
    navigate(`/checkout?roomType=${roomType}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
  };

  return (
    <div className="reservation-bar">
      <div className="reservation-bar-inner">
        <div className="reservation-bar-title">RESERVATION</div>

        <div className="reservation-bar-field" style={{ flex: 1.5 }}>
          <DateRangePicker
            checkInDate={checkIn}
            checkOutDate={checkOut}
            onCheckInChange={setCheckIn}
            onCheckOutChange={setCheckOut}
            direction="up"
            variant="compact"
          />
        </div>

        <div className="reservation-bar-divider" />

        <div className="reservation-bar-field">
          <select value={roomType} onChange={e => setRoomType(e.target.value as RoomId)}>
            {Object.entries(ROOM_NAMES).map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        </div>

        <div className="reservation-bar-divider" />

        <div className="reservation-bar-field">
          <select value={guests} onChange={e => setGuests(+e.target.value)}>
             {Array.from({ length: 5 }, (_, i) => i + 1).map(n => 
               <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
             )}
          </select>
        </div>

        <button className="reservation-bar-book" onClick={handleBook}>
          BOOK NOW
        </button>
      </div>

      {/* Mobile: compact sticky button */}
      <button className="reservation-bar-mobile" onClick={handleBook}>
        🏨 Book Your Stay
      </button>
    </div>
  );
}
