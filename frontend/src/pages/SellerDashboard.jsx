import React, { useState, useEffect } from 'react';
import { PlusCircle, Clock, CheckCircle2, AlertCircle, Trash2, ArrowUpRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import api from '../api/api.js';

export default function SellerDashboard({ onOpenAuth }) {
  const { user, isAuthenticated, isSeller } = useAuth();
  const { showToast } = useToast();

  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'submit'

  // New listing state
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    era: '1990s',
    category_id: '1',
    price: '',
    original_price: '',
    size: '',
    condition_status: 'Excellent Vintage',
    description: '',
    image_url: '',
    materials: '',
    chest: '',
    length: '',
    waist: '',
    inseam: '',
    is_one_of_one: true,
  });

  const fetchMyProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/seller/products');
      setMyProducts(res.data.products || []);
    } catch (err) {
      console.error('Error fetching seller products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isSeller) {
      fetchMyProducts();
    }
  }, [isAuthenticated, isSeller]);

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '6rem 2rem', textAlign: 'center', backgroundColor: 'var(--bg-ivory)', minHeight: '80vh' }}>
        <div className="section-label" style={{ justifyContent: 'center' }}>CONSIGNMENT ATELIER</div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '1rem' }}>
          Sell With THRIFTED
        </h2>
        <p style={{ maxWidth: '480px', margin: '0 auto 2rem', color: 'var(--text-secondary)' }}>
          Please sign in to your verified seller or consignor account to submit new vintage garments and track your live collection.
        </p>
        <button onClick={onOpenAuth} className="btn-primary">
          SIGN IN / REGISTER AS CONSIGNOR
        </button>
      </div>
    );
  }

  const handleCreateListing = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.brand || !formData.price || !formData.size || !formData.image_url || !formData.description) {
      showToast('Please fill in all mandatory fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const measurements = {};
      if (formData.chest) measurements.chest = formData.chest;
      if (formData.length) measurements.length = formData.length;
      if (formData.waist) measurements.waist = formData.waist;
      if (formData.inseam) measurements.inseam = formData.inseam;

      const payload = {
        title: formData.title,
        brand: formData.brand,
        era: formData.era,
        category_id: Number(formData.category_id),
        price: Number(formData.price),
        original_price: formData.original_price ? Number(formData.original_price) : null,
        size: formData.size,
        condition_status: formData.condition_status,
        description: formData.description,
        materials: formData.materials,
        measurements,
        image_url: formData.image_url,
        images: [formData.image_url],
        is_one_of_one: formData.is_one_of_one,
      };

      const res = await api.post('/seller/products', payload);
      showToast(res.data.message || 'Listing submitted successfully!');
      
      // Reset form
      setFormData({
        title: '',
        brand: '',
        era: '1990s',
        category_id: '1',
        price: '',
        original_price: '',
        size: '',
        condition_status: 'Excellent Vintage',
        description: '',
        image_url: '',
        materials: '',
        chest: '',
        length: '',
        waist: '',
        inseam: '',
        is_one_of_one: true,
      });

      setActiveTab('list');
      fetchMyProducts();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to submit listing.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to withdraw this vintage listing?')) return;
    try {
      await api.delete(`/seller/products/${id}`);
      showToast('Listing withdrawn.');
      fetchMyProducts();
    } catch (err) {
      showToast('Failed to delete listing.', 'error');
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-ivory)', minHeight: '100vh', padding: '3.5rem 0 6rem' }}>
      <div className="container-wide">
        
        {/* Header */}
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
            <div className="section-label">CONSIGNMENT & ARCHIVE PORTAL</div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.3rem, 4vw, 3.4rem)', fontWeight: 400 }}>
              Consignor Studio
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Logged in as <strong style={{ color: 'var(--accent-burgundy)' }}>{user.name}</strong> ({user.role})
            </p>
          </div>

          {/* Tab Selector */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => setActiveTab('list')}
              className={activeTab === 'list' ? 'btn-primary' : 'btn-secondary'}
            >
              My Listings ({myProducts.length})
            </button>
            <button
              onClick={() => setActiveTab('submit')}
              className={activeTab === 'submit' ? 'btn-primary' : 'btn-secondary'}
              style={{ gap: '6px' }}
            >
              <PlusCircle size={15} />
              <span>Submit New Grail</span>
            </button>
          </div>
        </div>

        {/* Tab 1: My Listings Table / Grid */}
        {activeTab === 'list' && (
          <div>
            {loading ? (
              <p>Loading your consignments...</p>
            ) : myProducts.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '5rem 2rem',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-taupe)',
                borderRadius: 'var(--radius-xs)',
              }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '0.5rem' }}>
                  No Active Consignments Yet
                </h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Begin consigning rare 80s/90s pieces to our curated global clientele.
                </p>
                <button onClick={() => setActiveTab('submit')} className="btn-primary">
                  SUBMIT YOUR FIRST SPECIMEN
                </button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
                gap: '1.5rem',
              }}>
                {myProducts.map((p) => {
                  const statusColors = {
                    approved: { bg: '#EBF4EA', text: '#265422', label: 'Approved & Live' },
                    pending: { bg: '#FFF4E5', text: '#8A5200', label: 'Pending Curation Review' },
                    sold: { bg: '#F2E8E8', text: '#753B3B', label: 'Sold & Dispatched' },
                    rejected: { bg: '#F8E6E6', text: '#A82828', label: 'Rejected' },
                  };
                  const currentStatus = statusColors[p.status] || statusColors.pending;

                  return (
                    <div
                      key={p.id}
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border-taupe)',
                        borderRadius: 'var(--radius-xs)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <div style={{ position: 'relative', height: '220px', backgroundColor: '#E0DAD0' }}>
                        <img
                          src={p.image_url}
                          alt={p.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                          <span style={{
                            backgroundColor: currentStatus.bg,
                            color: currentStatus.text,
                            fontSize: '0.65rem',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            fontWeight: 700,
                            padding: '4px 8px',
                            borderRadius: '2px',
                          }}>
                            {currentStatus.label}
                          </span>
                        </div>
                      </div>

                      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          <span>{p.brand}</span>
                          <span>{p.era}</span>
                        </div>
                        <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', lineHeight: 1.3 }}>
                          {p.title}
                        </h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px dashed var(--border-light)' }}>
                          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 600 }}>
                            ₹{Number(p.price).toLocaleString('en-IN')}
                          </span>
                          <button
                            onClick={() => handleDeleteListing(p.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--text-muted)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.72rem',
                            }}
                          >
                            <Trash2 size={14} />
                            <span>Withdraw</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Submit New Vintage Grail Form */}
        {activeTab === 'submit' && (
          <div style={{
            maxWidth: '760px',
            margin: '0 auto',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-taupe)',
            padding: '2.5rem',
            borderRadius: 'var(--radius-xs)',
          }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '0.5rem' }}>
              Consign a Vintage Specimen
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              All submissions undergo manual inspection by our curation team for fabric wear, era marks, and authenticity.
            </p>

            <form onSubmit={handleCreateListing} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="label-editorial">Garment Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1992 Nirvana In Utero European Tour Tee"
                  className="input-editorial"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="label-editorial">Brand / Manufacturer *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Brockum / Schott / Levi's"
                    className="input-editorial"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label-editorial">Vintage Era *</label>
                  <select
                    className="input-editorial"
                    value={formData.era}
                    onChange={(e) => setFormData({ ...formData, era: e.target.value })}
                  >
                    <option value="1970s">1970s</option>
                    <option value="1980s">1980s</option>
                    <option value="1990s">1990s</option>
                    <option value="Early 2000s (Y2K)">Early 2000s (Y2K)</option>
                    <option value="Archive">Archive</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="label-editorial">Category *</label>
                  <select
                    className="input-editorial"
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  >
                    <option value="1">Vintage Denim</option>
                    <option value="2">Graphic Tees</option>
                    <option value="3">Leather & Outerwear</option>
                    <option value="4">Everyday Classics</option>
                    <option value="5">Archive & Streetwear</option>
                  </select>
                </div>
                <div>
                  <label className="label-editorial">Tag Size / Fit *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vintage Large (Fits Boxy M)"
                    className="input-editorial"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="label-editorial">Price in Indian Rupees (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 8500"
                    className="input-editorial"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label-editorial">Condition Grade *</label>
                  <select
                    className="input-editorial"
                    value={formData.condition_status}
                    onChange={(e) => setFormData({ ...formData, condition_status: e.target.value })}
                  >
                    <option value="Mint / Unworn Vintage Deadstock">Deadstock / Unworn</option>
                    <option value="Near Mint">Near Mint</option>
                    <option value="Excellent Vintage">Excellent Vintage</option>
                    <option value="Exceptional Patina">Exceptional Patina</option>
                    <option value="Gently Loved / Sun Faded">Gently Loved / Sun Faded</option>
                    <option value="Authentic Work Distressed">Authentic Work Distressed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label-editorial">High-Resolution Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  className="input-editorial"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
              </div>

              {/* Precise Measurements (Laid Flat) */}
              <div style={{
                backgroundColor: 'var(--bg-ivory)',
                padding: '1.25rem',
                border: '1px solid var(--border-taupe)',
                borderRadius: '2px',
              }}>
                <label className="label-editorial" style={{ marginBottom: '0.75rem' }}>
                  Hand Measurements (Inches)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                  <input
                    type="text"
                    placeholder="Pit-to-Pit"
                    className="input-editorial"
                    value={formData.chest}
                    onChange={(e) => setFormData({ ...formData, chest: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Length"
                    className="input-editorial"
                    value={formData.length}
                    onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Waist"
                    className="input-editorial"
                    value={formData.waist}
                    onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Inseam"
                    className="input-editorial"
                    value={formData.inseam}
                    onChange={(e) => setFormData({ ...formData, inseam: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="label-editorial">Fabric Composition & Story *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail the provenance, fade characteristics, distressing, stitches (single/double), and manufacturer origin..."
                  className="input-editorial"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
                style={{ padding: '1.1rem', fontSize: '0.8rem' }}
              >
                {submitting ? 'TRANSMITTING ARCHIVE SPECIMEN...' : 'SUBMIT PIECE FOR CURATION APPROVAL'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
