import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { calculatePrice, ROOM_NAMES, NORMAL_RATES } from '../utils/pricing';
import type { RoomId } from '../utils/pricing';
import './RoomsPage.css';

const getRoomImage = (id: string) => {
  if (id === 'DELUXE') return '/assets/rooms/deluxe/1.png';
  if (id === 'SUPERIOR') return '/assets/rooms/superior/1.png';
  if (id === 'FAMILY_COMFORT') return '/assets/rooms/family-comfort/1.png';
  if (id === 'CLASSIC') return '/assets/rooms/classic/1.png';
  if (id === 'STANDARD') return '/assets/rooms/standard/1.png';
  return '/assets/rooms/classic/1.png';
};

const getRoomDescription = (id: string) => {
  if (id === 'DELUXE' || id === 'SUPERIOR' || id === 'FAMILY_COMFORT') {
    return 'Spacious double bed configuration ideal for families or large groups.';
  }
  if (id === 'STANDARD') {
    return 'Well-ventilated rooms designed for a comfortable stay. Available in both TV and non-TV configurations to suit your preference.';
  }
  return 'Premium climate-controlled rooms for a comfortable and relaxing stay. Available in both TV and non-TV configurations to suit your preference.';
};

const roomsData = Object.keys(ROOM_NAMES).map((key) => {
  const id = key as RoomId;
  const isFamily = id === 'DELUXE' || id === 'SUPERIOR' || id === 'FAMILY_COMFORT';
  const isAC = id === 'CLASSIC' || id === 'DELUXE' || id === 'SUPERIOR';
  const isOptionalTV = id === 'CLASSIC' || id === 'STANDARD';

  return {
    id,
    title: ROOM_NAMES[id],
    bedTypes: isFamily ? 'Two Double Beds' : 'Single Double Bed',
    image: getRoomImage(id),
    description: getRoomDescription(id),
    amenities: [
      isAC ? 'Air Conditioning' : 'Fan',
      'Free WiFi', 
      'Hot Water 24/7', 
      isOptionalTV ? 'TV (Optional)' : 'Flat-Screen TV',
      'Room Service'
    ].filter(Boolean) as string[],
  };
});

export default function RoomsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // States
  const [checkInDate] = useState(today);
  const [checkOutDate] = useState(tomorrow.toISOString().split('T')[0]);
  const [guests] = useState(2);
  const [pricingMap, setPricingMap] = useState<Record<string, { price: number; error?: string }>>({});

  // Hash Routing Logic
  const hash = location.hash;
  const hashIndex = hash ? parseInt(hash.replace('#', '')) : NaN;
  const isDetailsView = !isNaN(hashIndex) && hashIndex >= 0 && hashIndex < roomsData.length;
  const activeRoomIndex = isDetailsView ? hashIndex : 0;
  const activeRoom = roomsData[activeRoomIndex];

  useEffect(() => {
    try {
      const ci = new Date(`${checkInDate}T12:00`);
      const co = new Date(`${checkOutDate}T12:00`);
      
      const newPricing: Record<string, { price: number; error?: string }> = {};
      
      roomsData.forEach(room => {
        const result = calculatePrice(ci, co, room.id, guests);
        newPricing[room.id] = {
          price: result.totalPrice,
          error: result.error
        };
      });
      setPricingMap(newPricing);
    } catch {
      // Intentionally empty
    }
  }, [checkInDate, checkOutDate, guests]);

  const handleBookNow = (roomId: string) => {
    navigate(`/checkout?roomType=${roomId}&checkIn=${checkInDate}&checkOut=${checkOutDate}&guests=${guests}`);
  };

  const openDetails = (index: number) => {
    navigate(`/rooms#${index}`);
  };

  const goToListing = () => {
    navigate(`/rooms`);
  };

  // Pre-load prices for the active room
  const pricing = pricingMap[activeRoom.id];

  return (
    <div className={`rooms-page-container ${isDetailsView ? 'is-details' : 'is-listing'}`}>
      
      {/* Background for Details View */}
      {isDetailsView && (
        <div 
          className="rooms-details-bg" 
          style={{ backgroundImage: `url(${activeRoom.image})` }} 
        />
      )}

      {!isDetailsView ? (
        <div className="rooms-listing-view">
           <div className="container">
              <div className="rooms-listing-header">
                <h1>ROOMS</h1>
                <div className="page-header-ornament">
                  <span /><span /><span />
                </div>
                <p>
                  Experience unparalleled luxury and comfort in our thoughtfully designed rooms. 
                  Select a room below to discover more about our premium amenities and tranquil spaces.
                </p>
              </div>
              <div className="rooms-grid">
                {roomsData.map((room, idx) => (
                  <div 
                    key={room.id} 
                    className={`room-grid-card ${idx === 0 ? 'featured' : 'standard'}`} 
                    onClick={() => openDetails(idx)}
                  >
                    <img src={room.image} alt={room.title} className="room-grid-img" />
                    <div className="room-card-overlay">
                      <h2>{room.title.toUpperCase()}</h2>
                      <button className="btn-know-more">KNOW MORE</button>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      ) : (
        <div className="rooms-details-view">
          {/* Left Sidebar */}
          <div className="rooms-details-sidebar">
             <div className="sidebar-header">
               <h2>Rooms</h2>
               <button className="btn-back" onClick={goToListing}>← Back to list</button>
             </div>
             <div className="sidebar-thumbs">
               {roomsData.map((room, idx) => (
                 <div 
                   key={room.id} 
                   className={`sidebar-thumb-item ${idx === activeRoomIndex ? 'active' : ''}`} 
                   onClick={() => openDetails(idx)}
                 >
                   <img src={room.image} alt={room.title} />
                   <div className="thumb-overlay">
                     <span>{room.title}</span>
                   </div>
                 </div>
               ))}
             </div>
          </div>
          
          {/* Center Overlay Content */}
          <div className="rooms-details-main">
            <div className="details-card-overlay">
               <h1>{activeRoom.title}</h1>
               <div className="details-divider"></div>
               
               <div className="details-meta">
                 <span>🛏️ {activeRoom.bedTypes}</span>
                 <span>👥 Max {NORMAL_RATES[activeRoom.id].maxPersons} Persons</span>
               </div>
               
               <p className="details-desc">{activeRoom.description}</p>
               
               <div className="details-amenities">
                 {activeRoom.amenities.map(a => (
                   <span key={a}>{a}</span>
                 ))}
               </div>
               
               <div className="details-pricing">
                 {pricing?.error ? (
                   <div className="room-rate-error">{pricing.error}</div>
                 ) : (
                   <>
                     <div className="details-price-amount">
                        ₹{(pricing?.price || 0).toLocaleString('en-IN')}
                     </div>
                     <span className="details-price-tax">per night, taxes included.</span>
                     {guests > NORMAL_RATES[activeRoom.id].includedPersons && (
                       <span className="details-price-tax" style={{color: 'var(--primary)'}}>
                         Includes extra guest charge.
                       </span>
                     )}
                   </>
                 )}
               </div>
               
               <button 
                 className="btn-primary details-book-btn" 
                 onClick={() => handleBookNow(activeRoom.id)}
                 disabled={!!pricing?.error}
               >
                 Book Now
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
