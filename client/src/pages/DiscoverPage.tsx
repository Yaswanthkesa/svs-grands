import { useState } from 'react';

const attractions = [
  {
    icon: '🛕',
    name: 'Sri Venkateswara Swamy Temple',
    distance: '~400 m',
    travelTime: '5 min walk',
    description: 'Known as "Konaseema Tirupathi", this ancient temple dedicated to Lord Venkateswara is the primary pilgrimage destination in the region. Thousands of devotees visit this sacred temple every year.',
  },
  {
    icon: '🏛️',
    name: 'Ryali Jaganmohini Kesava Swamy Temple',
    distance: '~14 km',
    travelTime: '25 min drive',
    description: 'Famous for its stunning single black stone idol of Lord Vishnu. A must-visit spiritual site in the Konaseema region, renowned for its architectural beauty.',
  },
  {
    icon: '🕉️',
    name: 'Draksharamam Temple',
    distance: '~25 km',
    travelTime: '40 min drive',
    description: 'One of the five sacred Pancharama Kshetras — an ancient Shiva temple known for its magnificent architecture and spiritual significance.',
  },
  {
    icon: '🌊',
    name: 'Godavari River & Scenic Views',
    distance: '~5 km',
    travelTime: '10 min drive',
    description: 'Experience the lush paddy fields, swaying coconut groves, and the serene banks of the mighty Godavari river.',
  },
  {
    icon: '🚤',
    name: 'Dindi Backwaters',
    distance: '~20 km',
    travelTime: '35 min drive',
    description: 'Enjoy backwater boating on the Godavari delta — a tranquil and picturesque experience amidst nature\'s beauty.',
  },
  {
    icon: '🍬',
    name: 'Atreyapuram — Pootharekulu',
    distance: '~10 km',
    travelTime: '18 min drive',
    description: 'Visit the birthplace of the famous Andhra sweet "Pootharekulu" — paper-thin rice sheets filled with jaggery and ghee.',
  },
];

export default function DiscoverPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = attractions[activeIndex];

  return (
    <div className="discover-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <h1 className="page-header-title">Discover Vadapalli</h1>
          <div className="page-header-ornament">
            <span /><span /><span />
          </div>
          <p className="page-header-subtitle">
            Explore the spiritual and natural wonders of Konaseema — all just a short drive from SVS Grands.
          </p>
        </div>
      </div>

      {/* Attraction Viewer — Sidebar + Content */}
      <div className="discover-viewer">
        {/* Left Sidebar */}
        <div className="discover-sidebar">
          <h3 className="discover-sidebar-title">Places to Visit</h3>
          {attractions.map((a, i) => (
            <div
              key={i}
              className={`discover-sidebar-item ${i === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(i)}
            >
              <span className="discover-sidebar-icon">{a.icon}</span>
              <span className="discover-sidebar-label">{a.name}</span>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="discover-main">
          <div className="discover-main-icon">{active.icon}</div>
          <h2 className="discover-main-title">{active.name}</h2>
          <div className="discover-main-distance">
            <span>📍 {active.distance}</span>
            <span>·</span>
            <span>🕐 {active.travelTime}</span>
          </div>
          <p className="discover-main-desc">{active.description}</p>
          <div className="discover-main-tip">
            <strong>💡 Travel Tip:</strong> SVS Grands is ideally located near all major Konaseema attractions. Ask at the front desk for local transport recommendations.
          </div>
        </div>
      </div>
    </div>
  );
}
