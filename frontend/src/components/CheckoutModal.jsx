import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, MapPin, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function CheckoutModal({ onOrderComplete }) {
  const {
    checkoutModalOpen,
    setCheckoutModalOpen,
    cartItems,
    subtotal,
    checkoutCashOnDelivery,
    isPlacingOrder,
    orderSuccessData,
    setOrderSuccessData,
  } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '+91 98765 43210',
    addressLine: 'Flat 4B, Heritage Court, MG Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560001',
  });
  const [deliveryNotes, setDeliveryNotes] = useState('Please call prior to delivery.');

  if (!checkoutModalOpen && !orderSuccessData) return null;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!address.fullName || !address.phone || !address.addressLine || !address.city || !address.postalCode) {
      showToast('Please fill in all shipping fields.', 'error');
      return;
    }

    const res = await checkoutCashOnDelivery(address, deliveryNotes);
    if (res.success && onOrderComplete) {
      onOrderComplete(res.order);
    }
  };

  const formattedTotal = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(subtotal);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 120,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
    }}>
      {/* Backdrop */}
      <div
        onClick={() => {
          if (!isPlacingOrder) {
            setCheckoutModalOpen(false);
            setOrderSuccessData(null);
          }
        }}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(29, 26, 22, 0.72)',
          backdropFilter: 'blur(5px)',
        }}
      />

      {/* Modal Dialog */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '560px',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-taupe)',
        borderRadius: 'var(--radius-xs)',
        boxShadow: 'var(--shadow-elevated)',
        zIndex: 121,
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        {/* If Order Placed Successfully */}
        {orderSuccessData ? (
          <div style={{ padding: '3rem 2.5rem', textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-sage-light)',
              color: '#365335',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}>
              <CheckCircle size={36} />
            </div>

            <span className="section-label" style={{ justifyContent: 'center' }}>
              ORDER DISPATCH CONFIRMED
            </span>

            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2.2rem',
              color: 'var(--text-primary)',
              margin: '0.4rem 0 1rem',
            }}>
              YOUR ARCHIVE PIECES ARE SECURED
            </h3>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Thank you for giving quality clothing another life. We are carefully packaging your garments with acid-free archival tissue.
            </p>

            <div style={{
              backgroundColor: 'var(--bg-ivory)',
              border: '1px solid var(--border-taupe)',
              padding: '1.25rem 1.5rem',
              borderRadius: 'var(--radius-xs)',
              textAlign: 'left',
              marginBottom: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Order Number:</span>
                <strong style={{ fontFamily: 'var(--font-sans)', letterSpacing: '0.08em', color: 'var(--accent-burgundy)' }}>
                  #{orderSuccessData.orderNumber}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Payment Method:</span>
                <strong>Cash on Delivery (COD)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Total Payable at Doorstep:</span>
                <strong style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem' }}>
                  ₹{Number(orderSuccessData.totalAmount).toLocaleString('en-IN')}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                <span style={{ color: '#2B5A27', fontWeight: 600 }}>Confirmed (Preparing Dispatch)</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  setOrderSuccessData(null);
                  setCheckoutModalOpen(false);
                }}
                className="btn-primary"
                style={{ width: '100%' }}
              >
                CONTINUE BROWSING
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <div>
            <div style={{
              padding: '1.5rem 2rem',
              borderBottom: '1px solid var(--border-taupe)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <span className="section-label" style={{ marginBottom: '2px' }}>EXPRESS CHECKOUT</span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 400 }}>
                  Shipping & Cash on Delivery
                </h3>
              </div>
              <button
                onClick={() => setCheckoutModalOpen(false)}
                aria-label="Close modal"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitOrder} style={{ padding: '1.75rem 2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div>
                  <label className="label-editorial">Recipient Full Name *</label>
                  <input
                    type="text"
                    required
                    className="input-editorial"
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    placeholder="e.g. Clara Vance"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="label-editorial">Contact Phone Number *</label>
                    <input
                      type="tel"
                      required
                      className="input-editorial"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="label-editorial">Postal PIN Code *</label>
                    <input
                      type="text"
                      required
                      className="input-editorial"
                      value={address.postalCode}
                      onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                      placeholder="560001"
                    />
                  </div>
                </div>

                <div>
                  <label className="label-editorial">Delivery Street Address *</label>
                  <input
                    type="text"
                    required
                    className="input-editorial"
                    value={address.addressLine}
                    onChange={(e) => setAddress({ ...address, addressLine: e.target.value })}
                    placeholder="Apartment, suite, street, landmark"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="label-editorial">City *</label>
                    <input
                      type="text"
                      required
                      className="input-editorial"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      placeholder="Bengaluru"
                    />
                  </div>
                  <div>
                    <label className="label-editorial">State *</label>
                    <input
                      type="text"
                      required
                      className="input-editorial"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      placeholder="Karnataka"
                    />
                  </div>
                </div>

                <div>
                  <label className="label-editorial">Courier Delivery Instructions (Optional)</label>
                  <input
                    type="text"
                    className="input-editorial"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="e.g. Leave with building security / Call upon arrival"
                  />
                </div>

                {/* Cash on Delivery Notice Card */}
                <div style={{
                  backgroundColor: 'var(--bg-sage-light)',
                  border: '1px solid rgba(165, 170, 145, 0.5)',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-xs)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  marginTop: '0.5rem',
                }}>
                  <Truck size={20} color="var(--accent-burgundy)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.8rem', color: '#273322', marginBottom: '2px' }}>
                      Payment Method: Cash on Delivery (COD)
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#3A4833', lineHeight: 1.45 }}>
                      Pay ₹{subtotal.toLocaleString('en-IN')} in cash or UPI directly to the courier agent upon receiving and inspecting your package. No advance payment required.
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-taupe)',
                  marginTop: '0.5rem',
                }}>
                  <span style={{ fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    TOTAL PAYABLE
                  </span>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 600 }}>
                    {formattedTotal}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isPlacingOrder}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: '1.1rem',
                    fontSize: '0.8rem',
                    marginTop: '0.5rem',
                    opacity: isPlacingOrder ? 0.7 : 1,
                  }}
                >
                  {isPlacingOrder ? 'CONFIRMING ORDER...' : 'PLACE ORDER (CASH ON DELIVERY)'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
