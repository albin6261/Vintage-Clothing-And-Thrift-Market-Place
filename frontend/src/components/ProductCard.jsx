import React, { useState } from 'react';
import { Heart, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function ProductCard({ product, onSelectProduct }) {
  const [isHovered, setIsHovered] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToBag } = useCart();

  const isFavorited = isInWishlist(product.id || product.product_id);
  const isSold = product.status === 'sold' || product.stock_quantity === 0;

  // Format Indian Rupee currency
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(product.price);

  const formattedOriginal = product.original_price ? new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(product.original_price) : null;

  const discountPct = product.original_price && product.price < product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100) 
    : null;

  return (
    <article
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-xs)',
        transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
      }}
      onClick={() => onSelectProduct && onSelectProduct(product)}
    >
      {/* Product Image Wrapper */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '130%', // Tall editorial fashion aspect ratio (1:1.3)
        overflow: 'hidden',
        backgroundColor: '#EAE6DD',
      }}>
        <img
          src={product.image_url}
          alt={product.title}
          loading="lazy"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            filter: isSold ? 'grayscale(50%) opacity(0.7)' : 'none',
          }}
        />

        {/* Badges Overlay */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '5px',
          zIndex: 2,
        }}>
          {isSold ? (
            <span style={{
              backgroundColor: 'var(--text-primary)',
              color: '#fff',
              fontSize: '0.62rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontWeight: 700,
              padding: '0.25rem 0.55rem',
              borderRadius: '2px',
            }}>
              ARCHIVED / SOLD
            </span>
          ) : (
            <>
              {/* Gender Pill */}
              {product.gender && product.gender !== 'unisex' && (
                <span style={{
                  backgroundColor: product.gender === 'girls' ? '#880e4f' : '#0d47a1',
                  color: '#fff',
                  fontSize: '0.58rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  padding: '0.2rem 0.45rem',
                  borderRadius: '2px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                }}>
                  {product.gender === 'girls' ? '👧 GIRLS' : '👦 BOYS'}
                </span>
              )}

              {/* Budget Badge / Discount */}
              {product.price <= 499 ? (
                <span style={{
                  backgroundColor: '#1b5e20',
                  color: '#fff',
                  fontSize: '0.58rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  padding: '0.2rem 0.45rem',
                  borderRadius: '2px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                }}>
                  ⚡ UNDER ₹499
                </span>
              ) : discountPct ? (
                <span style={{
                  backgroundColor: '#b71c1c',
                  color: '#fff',
                  fontSize: '0.58rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  padding: '0.2rem 0.45rem',
                  borderRadius: '2px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                }}>
                  {discountPct}% OFF
                </span>
              ) : null}

              {product.is_one_of_one && (
                <span className="badge-one-of-one">
                  1 OF 1
                </span>
              )}
            </>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 3,
            backgroundColor: isFavorited ? 'var(--accent-burgundy)' : 'rgba(255, 255, 255, 0.9)',
            color: isFavorited ? '#fff' : 'var(--text-primary)',
            border: 'none',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            transition: 'all 0.2s ease',
          }}
        >
          <Heart size={16} fill={isFavorited ? '#fff' : 'none'} strokeWidth={1.8} />
        </button>

        {/* Quick Add Overlay on Hover (Desktop) */}
        {!isSold && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(41, 37, 31, 0.9)',
              padding: '0.75rem',
              transform: isHovered ? 'translateY(0)' : 'translateY(100%)',
              transition: 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              color: '#fff',
              zIndex: 3,
            }}
            onClick={(e) => {
              e.stopPropagation();
              addToBag(product);
            }}
          >
            <ShoppingBag size={15} />
            <span style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.7rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}>
              Quick Add to Bag
            </span>
          </div>
        )}
      </div>

      {/* Product Details Area */}
      <div style={{
        padding: '1.15rem 1rem 1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.45rem',
        flexGrow: 1,
      }}>
        {/* Brand & Era line */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.68rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          fontWeight: 600,
          color: 'var(--text-muted)',
        }}>
          <span>{product.brand}</span>
          <span className="badge-era" style={{ padding: '0.15rem 0.4rem', fontSize: '0.62rem' }}>
            {product.era}
          </span>
        </div>

        {/* Product Title */}
        <h3 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.12rem',
          fontWeight: 500,
          lineHeight: 1.3,
          color: 'var(--text-primary)',
          margin: '2px 0 4px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          minHeight: '2.6rem',
        }}>
          {product.title}
        </h3>

        {/* Size & Condition metadata */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginBottom: '4px',
        }}>
          <span style={{
            fontSize: '0.72rem',
            color: 'var(--text-secondary)',
            fontWeight: 600,
          }}>
            Size: {product.size}
          </span>
          <span style={{ color: 'var(--border-taupe)' }}>•</span>
          <span style={{
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            fontStyle: 'italic',
          }}>
            {product.condition_status}
          </span>
        </div>

        {/* Price Row */}
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '0.6rem',
          marginTop: 'auto',
          paddingTop: '0.5rem',
          borderTop: '1px dashed var(--border-light)',
        }}>
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.25rem',
            fontWeight: 600,
            color: isSold ? 'var(--text-muted)' : 'var(--text-primary)',
          }}>
            {formattedPrice}
          </span>

          {formattedOriginal && (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                textDecoration: 'line-through',
              }}>
                {formattedOriginal}
              </span>
            </div>
          )}

          <div style={{ marginLeft: 'auto' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              color: 'var(--accent-burgundy)',
              fontSize: '0.75rem',
              opacity: isHovered ? 1 : 0.6,
              transition: 'opacity 0.2s ease',
            }}>
              <ArrowUpRight size={16} />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
