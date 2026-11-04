import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function HeroSection({ onExploreShop, onDiscoverStory }) {
  return (
    <section style={{
      position: 'relative',
      backgroundColor: 'var(--bg-ivory)',
      borderBottom: '1px solid var(--border-taupe)',
      overflow: 'hidden',
    }}>
      <div className="container-wide" style={{ padding: '3.5rem 2rem 4.5rem' }}>
        {/* Asymmetrical 65/35 Editorial Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '3.5rem',
          alignItems: 'center',
        }} className="hero-editorial-grid">
          
          {/* 65% Large Fashion Editorial Image Column */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'relative',
              width: '100%',
              paddingTop: '68%', // Wide cinematic editorial crop
              overflow: 'hidden',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--border-taupe)',
              backgroundColor: '#DDD6CA',
            }}>
              <img
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=85"
                alt="Vintage fashion editorial lookbook"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'contrast(1.04) saturate(0.92)',
                }}
              />

              {/* Editorial film badge overlay */}
              <div style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                backgroundColor: 'rgba(41, 37, 31, 0.88)',
                color: 'var(--bg-ivory)',
                padding: '6px 14px',
                borderRadius: '2px',
                fontSize: '0.65rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-sans)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-burgundy)' }} />
                <span>35mm Film Exposure • Berlin Archive '24</span>
              </div>
            </div>

            {/* Small Editorial Caption underneath */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '0.85rem',
              fontSize: '0.7rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
            }}>
              <span>CATALOGUE REF. 09-94</span>
              <span>AUTHENTICATED EUROPEAN VINTAGE</span>
              <span>1 OF 1 PHYSICAL SPECIMENS</span>
            </div>
          </div>

          {/* 35% Editorial Copy Column */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingRight: '1rem',
          }}>
            <div className="section-label">
              COLLECTION N° 04 / ARCHIVE
            </div>

            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.4rem, 4vw, 3.75rem)',
              lineHeight: 1.08,
              fontWeight: 400,
              color: 'var(--text-primary)',
              margin: '0.5rem 0 1.5rem',
              letterSpacing: '-0.02em',
            }}>
              FOUND IN THE PAST.<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--accent-burgundy)' }}>
                WORN FOR THE FUTURE.
              </em>
            </h1>

            <p style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '1rem',
              lineHeight: 1.7,
              color: 'var(--text-secondary)',
              marginBottom: '2rem',
              maxWidth: '460px',
            }}>
              We scout rare second-hand garments from the 1970s through the early 2000s across Europe and Japan. Every seam inspected, authenticated, and measured down to the quarter-inch. Because good clothes deserve another life.
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              flexWrap: 'wrap',
            }}>
              <button
                onClick={onExploreShop}
                className="btn-primary"
              >
                <span>EXPLORE THE COLLECTION</span>
                <ArrowRight size={15} />
              </button>

              <button
                onClick={onDiscoverStory}
                className="editorial-link"
              >
                DISCOVER OUR STORY
              </button>
            </div>

            {/* Editorial Mini Proof Details */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              marginTop: '3.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border-taupe)',
            }}>
              <div>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--text-primary)', lineHeight: 1 }}>100%</p>
                <p style={{ fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: '4px' }}>Genuine Vintage</p>
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--text-primary)', lineHeight: 1 }}>1 of 1</p>
                <p style={{ fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: '4px' }}>Unique Curation</p>
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--text-primary)', lineHeight: 1 }}>COD</p>
                <p style={{ fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: '4px' }}>Cash On Delivery</p>
              </div>
            </div>

          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .hero-editorial-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}
