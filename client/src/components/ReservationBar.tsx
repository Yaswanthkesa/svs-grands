import { useState } from 'react';
import { ROOM_NAMES } from '../utils/pricing';
import type { RoomId } from '../utils/pricing';

interface ReservationData {
  checkIn: string;
  checkOut: string;
  roomType: string;
  guests: number;
}

interface ReservationBarProps {
  onBookNow: (data: ReservationData) => void;
}

export default function ReservationBar({ onBookNow }: ReservationBarProps) {
  const today = new Date().toISOString().split('T')[0];
  const maxDateObj = new Date();
  maxDateObj.setFullYear(maxDateObj.getFullYear() + 1);
  const maxDate = maxDateObj.toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState('');
  const [roomType, setRoomType] = useState<RoomId>('SINGLE_AC_TV');
  const [guests, setGuests] = useState(2);

  const handleBook = () => {
    onBookNow({ checkIn, checkOut, roomType, guests });
  };

  return (
    <div className="reservation-bar">
      <div className="reservation-bar-inner">
        <div className="reservation-bar-title">RESERVATION</div>

        <div className="reservation-bar-field">
          <label>Check-In</label>
          <input type="date" value={checkIn} min={today} max={maxDate} onChange={e => setCheckIn(e.target.value)} />
        </div>

        <div className="reservation-bar-divider" />

        <div className="reservation-bar-field">
          <label>Check-Out</label>
          <input type="date" value={checkOut} min={checkIn || today} max={maxDate} onChange={e => setCheckOut(e.target.value)} />
        </div>

        <div className="reservation-bar-divider" />

        <div className="reservation-bar-field">
          <label>Room Category</label>
          <select value={roomType} onChange={e => setRoomType(e.target.value as RoomId)}>
            {Object.entries(ROOM_NAMES).map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        </div>

        <div className="reservation-bar-divider" />

        <div className="reservation-bar-field">
          <label>Guests</label>
          <select value={guests} onChange={e => setGuests(+e.target.value)}>
             {Array.from({ length: 5 }, (_, i) => i + 1).map(n => 
               <option key={n} value={n}>{`0${n}`} Guest{n > 1 ? 's' : ''}</option>
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
