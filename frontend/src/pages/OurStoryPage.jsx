import React from 'react';
import { ArrowRight, Sparkles, Compass, ShieldCheck } from 'lucide-react';

export default function OurStoryPage({ onExploreShop }) {
  return (
    <div style={{ backgroundColor: 'var(--bg-ivory)', minHeight: '100vh', padding: '4rem 0 7rem' }}>
      <div className="container" style={{ maxWidth: '980px' }}>
        
        {/* Editorial Eyebrow & Headline */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>
            THE THRIFTED MANIFESTO
          </div>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            lineHeight: 1.08,
            letterSpacing: '-0.02em',
            margin: '0.4rem 0 1.5rem',
          }}>
            GOOD CLOTHES DESERVE<br />
            <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--accent-burgundy)' }}>
              ANOTHER LIFE.
            </em>
          </h1>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1.05rem',
            lineHeight: 1.8,
            color: 'var(--text-secondary)',
            maxWidth: '680px',
            margin: '0 auto',
          }}>
            We established THRIFTED at the crossroads of European vintage archives and contemporary Japanese streetwear aesthetics. An independent maison dedicated to the quiet luxury of clothing that has already stood the test of decades.
          </p>
        </div>

        {/* Large Editorial Photograph */}
        <div style={{
          position: 'relative',
          width: '100%',
          paddingTop: '55%',
          overflow: 'hidden',
          borderRadius: 'var(--radius-xs)',
          border: '1px solid var(--border-taupe)',
          backgroundColor: '#DDD6CA',
          marginBottom: '4.5rem',
        }}>
          <img
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1600&q=85"
            alt="European vintage fashion atelier curation"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            backgroundColor: 'rgba(41, 37, 31, 0.88)',
            color: '#fff',
            padding: '6px 14px',
            fontSize: '0.65rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            borderRadius: '2px',
          }}>
            Archive Workshop • Berlin Mitte Studio
          </div>
        </div>

        {/* Three Editorial Essays */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', marginBottom: '5rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2.5rem' }} className="story-split-grid">
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--accent-burgundy)' }}>
              01 / The Myth of Obsolescence
            </h3>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
              Mass fashion produces over 100 billion garments every single year, engineered deliberately with cheap synthetic blends to warp after ten wash cycles. Thirty years ago, garments were crafted with dense selvedge weaves, heavy ringspun cottons, and reinforced brass hardware meant to endure generations. We source garments that have survived thirty years and are built to survive thirty more.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2.5rem' }} className="story-split-grid">
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--accent-burgundy)' }}>
              02 / The Authenticity Ritual
            </h3>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
              Every single piece that arrives at our atelier goes through our rigorous three-stage inspection. We verify care tags, collar stitch counts, zipper stampings (Talon, Scovill, Ideal), and fabric yarn density. Nothing is dry-cleaned with harsh petrochemicals; instead, every garment is sanitized with non-invasive botanical steam.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2.5rem' }} className="story-split-grid">
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--accent-burgundy)' }}>
              03 / One of One Identity
            </h3>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
              Style isn't wearing whatever algorithmically trending garment ten thousand people bought this week. Style is wearing a 1988 Schott Perfecto with authentic sun wear, or a 1994 Levi's with whiskers created by someone who walked through another era. When you wear THRIFTED, nobody else in the room is wearing your garment.
            </p>
          </div>

        </div>

        {/* Call to action */}
        <div style={{
          backgroundColor: 'var(--bg-sage-light)',
          border: '1px solid var(--bg-sage)',
          padding: '3.5rem 2rem',
          textAlign: 'center',
          borderRadius: 'var(--radius-xs)',
        }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', marginBottom: '0.75rem' }}>
            Ready to find your personal archive piece?
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.75rem', maxWidth: '440px', margin: '0 auto 1.75rem' }}>
            Browse through authenticated Japanese streetwear, vintage denim, and European leather.
          </p>
          <button onClick={onExploreShop} className="btn-primary">
            <span>EXPLORE THE CURRENT DROP</span>
            <ArrowRight size={15} />
          </button>
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .story-split-grid {
            grid-template-columns: 1fr !important;
            gap: 0.75rem !important;
          }
        }
      `}</style>
    </div>
  );
}
