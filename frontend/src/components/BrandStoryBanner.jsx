import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function BrandStoryBanner({ onDiscoverStory }) {
  return (
    <section style={{
      backgroundColor: 'var(--bg-sage)',
      color: '#1E1B17',
      position: 'relative',
      overflow: 'hidden',
      borderTop: '1px solid var(--border-taupe)',
      borderBottom: '1px solid var(--border-taupe)',
    }}>
      <div className="container-wide" style={{ padding: '5.5rem 2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'center',
        }} className="brand-story-grid">
          
          {/* Editorial Photograph */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'relative',
              width: '100%',
              paddingTop: '80%',
              overflow: 'hidden',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid rgba(41, 37, 31, 0.15)',
              backgroundColor: '#959B81',
            }}>
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80"
                alt="Vintage fashion preservation and craftsmanship"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'contrast(1.05) saturate(0.95)',
                }}
              />
            </div>
            
            {/* Stamp label */}
            <div style={{
              position: 'absolute',
              top: '-14px',
              right: '-14px',
              backgroundColor: 'var(--bg-espresso)',
              color: 'var(--bg-ivory)',
              padding: '8px 16px',
              borderRadius: '2px',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.68rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight: 700,
            }}>
              CIRCULAR FASHION • 1994–PRESENT
            </div>
          </div>

          {/* Editorial Text */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.72rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontWeight: 700,
              color: '#3B412B',
              marginBottom: '0.75rem',
            }}>
              <span>THE THRIFTED PHILOSOPHY</span>
            </div>

            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.2rem, 3.8vw, 3.4rem)',
              lineHeight: 1.1,
              fontWeight: 400,
              color: '#1E1B17',
              margin: '0.5rem 0 1.5rem',
              letterSpacing: '-0.02em',
            }}>
              NOT JUST SECOND-HAND.<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300, color: '#3A1E1E' }}>
                SECOND TO NONE.
              </em>
            </h2>

            <p style={{
              fontSize: '1rem',
              lineHeight: 1.75,
              color: '#2F3323',
              marginBottom: '1.25rem',
            }}>
              True vintage isn’t about wearing someone else’s leftovers. It’s an intentional rebellion against fast fashion’s planned obsolescence. The garments made thirty and forty years ago were cut from denser yarns, heavier selvedge denims, and full-grain leathers built to withstand decades of life.
            </p>

            <p style={{
              fontSize: '0.9375rem',
              lineHeight: 1.7,
              color: '#3B412B',
              marginBottom: '2rem',
            }}>
              By investing in pre-loved clothing, you honor the artisans of the past while carving out a wardrobe that is unequivocally, uniquely yours.
            </p>

            <button
              onClick={onDiscoverStory}
              className="btn-primary"
              style={{
                backgroundColor: 'var(--bg-espresso)',
                color: 'var(--bg-ivory)',
                borderColor: 'var(--bg-espresso)',
              }}
            >
              <span>WHY THRIFTED?</span>
              <ArrowRight size={15} />
            </button>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .brand-story-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}
