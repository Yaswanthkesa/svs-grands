import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ROOM_NAMES, NORMAL_RATES } from '../utils/pricing';
import type { RoomId } from '../utils/pricing';

interface LayoutContext {
  openBooking: (roomType?: string) => void;
}

const getRoomImage = (id: string) => {
  if (id.includes('SINGLE_AC')) return '/assets/room-ac.png';
  if (id.includes('DOUBLE')) return '/assets/room-ac.png'; // Fallback
  return '/assets/room-nonac.png';
};

const getRoomDescription = (id: string) => {
  if (id.includes('DOUBLE')) return 'Spacious double bed configuration ideal for families or large groups traveling together, accommodating up to 5 people comfortably.';
  if (id.includes('NONAC')) return 'Spacious and well-ventilated rooms designed for a comfortable stay. Ideal for pilgrims and budget-conscious travelers.';
  return 'Premium climate-controlled rooms for a comfortable and relaxing stay. Air-conditioned for comfort in the warm Konaseema climate.';
};

const rooms = Object.keys(ROOM_NAMES).map((key) => {
  const id = key as RoomId;
  const rates = NORMAL_RATES[id];
  return {
    id,
    type: id,
    title: ROOM_NAMES[id],
    bedTypes: id.includes('DOUBLE') ? 'Two Double Beds' : 'Single Double Bed',
    image: getRoomImage(id),
    basePrice: rates.price12h || rates.price24h,
    durationLabel: rates.price12h ? '12 hours' : '24 hours',
    description: getRoomDescription(id),
    amenities: [
      id.includes('AC_') && !id.includes('NONAC') ? 'Air Conditioning' : 'Fan',
      'Free WiFi', 
      'Hot Water 24/7', 
      id.includes('_TV') ? 'Flat-Screen TV' : null,
      'Room Service',
      'Free Parking'
    ].filter(Boolean) as string[],
  };
});

export default function RoomsPage() {
  const { openBooking } = useOutletContext<LayoutContext>();
  const [activeRoom, setActiveRoom] = useState(0);
  const room = rooms[activeRoom];

  return (
    <div className="rooms-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <h1 className="page-header-title">Our Rooms</h1>
          <div className="page-header-ornament">
            <span /><span /><span />
          </div>
          <p className="page-header-subtitle">
            SVS Grands features completely customizable options to suit every pilgrim's group size and budget.
          </p>
        </div>
      </div>

      {/* Room Viewer */}
      <div className="room-viewer">
        {/* Left Sidebar */}
        <div className="room-sidebar">
          <h3 className="room-sidebar-title">Room Categories</h3>
          {rooms.map((r, i) => (
            <div
              key={r.type}
              className={`room-sidebar-item ${i === activeRoom ? 'active' : ''}`}
              onClick={() => setActiveRoom(i)}
            >
              <div className="room-sidebar-thumb" style={{ backgroundImage: `url(${r.image})` }} />
              <span className="room-sidebar-label">{r.title}</span>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="room-main">
          <div className="room-main-image">
            <img src={room.image} alt={room.title} />
          </div>

          <div className="room-main-content">
            <div className="room-main-header">
              <h2>{room.title}</h2>
              <span className="room-main-beds">{room.bedTypes}</span>
            </div>

            <p className="room-main-desc">{room.description}</p>

            <div className="room-main-amenities">
              <h4>Room Amenities</h4>
              <div className="room-amenity-tags">
                {room.amenities.map(a => (
                  <span key={a} className="room-amenity-tag">{a}</span>
                ))}
              </div>
            </div>

            {/* Pricing Details */}
            <div className="room-pricing-section">
              <h4>Base Pricing (Sun-Thu)</h4>

              <div className="room-price-display">
                <span className="room-price-amount">
                  ₹{room.basePrice.toLocaleString('en-IN')}
                </span>
                <span className="room-price-per">
                  / {room.durationLabel}
                </span>
                <span className="room-price-tax">All taxes inclusive</span>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px'}}>
                *Prices dynamically adjust based on day of week (Weekend, Peak Friday) and extra hourly stays.
              </p>

              <button className="btn-primary room-book-btn" onClick={() => openBooking(room.type)}>
                🏨 Book {room.title}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
