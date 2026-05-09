import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {

  const navigate = useNavigate();

  const openBooking = (roomType?: string) => {
    const params = new URLSearchParams();
    if (roomType) {
      // Map legacy 'AC'/'Non-AC' labels to room IDs
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
      <footer className="footer-bar">
        <div className="footer-bar-inner">
          <div className="footer-bar-badge">
            <span>★</span> 4.6 Rated on Google
          </div>
          <div className="footer-bar-links">
            <a href="tel:+918341199779">Contact Us</a>
            <a href="mailto:svsgrands@gmail.com">Email</a>
            <a href="https://www.instagram.com/svs_grands_vadapalli" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://maps.app.goo.gl/bitA8qQ6YdLP5PCc9?g_st=ac" target="_blank" rel="noopener noreferrer">Location</a>
          </div>
          <div className="footer-bar-copy">
            © {new Date().getFullYear()} SVS Grands. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}

