import React from 'react';

export default function EditorialLookbook() {
  const editorialShots = [
    {
      img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      caption: 'Look 01: 1990s oversized double-breasted tailoring layered over single-stitch band cotton.',
      credit: 'Captured on Kodak Portra 400',
    },
    {
      img: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80',
      caption: 'Look 02: 1984 Carhartt Dearborn duck canvas paired with pleated tropical wool.',
      credit: 'Tokyo Harajuku Archive',
    },
    {
      img: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
      caption: 'Look 03: Sun-washed 1978 French moleskin chore jacket with silver signet jewelry.',
      credit: 'Parisian Marais Streetwear',
    },
  ];

  return (
    <section style={{
      padding: '6rem 0',
      backgroundColor: 'var(--bg-card)',
      borderBottom: '1px solid var(--border-taupe)',
    }}>
      <div className="container-wide">
        {/* Magazine Editorial Header */}
        <div style={{
          textAlign: 'center',
          maxWidth: '680px',
          margin: '0 auto 3.5rem',
        }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>
            FASHION EDITORIAL VOL. IV
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.3rem, 4.2vw, 3.8rem)',
            letterSpacing: '-0.02em',
            margin: '0.4rem 0 1rem',
          }}>
            WORN DIFFERENTLY
          </h2>
          <p style={{
            fontSize: '0.95rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
          }}>
            How collectors, stylists, and creatives style THRIFTED archival garments across European and Asian capitals. No rules, just proportion, texture, and character.
          </p>
        </div>

        {/* Collage Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2.5rem',
        }} className="lookbook-grid">
          {editorialShots.map((shot, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{
                position: 'relative',
                width: '100%',
                paddingTop: idx === 1 ? '145%' : '130%', // Mixed editorial height
                overflow: 'hidden',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid var(--border-taupe)',
                backgroundColor: '#EDE8DF',
                marginBottom: '1rem',
              }}>
                <img
                  src={shot.img}
                  alt={shot.caption}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>

              <div style={{
                borderTop: '1px solid var(--border-light)',
                paddingTop: '0.75rem',
              }}>
                <p style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.05rem',
                  color: 'var(--text-primary)',
                  lineHeight: 1.45,
                  marginBottom: '0.4rem',
                }}>
                  {shot.caption}
                </p>
                <span style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--accent-burgundy)',
                  fontWeight: 600,
                }}>
                  {shot.credit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .lookbook-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
        }
      `}</style>
    </section>
  );
}
