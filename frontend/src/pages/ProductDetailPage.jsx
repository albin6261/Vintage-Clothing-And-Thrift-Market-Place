import React, { useState, useEffect } from 'react';
import { Heart, ShoppingBag, ShieldCheck, Truck, ArrowLeft, Ruler, Sparkles, Check, Share2 } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import api from '../api/api.js';

export default function ProductDetailPage({ productSlug, onBackToShop, onSelectProduct }) {
  const [productData, setProductData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { addToBag } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  useEffect(() => {
    async function fetchDetails() {
      setLoading(true);
      try {
        const res = await api.get(`/products/${productSlug}`);
        setProductData(res.data.product);
        setReviews(res.data.reviews || []);
        setRelated(res.data.related || []);
        setActiveImageIndex(0);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    }
    if (productSlug) {
      fetchDetails();
    }
  }, [productSlug]);

  if (loading) {
    return (
      <div style={{ padding: '6rem 2rem', textAlign: 'center', backgroundColor: 'var(--bg-ivory)', minHeight: '80vh' }}>
        <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid var(--border-taupe)', borderTopColor: 'var(--accent-burgundy)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '1rem', fontFamily: 'var(--font-serif)', fontSize: '1.25rem' }}>Retrieving archival garment record...</p>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!productData) {
    return (
      <div style={{ padding: '6rem 2rem', textAlign: 'center', backgroundColor: 'var(--bg-ivory)', minHeight: '80vh' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)' }}>Garment Not Found</h2>
        <button onClick={onBackToShop} className="btn-primary" style={{ marginTop: '1.5rem' }}>
          RETURN TO DIRECTORY
        </button>
      </div>
    );
  }

  const isFavorited = isInWishlist(productData.id);
  const images = Array.isArray(productData.images) && productData.images.length > 0 
    ? productData.images 
    : [productData.image_url];

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(productData.price);

  const formattedOriginal = productData.original_price ? new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(productData.original_price) : null;

  const isSold = productData.status === 'sold' || productData.stock_quantity === 0;

  return (
    <div style={{ backgroundColor: 'var(--bg-ivory)', minHeight: '100vh', padding: '2rem 0 6rem' }}>
      <div className="container-wide">
        
        {/* Breadcrumb Navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.75rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: '2rem',
        }}>
          <button
            onClick={onBackToShop}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-primary)',
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={14} />
            <span>Archive Directory</span>
          </button>
          <span>/</span>
          <span>{productData.category_name}</span>
          <span>/</span>
          <span style={{ color: 'var(--accent-burgundy)', fontWeight: 600 }}>{productData.brand}</span>
        </div>

        {/* 2-Column Editorial PDP Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.15fr 0.85fr',
          gap: '4.5rem',
          alignItems: 'start',
        }} className="pdp-editorial-grid">
          
          {/* Left Column: Image Gallery with Thumbnails & Zoom */}
          <div>
            <div style={{
              position: 'relative',
              width: '100%',
              paddingTop: '125%', // Tall fashion crop
              overflow: 'hidden',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--border-taupe)',
              backgroundColor: '#EDE9E1',
            }}>
              <img
                src={images[activeImageIndex] || productData.image_url}
                alt={productData.title}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: isSold ? 'grayscale(40%)' : 'none',
                  transition: 'transform 0.4s ease',
                }}
              />

              {productData.is_one_of_one && (
                <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                  <span className="badge-one-of-one" style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem' }}>
                    ONE OF ONE • NO RESTOCKS
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Selectors */}
            {images.length > 1 && (
              <div style={{
                display: 'flex',
                gap: '1rem',
                marginTop: '1.25rem',
                overflowX: 'auto',
                paddingBottom: '4px',
              }}>
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    style={{
                      width: '76px',
                      height: '96px',
                      padding: 0,
                      border: activeImageIndex === idx ? '2px solid var(--text-primary)' : '1px solid var(--border-taupe)',
                      borderRadius: 'var(--radius-xs)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      backgroundColor: '#E5DFD4',
                      opacity: activeImageIndex === idx ? 1 : 0.65,
                      transition: 'all 0.2s ease',
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={imgUrl}
                      alt={`Angle ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Analog Film Note */}
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem 1.25rem',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
              borderRadius: '2px',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span>Studio Ref: #{productData.slug.substring(0, 16).toUpperCase()}</span>
              <span>Photographed on Analog Kodak Medium Format</span>
            </div>
          </div>

          {/* Right Column: Garment Information & Actions */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            
            {/* Era, Gender & Brand Metadata */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              marginBottom: '0.75rem',
              flexWrap: 'wrap',
            }}>
              {productData.gender && productData.gender !== 'unisex' && (
                <span style={{
                  backgroundColor: productData.gender === 'girls' ? '#880e4f' : '#0d47a1',
                  color: '#fff',
                  fontSize: '0.65rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '2px',
                }}>
                  {productData.gender === 'girls' ? "👧 GIRLS' THRIFT" : "👦 BOYS' VINTAGE"}
                </span>
              )}
              <span className="badge-era">{productData.era} ARCHIVE</span>
              <span className="badge-condition">{productData.condition_status}</span>
              {productData.curated_collection && (
                <span style={{ fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {productData.curated_collection}
                </span>
              )}
            </div>

            {/* Product Title */}
            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.2rem, 3.5vw, 3rem)',
              lineHeight: 1.15,
              fontWeight: 400,
              color: 'var(--text-primary)',
              marginBottom: '0.75rem',
            }}>
              {productData.title}
            </h1>

            {/* Brand subhead */}
            <p style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.85rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--accent-burgundy)',
              fontWeight: 700,
              marginBottom: '1.25rem',
            }}>
              Brand: {productData.brand}
            </p>

            {/* Price Row */}
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '1rem',
              padding: '1.25rem 0',
              borderTop: '1px solid var(--border-taupe)',
              borderBottom: '1px solid var(--border-taupe)',
              marginBottom: '1.75rem',
              flexWrap: 'wrap',
            }}>
              <span style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '2.4rem',
                fontWeight: 600,
                color: isSold ? 'var(--text-muted)' : 'var(--text-primary)',
              }}>
                {formattedPrice}
              </span>

              {formattedOriginal && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '1.05rem',
                    color: 'var(--text-muted)',
                    textDecoration: 'line-through',
                  }}>
                    {formattedOriginal}
                  </span>
                  <span style={{
                    backgroundColor: '#ffebee',
                    color: '#c62828',
                    padding: '2px 8px',
                    borderRadius: '2px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}>
                    SAVE {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(productData.original_price - productData.price)} ({Math.round(((productData.original_price - productData.price) / productData.original_price) * 100)}% OFF)
                  </span>
                </div>
              )}

              <span style={{
                marginLeft: 'auto',
                fontSize: '0.72rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#2F5A29',
                backgroundColor: '#EBF4EA',
                padding: '4px 8px',
                borderRadius: '2px',
                fontWeight: 600,
              }}>
                Cash on Delivery Available
              </span>
            </div>

            {/* Action Buttons: Add to Bag & Wishlist */}
            <div style={{ display: 'flex', gap: '0.85rem', marginBottom: '2rem' }}>
              <button
                disabled={isSold}
                onClick={() => addToBag(productData)}
                className="btn-primary"
                style={{
                  flexGrow: 1,
                  padding: '1.15rem 2rem',
                  fontSize: '0.8rem',
                  opacity: isSold ? 0.6 : 1,
                  cursor: isSold ? 'not-allowed' : 'pointer',
                  backgroundColor: isSold ? 'var(--text-muted)' : 'var(--bg-espresso)',
                }}
              >
                <ShoppingBag size={17} />
                <span>{isSold ? 'PIECE ARCHIVED / SOLD' : 'ADD TO SHOPPING BAG'}</span>
              </button>

              <button
                onClick={() => toggleWishlist(productData)}
                aria-label="Wishlist toggle"
                style={{
                  backgroundColor: isFavorited ? 'var(--accent-burgundy)' : 'var(--bg-card)',
                  color: isFavorited ? '#fff' : 'var(--text-primary)',
                  border: '1px solid var(--border-taupe)',
                  borderRadius: 'var(--radius-xs)',
                  width: '56px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)',
                }}
              >
                <Heart size={20} fill={isFavorited ? '#fff' : 'none'} strokeWidth={1.8} />
              </button>
            </div>

            {/* Detailed Description */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '0.6rem' }}>
                Curator's Assessment
              </h4>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                {productData.description}
              </p>
            </div>

            {/* Exact Measurements Section */}
            {productData.measurements && Object.keys(productData.measurements).length > 0 && (
              <div style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-taupe)',
                borderRadius: 'var(--radius-xs)',
                padding: '1.5rem',
                marginBottom: '2rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                  <Ruler size={16} color="var(--accent-burgundy)" />
                  <span style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                  }}>
                    PRECISE HAND MEASUREMENTS (LAID FLAT)
                  </span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.75rem',
                }}>
                  {Object.entries(productData.measurements).map(([key, val]) => (
                    <div key={key} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid var(--border-light)',
                      paddingBottom: '4px',
                      fontSize: '0.8rem',
                    }}>
                      <span style={{ textTransform: 'capitalize', color: 'var(--text-muted)' }}>
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <strong style={{ color: 'var(--text-primary)' }}>{val}</strong>
                    </div>
                  ))}
                  {productData.materials && (
                    <div style={{
                      gridColumn: 'span 2',
                      display: 'flex',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid var(--border-light)',
                      paddingBottom: '4px',
                      fontSize: '0.8rem',
                    }}>
                      <span style={{ color: 'var(--text-muted)' }}>Fabric Composition:</span>
                      <strong>{productData.materials}</strong>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Seller / Consignor Card */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              padding: '1.25rem',
              border: '1px solid var(--border-taupe)',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-xs)',
              marginBottom: '2rem',
            }}>
              <img
                src={productData.seller_avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'}
                alt={productData.seller_name}
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1px solid var(--border-taupe)',
                }}
              />
              <div>
                <span style={{ fontSize: '0.65rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--accent-burgundy)', fontWeight: 700 }}>
                  VERIFIED INDEPENDENT CONSIGNOR
                </span>
                <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  {productData.seller_name}
                </p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {productData.seller_bio || 'Specialist in 20th-century tailoring, military wear, and denim archives.'}
                </p>
              </div>
            </div>

            {/* Authenticity & Care Guarantees */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              borderTop: '1px solid var(--border-taupe)',
              paddingTop: '1.5rem',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
            }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <ShieldCheck size={16} color="var(--accent-burgundy)" />
                <span>100% Guaranteed Era-Authentic or Full Doorstep Refund</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Truck size={16} color="var(--accent-burgundy)" />
                <span>Shipped in biodegradable protective garment box via Express Air</span>
              </div>
            </div>

          </div>

        </div>

        {/* Related Pieces Row */}
        {related.length > 0 && (
          <section style={{ marginTop: '6rem', borderTop: '1px solid var(--border-taupe)', paddingTop: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2.5rem' }}>
              <div>
                <div className="section-label">CURATORIAL SELECTIONS</div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem' }}>
                  YOU MAY ALSO CHERISH
                </h3>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1.75rem',
            }} className="pdp-related-grid">
              {related.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  onSelectProduct={onSelectProduct}
                />
              ))}
            </div>
          </section>
        )}

      </div>

      <style>{`
        @media (max-width: 960px) {
          .pdp-editorial-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          .pdp-related-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 580px) {
          .pdp-related-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
