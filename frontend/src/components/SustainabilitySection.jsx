import React from 'react';
import { RefreshCw, Compass, Scissors } from 'lucide-react';

export default function SustainabilitySection() {
  return (
    <section style={{
      padding: '5rem 0',
      backgroundColor: 'var(--bg-ivory)',
      borderBottom: '1px solid var(--border-taupe)',
    }}>
      <div className="container" style={{ maxWidth: '980px' }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem',
        }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>
            CIRCULARITY & STEWARDSHIP
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.8rem, 3.2vw, 2.7rem)',
            fontWeight: 400,
            letterSpacing: '-0.015em',
            margin: '0.4rem 0 1rem',
          }}>
            THE MOST SUSTAINABLE GARMENT ALREADY EXISTS
          </h2>
          <p style={{
            fontSize: '0.95rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            maxWidth: '640px',
            margin: '0 auto',
          }}>
            We choose not to add to the world’s overproduction of synthetic textiles. Instead, we hunt down the enduring garments produced decades ago when clothing was constructed to be mended, inherited, and treasured.
          </p>
        </div>

        {/* 3 Pillars */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2.5rem',
          textAlign: 'center',
        }} className="sustainability-pillars">
          <div style={{ padding: '1rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-sage-light)',
              color: 'var(--accent-burgundy)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}>
              <RefreshCw size={20} strokeWidth={1.8} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
              True Longevity
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Pieces made with ring-spun cotton, genuine leather, and dense wool that outlive seasonal trends.
            </p>
          </div>

          <div style={{ padding: '1rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-sage-light)',
              color: 'var(--accent-burgundy)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}>
              <Scissors size={20} strokeWidth={1.8} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
              Condition Integrity
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Every item is professionally cleaned, stabilized, and accurately documented with exact measurements.
            </p>
          </div>

          <div style={{ padding: '1rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-sage-light)',
              color: 'var(--accent-burgundy)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}>
              <Compass size={20} strokeWidth={1.8} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
              Individual Style
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Never walk into a room wearing the same mass-market item as someone else. One of one, forever.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .sustainability-pillars {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}
