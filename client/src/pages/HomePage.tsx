import { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ReservationBar from '../components/ReservationBar';

// Import Swiper React components and modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';

interface LayoutContext {
  openBooking: (roomType?: string) => void;
}

const slides = [
  {
    boldText: 'A COZY FAMILY',
    normalText: 'STAY NEAR KONASEEMA TIRUPATHI TEMPLE.',
    bgImage: '/assets/rooms/classic/2.png',
    fgImage: '/assets/rooms/classic/1.png',
    thumbs: [
      '/assets/rooms/classic/1.png',
      '/assets/rooms/standard/1.png',
    ],
  },
  {
    boldText: 'RELAX & RECHARGE',
    normalText: 'THE PERFECT STAY IN VADAPALLI.',
    bgImage: '/assets/rooms/standard/2.png',
    fgImage: '/assets/rooms/superior/1.png',
    thumbs: [
      '/assets/rooms/superior/2.png',
      '/assets/rooms/deluxe/1.png',
    ],
  },
  {
    boldText: 'COMFORTABLE ROOMS',
    normalText: 'AT COMFORTABLE PRICES.',
    bgImage: '/assets/rooms/deluxe/2.png',
    fgImage: '/assets/rooms/deluxe/1.png',
    thumbs: [
      '/assets/rooms/standard/1.png',
      '/assets/rooms/classic/1.png',
    ],
  },
];

const roomCategories = [
  {
    id: 'STANDARD',
    name: 'Standard Room',
    image: '/assets/rooms/standard/1.png',
    price: '800',
    unit: '/12hrs',
    desc: 'Comfortable rooms with modern amenities — WiFi, TV (Optional), hot water and room service.'
  },
  {
    id: 'CLASSIC',
    name: 'Classic Room',
    image: '/assets/rooms/classic/1.png',
    price: '1,000',
    unit: '/12hrs',
    desc: 'Climate-controlled rooms for a premium stay — all amenities plus air conditioning. TV (Optional).'
  },
  {
    id: 'DELUXE',
    name: 'Deluxe Room',
    image: '/assets/rooms/deluxe/1.png',
    price: '1,500',
    unit: '/12hrs',
    desc: 'Spacious ground floor rooms with a double bed, TV, and premium furnishings for ultimate comfort.'
  },
  {
    id: 'SUPERIOR',
    name: 'Superior Room',
    image: '/assets/rooms/superior/1.png',
    price: '1,500',
    unit: '/12hrs',
    desc: 'Elegant first-floor double bed rooms offering extra privacy, modern decor, and top-tier amenities.'
  },
  {
    id: 'FAMILY_COMFORT',
    name: 'Family Comfort Room',
    image: '/assets/rooms/family-comfort/1.png',
    price: '1,200',
    unit: '/12hrs',
    desc: 'Perfect for families, these spacious first-floor rooms offer great value without compromising on comfort.'
  },
];

export default function HomePage() {
  const { openBooking } = useOutletContext<LayoutContext>();
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [phase, setPhase] = useState<'idle' | 'exit' | 'enter'>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const goToSlide = (index: number) => {
    if (index === current || phase !== 'idle') return;

    // Phase 1: EXIT — all elements leave simultaneously
    setPhase('exit');
    setPrev(current);

    // Phase 2: After exit completes (0.9s), swap content
    setTimeout(() => {
      setCurrent(index);

      // Phase 3: ENTER — new elements appear
      setTimeout(() => {
        setPhase('enter');
        // Return to idle after enter animation completes
        setTimeout(() => setPhase('idle'), 1000);
      }, 100);

      // Clear prev after BG crossfade completes (2s)
      setTimeout(() => setPrev(null), 2000);
    }, 900);
  };

  // Auto-play for hero
  useEffect(() => {
    if (phase !== 'idle') return;
    timerRef.current = setTimeout(() => {
      goToSlide((current + 1) % slides.length);
    }, 5000);
    return () => clearTimeout(timerRef.current);
  }, [current, phase]);

  const slide = slides[current];
  const isVisible = phase === 'idle' || phase === 'enter';

  const features = [
    { icon: '📍', title: 'Prime Location', desc: 'Just a 2-minute walk from the famous Sri Venkateswara Swamy Temple.' },
    { icon: '❄️', title: 'Classic & Standard Rooms', desc: '32 well-maintained rooms with flexible Classic and Standard options for every budget' },
    { icon: '🚗', title: 'Spacious Parking', desc: 'Ample parking space ensuring safety and convenience for your vehicles.' },
    { icon: '🛏️', title: 'Comfort & Hygiene', desc: 'Spotless rooms with premium linens, hot water, and excellent room service.' },
    { icon: '⏱️', title: 'Flexible Check-ins', desc: '24-hour and 12-hour booking slots available to match your travel schedule.' },
    { icon: '📞', title: '24/7 Support', desc: 'Our front desk is always available to make your stay hassle-free.' }
  ];

  return (
    <>
      {/* ========== HERO SECTION ========== */}
      <section className="hero-split">

        {/* LAYER 1: Full BG images — smooth crossfade (only reacts to current) */}
        {slides.map((s, i) => (
          <div
            key={`bg-${i}`}
            className={`hero-bg-layer ${i === current ? 'active' : ''}`}
            style={{ backgroundImage: `url('${s.bgImage}')` }}
          />
        ))}

        {/* LAYER 2: Static frosted overlay — NEVER MOVES */}
        <div className="hero-overlay-static" />

        {/* LAYER 3: Decorative circle — STATIC */}
        <div className="hero-deco-circle hero-deco-circle--1" />

        {/* LAYER 4: Text area */}
        <div className="hero-text-area">
          <div className="hero-text-content">
            {/* Badge — exits UP, enters from UP */}
            <div className={`hero-split-badge hero-anim-up ${isVisible ? 'visible' : ''}`}>
              BEST LODGE NEAR KONASEEMA TIRUPATHI
            </div>

            {/* Headline — exits DOWN, enters from DOWN */}
            <h1 className={`hero-split-headline hero-anim-down ${isVisible ? 'visible' : ''}`}>
              <strong>{slide.boldText}</strong>{' '}
              {slide.normalText}
            </h1>

            {/* Booking bar — COMPLETELY STATIC */}
            <div className="hero-reservation-wrapper">
              <ReservationBar inline />
            </div>
          </div>
        </div>

        {/* LAYER 5: Right featured image — sequential: old gone, then new appears */}
        <div className="hero-fg-container">
          <div
            key={`fg-${current}`}
            className={`hero-fg-panel ${isVisible ? 'active' : ''}`}
          >
            <img src={slide.fgImage} alt="" />
          </div>
        </div>

        {/* LAYER 6: Bottom thumbnails — slide left-to-right */}
        <div className="hero-thumbs" key={`strip-${current}`}>
          {slide.thumbs.map((src, i) => (
            <div className={`hero-thumb-card ${isVisible ? 'visible' : ''}`} key={i} style={{ animationDelay: `${i * 0.12}s` }}>
              <img src={src} alt={`Hotel view ${i + 1}`} loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      {/* ========== AMENITIES ========== */}
      <section className="about section-padding" id="about">
        <div className="container">
          <h2 className="section-title">Why Choose SVS Grands?</h2>
          <p className="section-subtitle">
            Established in 2024, SVS Grands offers modern comfort at budget-friendly prices — ideally located near the famous Konaseema Tirupathi temple.
          </p>
          <div className="about-grid">
            {features.map((f, i) => (
              <div className="about-card" key={i}>
                <span className="about-card-icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== ROOMS PREVIEW CAROUSEL ========== */}
      <section className="home-rooms-preview section-padding">
        <div className="container-fluid">
          <div className="container">
            <h2 className="section-title">Our Rooms</h2>
            <p className="section-subtitle">
              Choose from our curated collection of rooms — all designed for comfort and luxury. Flexible 12-hour and 24-hour stays available.
            </p>
          </div>

          <div className="home-rooms-carousel-wrapper">
            <Swiper
              modules={[Autoplay, FreeMode]}
              spaceBetween={30}
              slidesPerView={1}
              loop={true}
              speed={5000}
              freeMode={true}
              autoplay={{
                delay: 0,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 1.5,
                },
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
              className="home-rooms-swiper"
            >
              {roomCategories.map((room) => (
                <SwiperSlide key={room.id}>
                  <div className="home-room-card" onClick={() => openBooking(room.id)}>
                    <div className="home-room-image" style={{ backgroundImage: `url('${room.image}')` }} />
                    <div className="home-room-info">
                      <h3>{room.name}</h3>
                      <p className="home-room-price">From ₹{room.price} <small>{room.unit}</small></p>
                      <p className="home-room-desc">{room.desc}</p>
                      <Link to="/rooms" className="home-room-link" onClick={(e) => e.stopPropagation()}>View Details →</Link>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
    </>
  );
}
