import React from 'react';

export default function AnnouncementBar() {
  return (
    <aside aria-label="Announcement" style={{
      backgroundColor: 'var(--accent-burgundy)',
      color: 'var(--bg-ivory)',
      fontSize: '0.6875rem',
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      fontWeight: 600,
      textAlign: 'center',
      padding: '0.55rem 1rem',
      position: 'relative',
      zIndex: 50,
      borderBottom: '1px solid rgba(0,0,0,0.1)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
        <span>🔥 FRESH THRIFT DROPS FOR BOYS & GIRLS</span>
        <span style={{ opacity: 0.4, display: 'inline-block' }}>•</span>
        <span>DRESSES & SPORTS JERSEYS UNDER ₹499 & ₹999</span>
        <span style={{ opacity: 0.4, display: 'inline-block' }}>•</span>
        <span style={{ opacity: 0.9 }}>REAL INCH CHEST MEASUREMENTS • PAN-INDIA DELIVERY</span>
      </div>
    </aside>
  );
}
