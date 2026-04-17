import { useState, useRef, useEffect } from 'react';

type MediaType = 'image' | 'video';
type Category = 'all' | 'ac-rooms' | 'non-ac-rooms' | 'exterior';

interface GalleryItem {
  src: string;
  alt: string;
  category: Category;
  type: MediaType;
  poster?: string; // thumbnail for videos
}

const galleryItems: GalleryItem[] = [
  // AC Rooms — Images
  { src: '/assets/gallery/ac-room/first-floor-ac.jpeg', alt: 'First Floor AC Room', category: 'ac-rooms', type: 'image' },
  { src: '/assets/gallery/ac-room/first-floor-ac-1.jpeg', alt: 'First Floor AC Room — View 2', category: 'ac-rooms', type: 'image' },
  { src: '/assets/gallery/ac-room/first-floor-ac-2.jpeg', alt: 'First Floor AC Room — View 3', category: 'ac-rooms', type: 'image' },
  { src: '/assets/gallery/ac-room/first-floor-ac-3.jpeg', alt: 'First Floor AC Room — View 4', category: 'ac-rooms', type: 'image' },
  { src: '/assets/gallery/ac-room/ground-floor-ac.jpeg', alt: 'Ground Floor AC Room', category: 'ac-rooms', type: 'image' },
  { src: '/assets/gallery/ac-room/ground-floor-ac-1.jpeg', alt: 'Ground Floor AC Room — View 2', category: 'ac-rooms', type: 'image' },
  { src: '/assets/gallery/ac-room/ground-floor-ac-2.jpeg', alt: 'Ground Floor AC Room — View 3', category: 'ac-rooms', type: 'image' },
  // AC Rooms — Videos
  { src: '/assets/gallery/ac-room/first-floor-ac.mp4', alt: 'First Floor AC Room Tour', category: 'ac-rooms', type: 'video', poster: '/assets/gallery/ac-room/first-floor-ac.jpeg' },
  { src: '/assets/gallery/ac-room/ground-floor-ac-room.mp4', alt: 'Ground Floor AC Room Tour', category: 'ac-rooms', type: 'video', poster: '/assets/gallery/ac-room/ground-floor-ac.jpeg' },
  { src: '/assets/gallery/ac-room/ac-room-tour-1.mp4', alt: 'AC Room Walkthrough 1', category: 'ac-rooms', type: 'video', poster: '/assets/gallery/ac-room/first-floor-ac-1.jpeg' },
  { src: '/assets/gallery/ac-room/ac-room-tour-2.mp4', alt: 'AC Room Walkthrough 2', category: 'ac-rooms', type: 'video', poster: '/assets/gallery/ac-room/ground-floor-ac-1.jpeg' },
  // Non-AC Rooms
  { src: '/assets/gallery/non-ac-room/first-floor-nonac.jpeg', alt: 'Non-AC Room', category: 'non-ac-rooms', type: 'image' },
  { src: '/assets/gallery/non-ac-room/non-ac-room-tour.mp4', alt: 'Non-AC Room Tour', category: 'non-ac-rooms', type: 'video', poster: '/assets/gallery/non-ac-room/first-floor-nonac.jpeg' },
  // Exterior / Interior
  { src: '/assets/gallery/exterior/ground-floor-corridor.jpeg', alt: 'Ground Floor Corridor', category: 'exterior', type: 'image' },
  { src: '/assets/gallery/exterior/ground-floor-corridor.mp4', alt: 'Corridor Walkthrough', category: 'exterior', type: 'video', poster: '/assets/gallery/exterior/ground-floor-corridor.jpeg' },
  { src: '/assets/gallery/exterior/first-floor-hall.mp4', alt: 'First Floor Hall Tour', category: 'exterior', type: 'video', poster: '/assets/gallery/exterior/ground-floor-corridor.jpeg' },
];

const categories: { key: Category; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'ac-rooms', label: 'AC Rooms' },
  { key: 'non-ac-rooms', label: 'Non-AC Rooms' },
  { key: 'exterior', label: 'Property' },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const lightboxVideoRef = useRef<HTMLVideoElement | null>(null);

  const filtered = activeCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  const openLightbox = (idx: number) => setLightboxIdx(idx);
  const closeLightbox = () => {
    if (lightboxVideoRef.current) lightboxVideoRef.current.pause();
    setLightboxIdx(null);
  };
  const prevItem = () => setLightboxIdx(prev => prev !== null ? (prev - 1 + filtered.length) % filtered.length : 0);
  const nextItem = () => setLightboxIdx(prev => prev !== null ? (prev + 1) % filtered.length : 0);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIdx === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevItem();
      if (e.key === 'ArrowRight') nextItem();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxIdx, filtered.length]);

  const imageCount = filtered.filter(i => i.type === 'image').length;
  const videoCount = filtered.filter(i => i.type === 'video').length;

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

      {/* Category Filter Bar */}
      <div className="gallery-filter-bar">
        <div className="container">
          <div className="gallery-filters">
            {categories.map(cat => (
              <button
                key={cat.key}
                className={`gallery-filter-btn ${activeCategory === cat.key ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.key)}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="gallery-count">
            <span>{imageCount} Photo{imageCount !== 1 ? 's' : ''}</span>
            <span className="gallery-count-sep">·</span>
            <span>{videoCount} Video{videoCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="gallery-content">
        <div className="container">
          <div className="gallery-grid">
            {filtered.map((item, i) => (
              <div
                className={`gallery-item ${i === 0 ? 'gallery-item-featured' : ''}`}
                key={`${item.src}-${i}`}
                onClick={() => openLightbox(i)}
              >
                {item.type === 'video' ? (
                  <div className="gallery-video-thumb">
                    <img
                      src={item.poster || '/assets/gallery/exterior/ground-floor-corridor.jpeg'}
                      alt={item.alt}
                      loading="lazy"
                    />
                    <div className="gallery-play-badge">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                ) : (
                  <img src={item.src} alt={item.alt} loading="lazy" />
                )}
                <div className="gallery-item-overlay">
                  <span className="gallery-item-zoom">{item.type === 'video' ? '▶' : '🔍'}</span>
                  <span className="gallery-item-label">{item.alt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>✕</button>
          <button className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); prevItem(); }}>‹</button>

          {filtered[lightboxIdx].type === 'video' ? (
            <video
              ref={lightboxVideoRef}
              key={filtered[lightboxIdx].src}
              src={filtered[lightboxIdx].src}
              controls
              autoPlay
              className="lightbox-video"
              onClick={e => e.stopPropagation()}
            />
          ) : (
            <img src={filtered[lightboxIdx].src} alt={filtered[lightboxIdx].alt} onClick={e => e.stopPropagation()} />
          )}

          <button className="lightbox-nav lightbox-next" onClick={(e) => { e.stopPropagation(); nextItem(); }}>›</button>
          <div className="lightbox-caption">
            {filtered[lightboxIdx].type === 'video' && <span className="lightbox-badge">VIDEO</span>}
            {filtered[lightboxIdx].alt}
          </div>
          <div className="lightbox-counter">{lightboxIdx + 1} / {filtered.length}</div>
        </div>
      )}
    </div>
  );
}
