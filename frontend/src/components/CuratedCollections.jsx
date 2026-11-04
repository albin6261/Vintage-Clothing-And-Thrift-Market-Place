import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function CuratedCollections({ onSelectCollection }) {
  const collections = [
    {
      title: "Girls' Thrift Dresses",
      subtitle: 'Y2K slip dresses, floral cottagecore midis & 90s grunge pinafores.',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      tag: 'FROM ₹449',
    },
    {
      title: "Boys' Sports Jerseys",
      subtitle: 'Majestic MLB baseball jerseys, Champion NBA singlets & hockey sweaters.',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      tag: 'AUTHENTIC REPS',
    },
    {
      title: 'Under ₹499 Steals',
      subtitle: 'Budget vintage finds, baby tees, mini sundresses & concert blanks.',
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
      tag: 'STEAL DEALS',
    },
    {
      title: 'Jackets & Outerwear',
      subtitle: '90s color-block windbreakers, distressed cafe racers & varsity jackets.',
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
      tag: 'UNDER ₹1,499',
    },
    {
      title: '90s Streetwear',
      subtitle: 'Boxy tour tees, baggy skater carpenter denim & Coogi-wave knits.',
      image: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
      tag: 'BAGGY SILHOUETTES',
    },
  ];

  return (
    <section style={{
      padding: '6rem 0',
      backgroundColor: 'var(--bg-ivory)',
      borderBottom: '1px solid var(--border-taupe)',
    }}>
      <div className="container-wide">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '3rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <div className="section-label">THEMED CAPSULES</div>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
            }}>
              CURATED ARCHIVE COLLECTIONS
            </h2>
          </div>
          <span style={{ fontSize: '0.8rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            EXPLORE BY ERA & MOOD
          </span>
        </div>

        {/* 5-column / responsive collections grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '1.25rem',
        }} className="collections-grid">
          {collections.map((col, index) => (
            <div
              key={index}
              onClick={() => onSelectCollection(col.title)}
              className="collection-card"
              style={{
                position: 'relative',
                height: '420px',
                overflow: 'hidden',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid var(--border-taupe)',
                cursor: 'pointer',
                backgroundColor: '#E5DFD4',
              }}
            >
              <img
                src={col.image}
                alt={col.title}
                className="col-img"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease',
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(41, 37, 31, 0.92) 0%, rgba(41, 37, 31, 0.25) 55%, transparent 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.5rem',
                color: '#fff',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '0.62rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    color: 'var(--border-taupe)',
                  }}>
                    {col.tag}
                  </span>
                  <span className="col-arrow" style={{
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    padding: '5px',
                    borderRadius: '50%',
                    transition: 'background-color 0.25s ease',
                  }}>
                    <ArrowUpRight size={15} />
                  </span>
                </div>

                <div>
                  <h3 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.35rem',
                    color: '#fff',
                    marginBottom: '0.35rem',
                    lineHeight: 1.2,
                  }}>
                    {col.title}
                  </h3>
                  <p style={{
                    fontSize: '0.72rem',
                    color: 'var(--border-taupe)',
                    lineHeight: 1.4,
                  }}>
                    {col.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .collection-card:hover .col-img {
          transform: scale(1.06);
        }
        .collection-card:hover .col-arrow {
          background-color: var(--accent-burgundy) !important;
        }
        @media (max-width: 1200px) {
          .collections-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .collections-grid {
            grid-template-columns: 1fr !important;
          }
          .collection-card {
            height: 300px !important;
          }
        }
      `}</style>
    </section>
  );
}
