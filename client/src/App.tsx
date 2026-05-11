import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/main.css';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import RoomsPage from './pages/RoomsPage';
import DiscoverPage from './pages/DiscoverPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';

import CheckoutPage from './pages/CheckoutPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/discover-vadapalli" element={<DiscoverPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
