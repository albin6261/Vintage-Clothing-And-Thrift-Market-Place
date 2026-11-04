import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function CartDrawer({ onSelectProduct, onOpenAuth }) {
  const {
    cartItems,
    isBagOpen,
    closeBag,
    removeFromBag,
    subtotal,
    itemCount,
    setCheckoutModalOpen,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  if (!isBagOpen) return null;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'VINTAGE10') {
      setDiscountPercent(10);
      showToast('10% Archival courtesy discount applied!');
    } else {
      showToast('Invalid promo code. Try "VINTAGE10".', 'error');
    }
  };

  const discountAmount = (subtotal * discountPercent) / 100;
  const finalTotal = subtotal - discountAmount;

  const formattedSubtotal = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(subtotal);

  const formattedTotal = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(finalTotal);

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      showToast('Please sign in or continue as guest to complete checkout.', 'info');
      onOpenAuth();
      return;
    }
    setCheckoutModalOpen(true);
  };

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
        onClick={closeBag}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(29, 26, 22, 0.65)',
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.25s ease',
        }}
      />

      {/* Slide-over Drawer */}
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
        animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        {/* Drawer Header */}
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
              color: 'var(--text-primary)',
            }}>
              YOUR SHOPPING BAG
            </h3>
            <span style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.68rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
            }}>
              {itemCount} {itemCount === 1 ? 'ITEM' : 'ITEMS'} RESERVED
            </span>
          </div>

          <button
            onClick={closeBag}
            aria-label="Close bag"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              padding: '6px',
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Drawer Item List */}
        <div style={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: '1.5rem 1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}>
          {cartItems.length === 0 ? (
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
                <ShoppingBag size={24} strokeWidth={1.5} />
              </div>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem' }}>
                Your bag is empty
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '280px' }}>
                Explore our curated vintage arrivals to secure rare 1-of-1 pieces.
              </p>
              <button
                onClick={closeBag}
                className="btn-secondary"
                style={{ marginTop: '0.5rem' }}
              >
                BROWSE ARCHIVE
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const pId = item.product_id || item.id;
              const formattedItemPrice = new Intl.NumberFormat('en-IN', {
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
                      closeBag();
                      onSelectProduct && onSelectProduct(item);
                    }}
                  />

                  <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4
                          onClick={() => {
                            closeBag();
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
                          onClick={() => removeFromBag(pId)}
                          aria-label="Remove item"
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
                        <span>Size: {item.size}</span>
                        {item.is_one_of_one && (
                          <span className="badge-one-of-one" style={{ padding: '1px 5px', fontSize: '0.58rem' }}>
                            1 OF 1
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '8px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Qty: {item.quantity}
                      </span>
                      <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: 600 }}>
                        {formattedItemPrice}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer / Checkout summary */}
        {cartItems.length > 0 && (
          <div style={{
            padding: '1.5rem 1.75rem',
            borderTop: '1px solid var(--border-taupe)',
            backgroundColor: 'var(--bg-card)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            {/* Promo code input */}
            <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '6px' }}>
              <input
                type="text"
                placeholder="PROMO CODE (e.g. VINTAGE10)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                style={{
                  flexGrow: 1,
                  padding: '0.55rem 0.85rem',
                  fontSize: '0.75rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  border: '1px solid var(--border-taupe)',
                  borderRadius: '2px',
                  backgroundColor: 'var(--bg-ivory)',
                }}
              />
              <button
                type="submit"
                className="btn-secondary"
                style={{ padding: '0.55rem 0.95rem', fontSize: '0.68rem' }}
              >
                APPLY
              </button>
            </form>

            {discountPercent > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--accent-burgundy)' }}>
                <span>Archival Courtesy (10%)</span>
                <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}

            {/* Subtotal */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              paddingTop: '0.5rem',
              borderTop: '1px dashed var(--border-light)',
            }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                TOTAL AMOUNT
              </span>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 600 }}>
                {formattedTotal}
              </span>
            </div>

            {/* Shipping badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.72rem',
              color: '#3D543B',
              backgroundColor: '#EDF3EC',
              padding: '6px 10px',
              borderRadius: '2px',
            }}>
              <ShieldCheck size={15} />
              <span>Free Insured Express Delivery • Cash on Delivery</span>
            </div>

            {/* Checkout Action */}
            <button
              onClick={handleProceedToCheckout}
              className="btn-primary"
              style={{ width: '100%', padding: '1.05rem', fontSize: '0.78rem' }}
            >
              <span>CHECKOUT WITH CASH ON DELIVERY</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
