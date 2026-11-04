import React from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';

export default function CategoryEditorialSection({ onSelectCategory }) {
  const categories = [
    {
      num: '01',
      title: "Girls' Thrift Dresses & Skirts",
      slug: 'girls-dresses',
      subtitle: '90s grunge plaid pinafores, floral cottagecore midis, Y2K cowl slip dresses & tennis skirts from ₹449.',
      tag: 'GIRLS & WOMEN • FROM ₹449',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
    },
    {
      num: '02',
      title: "Boys' Sports Jerseys & Streetwear",
      slug: 'boys-jerseys',
      subtitle: 'Authentic MLB baseball pinstripes, 90s Champion NBA jerseys, hockey sweaters & moto racing tops.',
      tag: 'BOYS & MEN • FROM ₹499',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
    },
    {
      num: '03',
      title: 'Jackets, Leather & Windbreakers',
      slug: 'leather-outerwear',
      subtitle: '90s color-block nylon windbreakers, vintage distressed café racer bikers & collegiate varsity jackets.',
      tag: 'OUTERWEAR • UNDER ₹1,499',
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80',
    },
    {
      num: '04',
      title: 'Graphic Tees & 90s Streetwear',
      slug: 'graphic-tees',
      subtitle: 'Single-stitch band tour tees, Japanese anime cyber blanks, collegiate lettering & sun-faded washes.',
      tag: 'UNDER ₹499 & ₹549',
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80',
    },
  ];

  return (
    <section style={{
      padding: '5rem 0',
      backgroundColor: 'var(--bg-ivory)',
      borderBottom: '1px solid var(--border-taupe)',
    }}>
      <div className="container-wide">
        {/* Editorial Section Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}>
          <div>
            <div className="section-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={13} color="var(--accent-burgundy)" />
              <span>AUTHENTIC SECONDHAND CURATION</span>
            </div>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2rem, 3.5vw, 3.1rem)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              margin: '0.2rem 0',
            }}>
              THRIFT DIRECTORY FOR BOYS & GIRLS
            </h2>
          </div>

          <p style={{
            maxWidth: '400px',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
          }}>
            Every garment has been handpicked for authentic condition, measured in real chest & length inches, and priced at honest affordable thrift rates.
          </p>
        </div>

        {/* Asymmetrical Editorial Grid */}
        <div className="category-asymmetrical-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '2rem',
        }}>
          {/* Card 1: Girls' Thrift Dresses (Span 6 cols, tall) */}
          <div
            onClick={() => onSelectCategory(categories[0].slug)}
            className="category-editorial-card"
            style={{
              gridColumn: 'span 6',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              border: '1px solid var(--border-taupe)',
              backgroundColor: '#E7E2D8',
              height: '480px',
              borderRadius: '2px',
            }}
          >
            <img
              src={categories[0].image}
              alt={categories[0].title}
              className="cat-img"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(20, 15, 12, 0.9) 0%, rgba(20, 15, 12, 0.3) 50%, transparent 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '2rem',
              color: '#fff',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.68rem',
                  letterSpacing: '0.14em',
                  fontWeight: 700,
                  backgroundColor: '#880e4f',
                  padding: '3px 8px',
                  borderRadius: '2px',
                }}>
                  {categories[0].tag}
                </span>
                <span className="arrow-badge" style={{ backgroundColor: 'rgba(255,255,255,0.25)', padding: '6px', borderRadius: '50%' }}>
                  <ArrowUpRight size={18} />
                </span>
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.1rem', color: '#fff', marginBottom: '0.4rem', lineHeight: 1.15 }}>
                  {categories[0].title}
                </h3>
                <p style={{ color: 'var(--border-taupe)', fontSize: '0.85rem', lineHeight: 1.4, maxWidth: '90%' }}>
                  {categories[0].subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Boys' Sports Jerseys (Span 6 cols, tall) */}
          <div
            onClick={() => onSelectCategory(categories[1].slug)}
            className="category-editorial-card"
            style={{
              gridColumn: 'span 6',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              border: '1px solid var(--border-taupe)',
              backgroundColor: '#E7E2D8',
              height: '480px',
              borderRadius: '2px',
            }}
          >
            <img
              src={categories[1].image}
              alt={categories[1].title}
              className="cat-img"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(12, 20, 35, 0.9) 0%, rgba(12, 20, 35, 0.3) 50%, transparent 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '2rem',
              color: '#fff',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.68rem',
                  letterSpacing: '0.14em',
                  fontWeight: 700,
                  backgroundColor: '#0d47a1',
                  padding: '3px 8px',
                  borderRadius: '2px',
                }}>
                  {categories[1].tag}
                </span>
                <span className="arrow-badge" style={{ backgroundColor: 'rgba(255,255,255,0.25)', padding: '6px', borderRadius: '50%' }}>
                  <ArrowUpRight size={18} />
                </span>
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.1rem', color: '#fff', marginBottom: '0.4rem', lineHeight: 1.15 }}>
                  {categories[1].title}
                </h3>
                <p style={{ color: 'var(--border-taupe)', fontSize: '0.85rem', lineHeight: 1.4, maxWidth: '90%' }}>
                  {categories[1].subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Jackets & Outerwear (Span 6 cols) */}
          <div
            onClick={() => onSelectCategory(categories[2].slug)}
            className="category-editorial-card"
            style={{
              gridColumn: 'span 6',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              border: '1px solid var(--border-taupe)',
              backgroundColor: '#E7E2D8',
              height: '250px',
              borderRadius: '2px',
            }}
          >
            <img
              src={categories[2].image}
              alt={categories[2].title}
              className="cat-img"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(25, 20, 18, 0.9) 0%, rgba(25, 20, 18, 0.2) 60%, transparent 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '1.5rem',
              color: '#fff',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.65rem', letterSpacing: '0.14em', fontWeight: 700, backgroundColor: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '2px' }}>
                  {categories[2].tag}
                </span>
                <span className="arrow-badge" style={{ backgroundColor: 'rgba(255,255,255,0.25)', padding: '5px', borderRadius: '50%' }}>
                  <ArrowUpRight size={16} />
                </span>
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.65rem', color: '#fff', marginBottom: '0.2rem' }}>
                  {categories[2].title}
                </h3>
                <p style={{ color: 'var(--border-taupe)', fontSize: '0.78rem' }}>
                  {categories[2].subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Card 4: Graphic Tees (Span 6 cols) */}
          <div
            onClick={() => onSelectCategory(categories[3].slug)}
            className="category-editorial-card"
            style={{
              gridColumn: 'span 6',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              border: '1px solid var(--border-taupe)',
              backgroundColor: '#E7E2D8',
              height: '250px',
              borderRadius: '2px',
            }}
          >
            <img
              src={categories[3].image}
              alt={categories[3].title}
              className="cat-img"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(20, 20, 20, 0.9) 0%, rgba(20, 20, 20, 0.2) 60%, transparent 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '1.5rem',
              color: '#fff',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.65rem', letterSpacing: '0.14em', fontWeight: 700, backgroundColor: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '2px' }}>
                  {categories[3].tag}
                </span>
                <span className="arrow-badge" style={{ backgroundColor: 'rgba(255,255,255,0.25)', padding: '5px', borderRadius: '50%' }}>
                  <ArrowUpRight size={16} />
                </span>
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.65rem', color: '#fff', marginBottom: '0.2rem' }}>
                  {categories[3].title}
                </h3>
                <p style={{ color: 'var(--border-taupe)', fontSize: '0.78rem' }}>
                  {categories[3].subtitle}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .category-editorial-card:hover .cat-img {
          transform: scale(1.04);
        }
        @media (max-width: 900px) {
          .category-asymmetrical-grid {
            grid-template-columns: 1fr !important;
          }
          .category-editorial-card {
            grid-column: span 1 !important;
            height: 340px !important;
          }
        }
      `}</style>
    </section>
  );
}
