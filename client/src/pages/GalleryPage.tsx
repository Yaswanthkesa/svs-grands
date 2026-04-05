import { useState } from 'react';

const images = [
  { src: '/assets/exterior.png', alt: 'SVS Grands Exterior', category: 'property' },
  { src: '/assets/room-ac.png', alt: 'AC Room', category: 'rooms' },
  { src: '/assets/room-nonac.png', alt: 'Non-AC Room', category: 'rooms' },
  { src: '/assets/room-ac.png', alt: 'Room Interior', category: 'rooms' },
  { src: '/assets/room-nonac.png', alt: 'Comfortable Rooms', category: 'rooms' },
  { src: '/assets/exterior.png', alt: 'Lodge View', category: 'property' },
  { src: '/assets/room-ac.png', alt: 'Room Setup', category: 'rooms' },
  { src: '/assets/logo.png', alt: 'SVS Grands Logo', category: 'property' },
];

export default function GalleryPage() {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  return (
    <div className="gallery-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <h1 className="page-header-title">Gallery</h1>
          <div className="page-header-ornament">
            <span /><span /><span />
          </div>
          <p className="page-header-subtitle">
            Take a virtual tour of SVS Grands — our rooms, facilities, and surroundings.
          </p>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="gallery-content">
        <div className="container">
          <div className="gallery-grid">
            {images.map((img, i) => (
              <div
                className={`gallery-item ${i === 0 ? 'gallery-item-featured' : ''}`}
                key={i}
                onClick={() => setLightboxIdx(i)}
              >
                <img src={img.src} alt={img.alt} loading="lazy" />
                <div className="gallery-item-overlay">
                  <span className="gallery-item-zoom">🔍</span>
                  <span className="gallery-item-label">{img.alt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div className="lightbox" onClick={() => setLightboxIdx(null)}>
          <button className="lightbox-close" onClick={() => setLightboxIdx(null)}>✕</button>
          <button className="lightbox-nav lightbox-prev" onClick={(e) => {
            e.stopPropagation();
            setLightboxIdx(prev => prev !== null ? (prev - 1 + images.length) % images.length : 0);
          }}>‹</button>
          <img src={images[lightboxIdx].src} alt={images[lightboxIdx].alt} onClick={e => e.stopPropagation()} />
          <button className="lightbox-nav lightbox-next" onClick={(e) => {
            e.stopPropagation();
            setLightboxIdx(prev => prev !== null ? (prev + 1) % images.length : 0);
          }}>›</button>
          <div className="lightbox-caption">{images[lightboxIdx].alt}</div>
        </div>
      )}
    </div>
  );
}
