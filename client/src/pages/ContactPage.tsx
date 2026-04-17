import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `📩 *New Inquiry - SVS Grands Website*\n\n` +
      `👤 *Name:* ${form.name}\n` +
      `📞 *Phone:* ${form.phone}\n` +
      `📧 *Email:* ${form.email}\n` +
      `💬 *Message:* ${form.message}`
    );
    window.open(`https://wa.me/918341199779?text=${msg}`, '_blank');
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="contact-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <h1 className="page-header-title">Contact Us</h1>
          <div className="page-header-ornament">
            <span /><span /><span />
          </div>
          <p className="page-header-subtitle">
            Have questions or need assistance? We're here to help — reach out to us anytime.
          </p>
        </div>
      </div>

      {/* Contact Content */}
      <div className="contact-content">
        <div className="container">
          <div className="contact-grid">
            {/* Left: Info */}
            <div className="contact-left">
              <div className="contact-info-cards">
                <div className="contact-info-card glass-card">
                  <div className="contact-info-card-icon">📞</div>
                  <h4>Phone</h4>
                  <p><a href="tel:+918341199779">083411 99779</a></p>
                </div>
                <div className="contact-info-card glass-card">
                  <div className="contact-info-card-icon">💬</div>
                  <h4>WhatsApp</h4>
                  <p><a href="https://wa.me/918341199779" target="_blank" rel="noopener noreferrer">Chat with us</a></p>
                </div>
                <div className="contact-info-card glass-card">
                  <div className="contact-info-card-icon">📧</div>
                  <h4>Email</h4>
                  <p><a href="mailto:svsgrands@gmail.com">svsgrands@gmail.com</a></p>
                </div>
                <div className="contact-info-card glass-card">
                  <div className="contact-info-card-icon">📸</div>
                  <h4>Instagram</h4>
                  <p><a href="https://www.instagram.com/svs_grands_vadapalli" target="_blank" rel="noopener noreferrer">@svs_grands_vadapalli</a></p>
                </div>
              </div>

              <div className="glass-card contact-address-card">
                <p>
                  <strong>📍 Address</strong><br />
                  D.no. 178/8A, Temple Road,<br />
                  Opp. Grama Panchayathi Office,<br />
                  Lolla, Vadapalli, Konaseema,<br />
                  Andhra Pradesh 533237, India
                </p>
              </div>

              <div className="contact-map">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d500!2d81.8094954!3d16.8136096!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a37bf93a8aae9b3%3A0x3d1fdecb0c83b2f!2sSVS+Grands+-+Rooms+in+Vadapalli!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="SVS Grands Location"
                ></iframe>

              </div>
            </div>

            {/* Right: Form */}
            <div className="contact-form">
              <h3>Drop us a line</h3>
              {sent && (
                <div className="contact-success">
                  ✅ Message sent successfully!
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Your Name *</label>
                  <input type="text" required placeholder="Full name" value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input type="tel" required placeholder="10-digit mobile" value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" placeholder="your@email.com" value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Your Query *</label>
                  <textarea required placeholder="How can we help you?" value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  SEND
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
