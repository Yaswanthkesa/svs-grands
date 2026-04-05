import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import ReservationBar from './ReservationBar';
import BookingModal from './BookingModal';

export interface ReservationData {
  checkIn: string;
  checkOut: string;
  roomType: string;
  guests: number;
}

export default function Layout() {
  const location = useLocation();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [reservationData, setReservationData] = useState<ReservationData>({
    checkIn: '',
    checkOut: '',
    roomType: 'SINGLE_AC_TV',
    guests: 2,
  });

  const openBooking = (roomType?: string) => {
    if (roomType) {
      setReservationData(prev => ({ ...prev, roomType }));
    }
    setBookingOpen(true);
  };

  const handleReservationBook = (data: ReservationData) => {
    setReservationData(data);
    setBookingOpen(true);
  };

  return (
    <>
      <Navbar />
      <main className="page-content">
        <Outlet context={{ openBooking }} />
      </main>
      {location.pathname !== '/checkout' && (
        <ReservationBar onBookNow={handleReservationBook} />
      )}
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

      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        reservationData={reservationData}
      />
    </>
  );
}
