import React from 'react';
import { X, Heart, Trash2, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function WishlistDrawer({ onSelectProduct }) {
  const { wishlist, isWishlistOpen, closeWishlist, toggleWishlist } = useWishlist();
  const { addToBag } = useCart();

  if (!isWishlistOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      display: 'flex',
      justifyContent: 'flex-end',
    }}>
      {/* Backdrop */}
      <div
        onClick={closeWishlist}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(29, 26, 22, 0.65)',
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.25s ease',
        }}
      />

      {/* Slide-over */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '460px',
        height: '100%',
        backgroundColor: 'var(--bg-ivory)',
        borderLeft: '1px solid var(--border-taupe)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 101,
        boxShadow: 'var(--shadow-elevated)',
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem 1.75rem',
          borderBottom: '1px solid var(--border-taupe)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--bg-card)',
        }}>
          <div>
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.5rem',
              fontWeight: 400,
            }}>
              ARCHIVE WISHLIST
            </h3>
            <span style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.68rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
            }}>
              {wishlist.length} {wishlist.length === 1 ? 'ITEM' : 'ITEMS'} SAVED
            </span>
          </div>

          <button
            onClick={closeWishlist}
            aria-label="Close wishlist"
            style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '6px' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div style={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: '1.5rem 1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}>
          {wishlist.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-taupe)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
              }}>
                <Heart size={24} strokeWidth={1.5} />
              </div>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem' }}>
                Your wishlist is empty
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '280px' }}>
                Tap the heart on any vintage piece to save it to your private wishlist.
              </p>
              <button
                onClick={closeWishlist}
                className="btn-secondary"
                style={{ marginTop: '0.5rem' }}
              >
                EXPLORE NEW FINDS
              </button>
            </div>
          ) : (
            wishlist.map((item) => {
              const pId = item.product_id || item.id;
              const formattedPrice = new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0,
              }).format(item.price);

              return (
                <div
                  key={pId}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    paddingBottom: '1.25rem',
                    borderBottom: '1px solid var(--border-light)',
                  }}
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    style={{
                      width: '74px',
                      height: '96px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--border-taupe)',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      closeWishlist();
                      onSelectProduct && onSelectProduct(item);
                    }}
                  />

                  <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4
                          onClick={() => {
                            closeWishlist();
                            onSelectProduct && onSelectProduct(item);
                          }}
                          style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: '1.05rem',
                            fontWeight: 500,
                            lineHeight: 1.25,
                            cursor: 'pointer',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {item.title}
                        </h4>
                        <button
                          onClick={() => toggleWishlist(item)}
                          aria-label="Remove from wishlist"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            padding: '4px',
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                        <span>{item.brand}</span>
                        <span>•</span>
                        <span>Size: {item.size}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                      <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: 600 }}>
                        {formattedPrice}
                      </span>
                      <button
                        onClick={() => {
                          addToBag(item);
                          closeWishlist();
                        }}
                        className="btn-primary"
                        style={{ padding: '0.45rem 0.85rem', fontSize: '0.68rem', gap: '5px' }}
                      >
                        <ShoppingBag size={13} />
                        <span>Move to Bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
