import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, X, Package, DollarSign, Users, Clock, AlertTriangle, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import api from '../api/api.js';

export default function AdminDashboard({ onOpenAuth }) {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [stats, setStats] = useState(null);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('curation'); // 'curation', 'orders', 'stats'

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, pendingRes, ordersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/products/pending'),
        api.get('/admin/orders'),
      ]);
      setStats(statsRes.data.metrics);
      setPendingProducts(pendingRes.data.pendingProducts || []);
      setOrders(ordersRes.data.orders || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      showToast('Failed to load admin telemetry.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchDashboardData();
    }
  }, [isAuthenticated, isAdmin]);

  if (!isAuthenticated || !isAdmin) {
    return (
      <div style={{ padding: '6rem 2rem', textAlign: 'center', backgroundColor: 'var(--bg-ivory)', minHeight: '80vh' }}>
        <ShieldCheck size={48} color="var(--accent-burgundy)" style={{ margin: '0 auto 1.5rem' }} />
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '1rem' }}>
          Restricted Curation Access
        </h2>
        <p style={{ maxWidth: '440px', margin: '0 auto 2rem', color: 'var(--text-secondary)' }}>
          This terminal is strictly reserved for the THRIFTED Head of Curation & Quality Assurance.
        </p>
        <button onClick={onOpenAuth} className="btn-primary">
          SIGN IN AS CURATION ADMIN
        </button>
      </div>
    );
  }

  const handleUpdateProductStatus = async (productId, status) => {
    try {
      await api.patch(`/admin/products/${productId}/status`, { status });
      showToast(`Specimen #${productId} marked as ${status}.`);
      fetchDashboardData();
    } catch (err) {
      showToast('Failed to update product status.', 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      showToast(`Order status updated to "${newStatus}".`);
      fetchDashboardData();
    } catch (err) {
      showToast('Failed to update order status.', 'error');
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-ivory)', minHeight: '100vh', padding: '3.5rem 0 6rem' }}>
      <div className="container-wide">
        
        {/* Admin Header */}
        <div style={{
          borderBottom: '1px solid var(--border-taupe)',
          paddingBottom: '2rem',
          marginBottom: '2.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}>
          <div>
            <div className="section-label">CURATION & MARKETPLACE GOVERNANCE</div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.3rem, 4vw, 3.4rem)', fontWeight: 400 }}>
              Atelier Control
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Welcome, <strong style={{ color: 'var(--accent-burgundy)' }}>{user.name}</strong> (Master Curation Administrator)
            </p>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => setActiveTab('curation')}
              className={activeTab === 'curation' ? 'btn-primary' : 'btn-secondary'}
              style={{ gap: '6px' }}
            >
              <Clock size={15} />
              <span>Curation Queue ({pendingProducts.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}
              style={{ gap: '6px' }}
            >
              <Package size={15} />
              <span>Fulfillment & COD ({orders.length})</span>
            </button>
          </div>
        </div>

        {/* Live KPI Metric Cards */}
        {stats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.5rem',
            marginBottom: '3rem',
          }} className="admin-kpi-grid">
            <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', border: '1px solid var(--border-taupe)', borderRadius: 'var(--radius-xs)' }}>
              <span className="meta-label">GROSS GMV VOLUME</span>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--text-primary)', marginTop: '4px' }}>
                ₹{Number(stats.totalRevenue).toLocaleString('en-IN')}
              </p>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>From {stats.totalOrders} total confirmed orders</span>
            </div>

            <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', border: '1px solid var(--border-taupe)', borderRadius: 'var(--radius-xs)' }}>
              <span className="meta-label">ACTIVE INVENTORY</span>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--text-primary)', marginTop: '4px' }}>
                {stats.activeProducts}
              </p>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{stats.soldProducts} archived & sold</span>
            </div>

            <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', border: '1px solid var(--border-taupe)', borderRadius: 'var(--radius-xs)' }}>
              <span className="meta-label">PENDING CURATION</span>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: stats.pendingApprovals > 0 ? 'var(--accent-burgundy)' : 'var(--text-primary)', marginTop: '4px' }}>
                {stats.pendingApprovals}
              </p>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Require manual inspection</span>
            </div>

            <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', border: '1px solid var(--border-taupe)', borderRadius: 'var(--radius-xs)' }}>
              <span className="meta-label">REGISTERED USERS</span>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--text-primary)', marginTop: '4px' }}>
                {stats.totalUsers}
              </p>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{stats.sellersCount} sellers • {stats.buyersCount} collectors</span>
            </div>
          </div>
        )}

        {/* Tab 1: Curation Queue (Approve / Reject Workflow) */}
        {activeTab === 'curation' && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '1.5rem' }}>
              Pending Consignment Verification Queue
            </h3>

            {pendingProducts.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-taupe)',
                borderRadius: 'var(--radius-xs)',
              }}>
                <CheckCircle2 size={36} color="#365335" style={{ margin: '0 auto 1rem' }} />
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem' }}>
                  Curation Queue Cleared
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  All submitted vintage garments have been reviewed and approved.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {pendingProducts.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '120px 1fr auto',
                      gap: '1.5rem',
                      alignItems: 'center',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-taupe)',
                      borderRadius: 'var(--radius-xs)',
                      padding: '1.25rem',
                    }}
                    className="curation-queue-card"
                  >
                    <img
                      src={p.image_url}
                      alt={p.title}
                      style={{
                        width: '120px',
                        height: '140px',
                        objectFit: 'cover',
                        borderRadius: '2px',
                        border: '1px solid var(--border-taupe)',
                      }}
                    />

                    <div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                        <span className="badge-era">{p.era}</span>
                        <span className="badge-condition">{p.condition_status}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Submitted by: {p.seller_name} ({p.seller_email})
                        </span>
                      </div>

                      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', margin: '4px 0' }}>
                        {p.title}
                      </h4>

                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: '600px', marginBottom: '8px' }}>
                        {p.description}
                      </p>

                      <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem' }}>
                        <span>Brand: <strong>{p.brand}</strong></span>
                        <span>Size: <strong>{p.size}</strong></span>
                        <span>Listed Price: <strong style={{ color: 'var(--accent-burgundy)' }}>₹{Number(p.price).toLocaleString('en-IN')}</strong></span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      <button
                        onClick={() => handleUpdateProductStatus(p.id, 'approved')}
                        className="btn-primary"
                        style={{
                          backgroundColor: '#265422',
                          borderColor: '#265422',
                          padding: '0.65rem 1.25rem',
                          fontSize: '0.72rem',
                          gap: '6px',
                        }}
                      >
                        <Check size={14} />
                        <span>APPROVE SPECIMEN</span>
                      </button>

                      <button
                        onClick={() => handleUpdateProductStatus(p.id, 'rejected')}
                        className="btn-secondary"
                        style={{
                          color: '#A82828',
                          borderColor: 'var(--border-taupe)',
                          padding: '0.65rem 1.25rem',
                          fontSize: '0.72rem',
                          gap: '6px',
                        }}
                      >
                        <X size={14} />
                        <span>REJECT</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Orders & COD Fulfillment */}
        {activeTab === 'orders' && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '1.5rem' }}>
              Marketplace Orders & COD Dispatch
            </h3>

            {orders.length === 0 ? (
              <p>No orders placed yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-taupe)',
                      borderRadius: 'var(--radius-xs)',
                      padding: '1.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                          ORDER REFERENCE
                        </span>
                        <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--accent-burgundy)' }}>
                          #{ord.order_number}
                        </h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Placed on: {new Date(ord.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>TOTAL (CASH ON DELIVERY)</span>
                        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 600 }}>
                          ₹{Number(ord.total_amount).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }} className="admin-order-details-grid">
                      <div>
                        <span className="label-editorial">Customer & Shipping Destination</span>
                        <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{ord.shipping_address?.fullName || ord.user_name}</p>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Phone: {ord.shipping_address?.phone}</p>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                          {ord.shipping_address?.addressLine}, {ord.shipping_address?.city}, {ord.shipping_address?.state} - {ord.shipping_address?.postalCode}
                        </p>
                        {ord.notes && (
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', fontStyle: 'italic' }}>
                            Instructions: "{ord.notes}"
                          </p>
                        )}
                      </div>

                      <div>
                        <span className="label-editorial">Update Logistics Status</span>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                          {['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
                            <button
                              key={st}
                              onClick={() => handleUpdateOrderStatus(ord.id, st)}
                              style={{
                                background: ord.status === st ? 'var(--bg-espresso)' : 'var(--bg-ivory)',
                                color: ord.status === st ? '#fff' : 'var(--text-primary)',
                                border: '1px solid var(--border-taupe)',
                                padding: '4px 10px',
                                fontSize: '0.7rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                borderRadius: '2px',
                                cursor: 'pointer',
                                fontWeight: ord.status === st ? 700 : 500,
                              }}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-kpi-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .curation-queue-card {
            grid-template-columns: 1fr !important;
          }
          .admin-order-details-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
