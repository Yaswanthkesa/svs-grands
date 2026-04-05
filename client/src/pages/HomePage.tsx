import { useOutletContext } from 'react-router-dom';
import { Link } from 'react-router-dom';

interface LayoutContext {
  openBooking: (roomType?: 'AC' | 'Non-AC') => void;
}

export default function HomePage() {
  const { openBooking } = useOutletContext<LayoutContext>();

  const features = [
    { icon: '❄️', title: 'AC & Non-AC Rooms', desc: '32 well-maintained rooms with flexible AC and Non-AC options for every budget' },
    { icon: '📶', title: 'Free WiFi', desc: 'Stay connected with complimentary high-speed WiFi throughout the property' },
    { icon: '🅿️', title: 'Free Parking', desc: 'Spacious and secure parking available for all guests at no extra charge' },
    { icon: '🛎️', title: 'Room Service', desc: 'Prompt in-room service available for your convenience and comfort' },
    { icon: '🚿', title: 'Hot Water 24/7', desc: 'Round-the-clock hot water supply in all rooms with modern bathroom fittings' },
    { icon: '📺', title: 'Television', desc: 'Flat-screen TVs with satellite channels in every room for entertainment' },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg" style={{
          backgroundImage: `url('/assets/exterior.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />
        <div className="hero-overlay" />

        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-stars">★★★★★</span>
            4.6 Rated on Google · 200+ Reviews
          </div>

          <h1 className="hero-title">
            <span>SVS</span> Grands
          </h1>
          <p className="hero-tagline">Comfortable Stay at Comfortable Price</p>
          <p className="hero-location">
            📍 Near Sri Venkateswara Swamy Temple, Vadapalli, Konaseema
          </p>

          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => openBooking()}>
              🏨 Book Your Stay
            </button>
            <Link to="/rooms" className="btn-outline">
              View Rooms & Prices
            </Link>
          </div>
        </div>

        <div className="scroll-indicator">
          Scroll to Explore
          <span></span>
        </div>
      </section>

      {/* About / Facilities Section */}
      <section className="about section-padding" id="about">
        <div className="container">
          <h2 className="section-title">Why Choose SVS Grands?</h2>
          <p className="section-subtitle">
            Established in 2024, SVS Grands offers modern comfort at budget-friendly prices — ideally located near the famous Konaseema Tirupathi temple.
          </p>

          <div className="about-grid">
            {features.map((f, i) => (
              <div className="about-card glass-card" key={i}>
                <span className="about-card-icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Rooms Preview */}
      <section className="home-rooms-preview section-padding">
        <div className="container">
          <h2 className="section-title">Our Rooms</h2>
          <p className="section-subtitle">
            Choose from our AC and Non-AC rooms — all designed for comfort. Flexible 12-hour and 24-hour stays available.
          </p>
          <div className="home-rooms-cards">
            <div className="home-room-card glass-card" onClick={() => openBooking('Non-AC')}>
              <div className="home-room-image" style={{ backgroundImage: `url('/assets/room-nonac.png')` }} />
              <div className="home-room-info">
                <h3>Non-AC Room</h3>
                <p className="home-room-price">From ₹800 <small>/12hrs</small></p>
                <p className="home-room-desc">16 comfortable rooms with modern amenities — WiFi, TV, hot water and room service.</p>
                <Link to="/rooms" className="home-room-link">View Details →</Link>
              </div>
            </div>
            <div className="home-room-card glass-card" onClick={() => openBooking('AC')}>
              <div className="home-room-image" style={{ backgroundImage: `url('/assets/room-ac.png')` }} />
              <div className="home-room-info">
                <h3>AC Room</h3>
                <p className="home-room-price">From ₹1,200 <small>/12hrs</small></p>
                <p className="home-room-desc">16 climate-controlled rooms for a premium stay — all amenities plus air conditioning.</p>
                <Link to="/rooms" className="home-room-link">View Details →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
