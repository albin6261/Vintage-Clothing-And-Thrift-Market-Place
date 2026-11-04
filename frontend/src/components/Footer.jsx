import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-espresso-deep)',
      color: 'var(--bg-ivory)',
      padding: '5rem 0 3rem',
      borderTop: '1px solid var(--border-dark)',
    }}>
      <div className="container-wide">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1.2fr',
          gap: '3.5rem',
          marginBottom: '4.5rem',
        }} className="footer-columns-grid">
          
          {/* Column 1: Brand & Philosophy */}
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <span style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '2.4rem',
                letterSpacing: '0.12em',
                fontWeight: 600,
                textTransform: 'uppercase',
                display: 'block',
                lineHeight: 1,
                color: '#fff',
              }}>
                THRIFTED
              </span>
              <span style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.62rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--bg-sage)',
                fontWeight: 600,
                display: 'block',
                marginTop: '6px',
              }}>
                EUROPEAN VINTAGE & ARCHIVAL BOUTIQUE
              </span>
            </div>

            <p style={{
              fontSize: '0.9rem',
              lineHeight: 1.7,
              color: 'var(--border-taupe)',
              maxWidth: '380px',
              marginBottom: '1.5rem',
            }}>
              "Good clothes deserve another life." An independent platform for authenticated second-hand clothing, Japanese archive, and rare vintage specimens.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  color: 'var(--bg-ivory)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>Instagram</span>
                <ArrowUpRight size={13} />
              </a>
              <span style={{ color: 'var(--border-dark)' }}>•</span>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  color: 'var(--bg-ivory)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>Archive Board</span>
                <ArrowUpRight size={13} />
              </a>
            </div>
          </div>

          {/* Column 2: Shop Links */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight: 700,
              color: 'var(--bg-sage)',
              marginBottom: '1.5rem',
            }}>
              DIRECTORY
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <li>
                <button
                  onClick={() => onNavigate('shop')}
                  style={{ background: 'none', border: 'none', color: 'var(--border-taupe)', fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                >
                  All Archive Pieces
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', { category: 'vintage-denim' })}
                  style={{ background: 'none', border: 'none', color: 'var(--border-taupe)', fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                >
                  Vintage Denim
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', { category: 'graphic-tees' })}
                  style={{ background: 'none', border: 'none', color: 'var(--border-taupe)', fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                >
                  Single-Stitch Tees
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', { category: 'leather-outerwear' })}
                  style={{ background: 'none', border: 'none', color: 'var(--border-taupe)', fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                >
                  Leather & Outerwear
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', { collection: '90s Streetwear' })}
                  style={{ background: 'none', border: 'none', color: 'var(--border-taupe)', fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                >
                  90s Streetwear
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Support & Care */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight: 700,
              color: 'var(--bg-sage)',
              marginBottom: '1.5rem',
            }}>
              CLIENTELE
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <li>
                <button
                  onClick={() => onNavigate('story')}
                  style={{ background: 'none', border: 'none', color: 'var(--border-taupe)', fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                >
                  Authenticity Verification
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('sell')}
                  style={{ background: 'none', border: 'none', color: 'var(--border-taupe)', fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                >
                  Consign Your Collection
                </button>
              </li>
              <li>
                <span style={{ color: 'var(--border-taupe)', fontSize: '0.85rem' }}>
                  Complimentary COD Delivery
                </span>
              </li>
              <li>
                <span style={{ color: 'var(--border-taupe)', fontSize: '0.85rem' }}>
                  Care & Preservation Guide
                </span>
              </li>
              <li>
                <span style={{ color: 'var(--border-taupe)', fontSize: '0.85rem' }}>
                  Privacy & Client Terms
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Vintage Manifesto snippet */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight: 700,
              color: 'var(--bg-sage)',
              marginBottom: '1.5rem',
            }}>
              CONSIGNMENT ATELIER
            </h4>
            <p style={{
              fontSize: '0.85rem',
              lineHeight: 1.6,
              color: 'var(--border-taupe)',
              marginBottom: '1.25rem',
            }}>
              Have authentic 80s/90s vintage or Japanese designer archival pieces? Consign through our verified curation network.
            </p>
            <button
              onClick={() => onNavigate('sell')}
              className="btn-secondary"
              style={{
                color: 'var(--bg-ivory)',
                borderColor: 'var(--border-dark)',
                fontSize: '0.7rem',
                padding: '0.65rem 1.25rem',
              }}
            >
              START CONSIGNING
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--border-dark)',
          paddingTop: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
        }}>
          <div>
            © {new Date().getFullYear()} THRIFTED INC. ALL RIGHTS RESERVED.
          </div>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <span>BERLIN</span>
            <span>TOKYO</span>
            <span>PARIS</span>
            <span>NEW DELHI</span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-columns-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 2.5rem !important;
          }
        }
        @media (max-width: 580px) {
          .footer-columns-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
