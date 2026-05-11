import { Outlet, useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';
import FloatingContact from './FloatingContact';
import './Footer.css';

export default function Layout() {
  const navigate = useNavigate();

  const openBooking = (roomType?: string) => {
    const params = new URLSearchParams();
    if (roomType) {
      if (roomType === 'AC') params.set('roomType', 'SINGLE_AC_TV');
      else if (roomType === 'Non-AC') params.set('roomType', 'SINGLE_NONAC');
      else params.set('roomType', roomType);
    }
    navigate(`/checkout?${params.toString()}`);
  };

  return (
    <>
      <Navbar />
      <main className="page-content">
        <Outlet context={{ openBooking }} />
      </main>

      <footer className="luxury-footer">
        <div className="container">
          <div className="footer-grid">
            {/* Branding & Description */}
            <div className="footer-brand">
              <Link to="/" className="footer-logo-wrap">
                <img src="/assets/logo.png" alt="SVS Grands" className="footer-logo" />
                <span className="footer-logo-text">SVS Grands</span>
              </Link>
              <p className="footer-desc">
                SVS Grands offers peaceful and comfortable stays near Sri Venkateswara Swamy Temple, Vadapalli — 
                designed for pilgrims, families, and travelers seeking comfort and convenience.
              </p>
            </div>

            {/* Quick Navigation */}
            <div className="footer-nav">
              <h4>Navigation</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/rooms">Our Rooms</Link></li>
                <li><Link to="/discover-vadapalli">Discover Vadapalli</Link></li>
                <li><Link to="/gallery">Gallery</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
              </ul>
            </div>

            {/* Contact Details */}
            <div className="footer-contact">
              <h4>Contact</h4>
              <p>Opp. Grama Panchayathi Office,<br />Lolla, Vadapalli, AP - 533237</p>
              <a href="tel:+918341199779" className="footer-link">+91 83411 99779</a>
              <a href="mailto:svsgrands@gmail.com" className="footer-link">svsgrands@gmail.com</a>
            </div>

            {/* Social Media */}
            <div className="footer-social">
              <h4>Follow Us</h4>
              <div className="social-icons">
                <a href="https://www.instagram.com/svs_grands_vadapalli" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="https://www.facebook.com/svsgrands" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://maps.app.goo.gl/bitA8qQ6YdLP5PCc9?g_st=ac" target="_blank" rel="noopener noreferrer">
                  <i className="fas fa-map-marker-alt"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-copyright">
              © {new Date().getFullYear()} SVS Grands Boutique Hotel. All rights reserved.
            </div>
            <div className="footer-legal">
              <Link to="/terms">Terms & Conditions</Link>
              <Link to="/privacy">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Modern Interactive Support Widget */}
      <FloatingContact />
    </>
  );
}
