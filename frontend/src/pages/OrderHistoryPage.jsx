import React, { useState, useEffect } from 'react';
import { Package, Truck, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/api.js';

export default function OrderHistoryPage({ onOpenAuth, onExploreShop, onSelectProduct }) {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      if (!isAuthenticated) return;
      setLoading(true);
      try {
        const res = await api.get('/orders/my-orders');
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '6rem 2rem', textAlign: 'center', backgroundColor: 'var(--bg-ivory)', minHeight: '80vh' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '1rem' }}>
          Your Order History
        </h2>
        <p style={{ maxWidth: '440px', margin: '0 auto 2rem', color: 'var(--text-secondary)' }}>
          Please sign in to review your past vintage acquisitions and live COD shipment tracking.
        </p>
        <button onClick={onOpenAuth} className="btn-primary">
          SIGN IN TO YOUR ACCOUNT
        </button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-ivory)', minHeight: '100vh', padding: '3.5rem 0 6rem' }}>
      <div className="container" style={{ maxWidth: '920px' }}>
        
        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--border-taupe)', paddingBottom: '2rem', marginBottom: '2.5rem' }}>
          <div className="section-label">CLIENTELE RECORDS</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.3rem, 4vw, 3.2rem)', fontWeight: 400 }}>
            Your Order History
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Collector: <strong>{user.name}</strong> • {orders.length} {orders.length === 1 ? 'Order' : 'Orders'} Dispatched
          </p>
        </div>

        {loading ? (
          <p>Retrieving your order archives...</p>
        ) : orders.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '5rem 2rem',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-taupe)',
            borderRadius: 'var(--radius-xs)',
          }}>
            <Package size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', marginBottom: '0.5rem' }}>
              No orders placed yet
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Explore the current drops to find your first authenticated vintage piece.
            </p>
            <button onClick={onExploreShop} className="btn-primary">
              EXPLORE ARCHIVE DIRECTORY
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {orders.map((ord) => (
              <div
                key={ord.id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-taupe)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '1.75rem',
                }}
              >
                {/* Order Top Bar */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  borderBottom: '1px solid var(--border-light)',
                  paddingBottom: '1rem',
                  marginBottom: '1.25rem',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}>
                  <div>
                    <span style={{ fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                      ORDER REFERENCE
                    </span>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--accent-burgundy)' }}>
                      #{ord.order_number}
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Placed {new Date(ord.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      backgroundColor: ord.status === 'delivered' ? '#EBF4EA' : '#FFF4E5',
                      color: ord.status === 'delivered' ? '#265422' : '#8A5200',
                      fontSize: '0.65rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      padding: '4px 8px',
                      borderRadius: '2px',
                    }}>
                      Status: {ord.status} (Cash on Delivery)
                    </span>
                    <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 600, marginTop: '4px' }}>
                      ₹{Number(ord.total_amount).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Items in this order */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
                  {ord.items && ord.items.map((item) => (
                    <div
                      key={item.order_item_id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '0.75rem',
                        backgroundColor: 'var(--bg-ivory)',
                        borderRadius: '2px',
                        border: '1px solid var(--border-light)',
                      }}
                    >
                      <img
                        src={item.image_url}
                        alt={item.title}
                        style={{
                          width: '54px',
                          height: '68px',
                          objectFit: 'cover',
                          borderRadius: '2px',
                          cursor: 'pointer',
                        }}
                        onClick={() => onSelectProduct && onSelectProduct(item)}
                      />
                      <div style={{ flexGrow: 1 }}>
                        <h4
                          onClick={() => onSelectProduct && onSelectProduct(item)}
                          style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', cursor: 'pointer' }}
                        >
                          {item.title}
                        </h4>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {item.brand} • Size: {item.size} • Qty: {item.quantity}
                        </span>
                      </div>
                      <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: 600 }}>
                        ₹{Number(item.price).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Shipping destination footer */}
                <div style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-secondary)',
                  borderTop: '1px solid var(--border-light)',
                  paddingTop: '0.75rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                }}>
                  <span>
                    Delivery to: <strong>{ord.shipping_address?.fullName}</strong>, {ord.shipping_address?.addressLine}, {ord.shipping_address?.city}
                  </span>
                  <span>Payment: Cash on Delivery (Pay upon doorstep inspection)</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
