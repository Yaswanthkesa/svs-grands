import { useState } from 'react';
import './FloatingContact.css';

export default function FloatingContact({ settings }: { settings: any }) {
  const [isOpen, setIsOpen] = useState(false);

  const whatsappLink = settings?.whatsappLink || "https://wa.me/918341199779?text=Hello%20SVS%20Grands,%20I'm%20interested%20in%20booking%20a%20stay.";

  return (
    <div className={`floating-contact-wrapper ${isOpen ? 'is-open' : ''}`}>
      <div className="floating-menu">
        {/* Call Button */}
        <div className="floating-item-wrap">
          <span className="floating-tooltip">Call Now</span>
          <a href={`tel:${settings?.phoneNumber || "+918341199779"}`} className="floating-item call-btn">
            <i className="fas fa-phone"></i>
          </a>
        </div>

        {/* WhatsApp Button */}
        <div className="floating-item-wrap">
          <span className="floating-tooltip">WhatsApp Chat</span>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="floating-item whatsapp-btn">
            <i className="fab fa-whatsapp"></i>
          </a>
        </div>
      </div>

      {/* Main Toggle Button */}
      <div className="floating-item-wrap main-btn-wrap">
        <span className="floating-tooltip">
          {isOpen ? 'Hide' : 'Contact Us'}
        </span>
        <button 
          className="floating-main-btn" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle contact menu"
        >
          {isOpen ? (
            <i className="fas fa-times"></i>
          ) : (
            <i className="fas fa-headset"></i>
          )}
        </button>
      </div>
    </div>
  );
}
