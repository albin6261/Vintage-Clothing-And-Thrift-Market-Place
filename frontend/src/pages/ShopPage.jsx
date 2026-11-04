import React, { useState, useEffect, useCallback } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import api from '../api/api.js';
import { SlidersHorizontal, X, Search, RotateCcw, ArrowUpDown } from 'lucide-react';

export default function ShopPage({ initialFilter, onSelectProduct }) {
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [gender, setGender] = useState(initialFilter?.gender || 'all');
  const [category, setCategory] = useState(initialFilter?.category || 'all');
  const [era, setEra] = useState('all');
  const [condition, setCondition] = useState('all');
  const [collection, setCollection] = useState(initialFilter?.collection || 'all');
  const [search, setSearch] = useState(initialFilter?.search || '');
  const [sort, setSort] = useState('newest');
  const [minPrice, setMinPrice] = useState(initialFilter?.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(initialFilter?.maxPrice || '');
  const [newArrivalsOnly, setNewArrivalsOnly] = useState(Boolean(initialFilter?.newArrivals));

  // Sync initialFilter prop updates
  useEffect(() => {
    if (initialFilter) {
      if (initialFilter.gender !== undefined) setGender(initialFilter.gender);
      if (initialFilter.category !== undefined) setCategory(initialFilter.category);
      if (initialFilter.minPrice !== undefined) setMinPrice(initialFilter.minPrice);
      if (initialFilter.maxPrice !== undefined) setMaxPrice(initialFilter.maxPrice);
      if (initialFilter.collection !== undefined) setCollection(initialFilter.collection);
      if (initialFilter.search !== undefined) setSearch(initialFilter.search);
      if (initialFilter.newArrivals !== undefined) setNewArrivalsOnly(Boolean(initialFilter.newArrivals));
    }
  }, [initialFilter]);

  // Mobile filter drawer
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Categories list (featuring Thrift Dresses and Boys' Jerseys)
  const categoriesList = [
    { label: 'All Archives', value: 'all' },
    { label: "👗 Girls' Thrift Dresses", value: 'girls-dresses' },
    { label: "⚾ Boys' Sports Jerseys", value: 'boys-jerseys' },
    { label: '👕 Graphic & Band Tees', value: 'graphic-tees' },
    { label: '🧥 Jackets & Outerwear', value: 'leather-outerwear' },
    { label: '🧶 Sweaters & Knits', value: 'sweaters-cardigans' },
    { label: '👖 Baggy Denims & Bottoms', value: 'vintage-denim' },
    { label: '👔 Flannels & Shirts', value: 'everyday-classics' },
  ];

  const eras = ['all', '1970s', '1980s', '1990s', 'Early 2000s (Y2K)'];
  const conditions = ['all', 'Mint / Unworn Vintage Deadstock', 'Near Mint', 'Near Mint Vintage', 'Exceptional Patina', 'Excellent Vintage', 'Gently Loved / Sun Faded', 'Authentic Work Distressed'];

  const fetchFilteredProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        sort,
      };
      if (gender && gender !== 'all') params.gender = gender;
      if (category && category !== 'all') params.category = category;
      if (era && era !== 'all') params.era = era;
      if (condition && condition !== 'all') params.condition = condition;
      if (collection && collection !== 'all') params.collection = collection;
      if (search.trim()) params.search = search.trim();
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (newArrivalsOnly) params.newArrivals = 'true';

      const res = await api.get('/products', { params });
      setProducts(res.data.products || []);
      setTotalCount(res.data.pagination?.total || 0);
    } catch (err) {
      console.error('Error fetching shop items:', err);
    } finally {
      setLoading(false);
    }
  }, [gender, category, era, condition, collection, search, sort, minPrice, maxPrice, newArrivalsOnly]);

  useEffect(() => {
    fetchFilteredProducts();
  }, [fetchFilteredProducts]);

  const resetAllFilters = () => {
    setGender('all');
    setCategory('all');
    setEra('all');
    setCondition('all');
    setCollection('all');
    setSearch('');
    setSort('newest');
    setMinPrice('');
    setMaxPrice('');
    setNewArrivalsOnly(false);
  };

  const activeFiltersCount = [
    gender !== 'all',
    category !== 'all',
    era !== 'all',
    condition !== 'all',
    collection !== 'all',
    search.trim() !== '',
    minPrice !== '',
    maxPrice !== '',
    newArrivalsOnly,
  ].filter(Boolean).length;

  return (
    <div style={{ backgroundColor: 'var(--bg-ivory)', minHeight: '100vh', padding: '3.5rem 0 6rem' }}>
      <div className="container-wide">
        
        {/* Editorial Heading & Subtitle */}
        <div style={{
          borderBottom: '1px solid var(--border-taupe)',
          paddingBottom: '2.5rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}>
          <div>
            <div className="section-label">AFFORDABLE INDIAN THRIFT STORE</div>
            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.5rem, 4.5vw, 4rem)',
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              margin: '0.25rem 0 0.5rem',
            }}>
              THRIFT DRESSES & VINTAGE FITS
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              Showing {totalCount} handpicked thrift pieces for boys & girls with real inch chest measurements.
            </p>
          </div>

          {/* Search Field & Sort Select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: '260px' }}>
              <input
                type="text"
                placeholder="Search dresses, jerseys, brands..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-editorial"
                style={{ paddingLeft: '2.5rem', fontSize: '0.8rem' }}
              />
              <Search
                size={16}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                Sort:
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="input-editorial"
                style={{ width: 'auto', padding: '0.85rem 1rem', fontSize: '0.8rem', cursor: 'pointer' }}
              >
                <option value="newest">Newest Catalogued</option>
                <option value="price-asc">Price: Low to High (Budget First)</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="featured">Editorial Highlights</option>
              </select>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="btn-secondary mobile-filter-toggle"
              style={{ display: 'none', gap: '6px', padding: '0.85rem 1.25rem' }}
            >
              <SlidersHorizontal size={15} />
              <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
            </button>
          </div>
        </div>

        {/* 1. Gender Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          flexWrap: 'wrap',
          marginBottom: '1.25rem',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>
            SHOP BY:
          </span>
          {[
            { label: 'All Thrift Fits', value: 'all', icon: '✨', bg: 'var(--bg-espresso)', color: '#fff' },
            { label: "Girls & Women", value: 'girls', icon: '👧', bg: '#880e4f', color: '#fff' },
            { label: "Boys & Men", value: 'boys', icon: '👦', bg: '#0d47a1', color: '#fff' },
            { label: "Unisex Streetwear", value: 'unisex', icon: '🛹', bg: '#37474f', color: '#fff' },
          ].map((g) => {
            const isSelected = gender === g.value;
            return (
              <button
                key={g.value}
                onClick={() => setGender(g.value)}
                style={{
                  padding: '0.55rem 1.25rem',
                  backgroundColor: isSelected ? g.bg : 'var(--bg-card)',
                  color: isSelected ? g.color : 'var(--text-primary)',
                  border: isSelected ? `1px solid ${g.bg}` : '1px solid var(--border-taupe)',
                  borderRadius: '25px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <span>{g.icon}</span>
                <span>{g.label}</span>
              </button>
            );
          })}
        </div>

        {/* 2. Budget Steals Quick-Filter Strip (ThriftWallet style) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          marginBottom: '1.75rem',
          flexWrap: 'wrap',
          padding: '0.6rem 0.85rem',
          backgroundColor: 'rgba(0,0,0,0.02)',
          borderRadius: '6px',
          border: '1px dashed var(--border-light)',
        }}>
          <span style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>
            AFFORDABLE BUDGET PICKS:
          </span>
          {[
            { label: 'All Rates', min: '', max: '' },
            { label: '⚡ Under ₹499 Steals', min: '', max: '499', highlight: '#1b5e20' },
            { label: 'Under ₹799 Finds', min: '', max: '799' },
            { label: 'Under ₹999 Streetwear', min: '', max: '999' },
            { label: 'Under ₹1,499 Outerwear', min: '', max: '1499' },
          ].map((b, idx) => {
            const isSelected = maxPrice === b.max && minPrice === b.min;
            return (
              <button
                key={idx}
                onClick={() => {
                  setMinPrice(b.min);
                  setMaxPrice(b.max);
                }}
                style={{
                  padding: '0.35rem 0.85rem',
                  backgroundColor: isSelected ? 'var(--text-primary)' : '#fff',
                  color: isSelected ? '#ffffff' : (b.highlight && !isSelected ? b.highlight : 'var(--text-secondary)'),
                  border: isSelected ? '1px solid var(--text-primary)' : '1px solid var(--border-light)',
                  borderRadius: '16px',
                  fontSize: '0.74rem',
                  fontWeight: b.highlight || isSelected ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {b.label}
              </button>
            );
          })}
        </div>

        {/* 3. Category Pills Strip */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          overflowX: 'auto',
          paddingBottom: '1.25rem',
          marginBottom: '2rem',
          borderBottom: '1px solid var(--border-light)',
        }}>
          {categoriesList.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              style={{
                background: category === cat.value ? 'var(--bg-espresso)' : 'var(--bg-card)',
                color: category === cat.value ? 'var(--bg-ivory)' : 'var(--text-primary)',
                border: '1px solid',
                borderColor: category === cat.value ? 'var(--bg-espresso)' : 'var(--border-taupe)',
                borderRadius: '2px',
                padding: '0.55rem 1.25rem',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'var(--transition-smooth)',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Main Shop Grid with Filter Sidebar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          gap: '3rem',
          alignItems: 'start',
        }} className="shop-layout-grid">
          
          {/* Desktop Filter Sidebar */}
          <aside className="desktop-filters-sidebar" style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-taupe)',
            padding: '1.75rem',
            borderRadius: 'var(--radius-xs)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700 }}>
                FILTERS
              </span>
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetAllFilters}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-burgundy)',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 600,
                  }}
                >
                  <RotateCcw size={12} />
                  <span>Reset All</span>
                </button>
              )}
            </div>

            {/* Gender / Demographic Filter */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label className="label-editorial">GENDER / FITS</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { label: 'All Fits', value: 'all' },
                  { label: "Girls & Women (Dresses & Skirts)", value: 'girls' },
                  { label: "Boys & Men (Jerseys & Streetwear)", value: 'boys' },
                  { label: "Unisex Streetwear", value: 'unisex' },
                ].map((g) => (
                  <label key={g.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', cursor: 'pointer', color: gender === g.value ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                    <input
                      type="radio"
                      name="sidebar-gender"
                      checked={gender === g.value}
                      onChange={() => setGender(g.value)}
                      style={{ accentColor: 'var(--accent-burgundy)' }}
                    />
                    <span style={{ fontWeight: gender === g.value ? 700 : 400 }}>{g.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Era Filter */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label className="label-editorial">VINTAGE ERA</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {eras.map((e) => (
                  <label key={e} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', cursor: 'pointer', color: era === e ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                    <input
                      type="radio"
                      name="era"
                      checked={era === e}
                      onChange={() => setEra(e)}
                      style={{ accentColor: 'var(--accent-burgundy)' }}
                    />
                    <span>{e === 'all' ? 'All Eras (1970–2000s)' : e}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label className="label-editorial">PRICE RANGE (₹)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '6px' }}>
                <input
                  type="number"
                  placeholder="Min (₹)"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="input-editorial"
                  style={{ padding: '0.5rem 0.75rem', fontSize: '0.75rem' }}
                />
                <input
                  type="number"
                  placeholder="Max (₹)"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="input-editorial"
                  style={{ padding: '0.5rem 0.75rem', fontSize: '0.75rem' }}
                />
              </div>
            </div>

            {/* Condition Filter */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label className="label-editorial">CONDITION</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="input-editorial"
                style={{ fontSize: '0.78rem', padding: '0.65rem 0.85rem' }}
              >
                <option value="all">Any Condition</option>
                <option value="Mint / Unworn Vintage Deadstock">Deadstock / Unworn</option>
                <option value="Near Mint">Near Mint</option>
                <option value="Excellent Vintage">Excellent Vintage</option>
                <option value="Exceptional Patina">Exceptional Patina</option>
                <option value="Gently Loved / Sun Faded">Sun Faded / Gently Loved</option>
                <option value="Authentic Work Distressed">Authentic Work Distressed</option>
              </select>
            </div>

            {/* New Arrivals Toggle */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={newArrivalsOnly}
                  onChange={(e) => setNewArrivalsOnly(e.target.checked)}
                  style={{ accentColor: 'var(--accent-burgundy)' }}
                />
                <span style={{ fontWeight: 600 }}>Only New Arrivals</span>
              </label>
            </div>
          </aside>

          {/* Products Grid */}
          <main>
            {loading ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1.75rem',
              }} className="shop-product-grid">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} style={{ height: '440px', backgroundColor: '#EAE5DB', borderRadius: '2px', animation: 'pulse 1.5s infinite' }} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '5rem 2rem',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-taupe)',
                borderRadius: 'var(--radius-xs)',
              }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '0.75rem' }}>
                  No Matching Archival Pieces Found
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
                  Try relaxing your search terms, price thresholds, or era filters to discover other rare vintage specimens.
                </p>
                <button onClick={resetAllFilters} className="btn-primary">
                  RESET ALL FILTERS
                </button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1.75rem',
              }} className="shop-product-grid">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelectProduct={onSelectProduct}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Slide-in Drawer */}
      {mobileFilterOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 110, display: 'flex' }}>
          <div
            onClick={() => setMobileFilterOpen(false)}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)' }}
          />
          <div style={{
            position: 'relative',
            width: '85%',
            maxWidth: '340px',
            backgroundColor: 'var(--bg-ivory)',
            height: '100%',
            zIndex: 111,
            padding: '2rem 1.5rem',
            overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem' }}>Filters</h3>
              <button onClick={() => setMobileFilterOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Mobile Filters Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label className="label-editorial">Shop By Gender / Fit</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="input-editorial"
                >
                  <option value="all">All Fits</option>
                  <option value="girls">Girls & Women (Dresses & Skirts)</option>
                  <option value="boys">Boys & Men (Jerseys & Streetwear)</option>
                  <option value="unisex">Unisex Streetwear</option>
                </select>
              </div>

              <div>
                <label className="label-editorial">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-editorial"
                >
                  {categoriesList.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>

              <div>
                <label className="label-editorial">Era</label>
                <select
                  value={era}
                  onChange={(e) => setEra(e.target.value)}
                  className="input-editorial"
                >
                  {eras.map(e => <option key={e} value={e}>{e === 'all' ? 'All Eras' : e}</option>)}
                </select>
              </div>

              <div>
                <label className="label-editorial">Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="input-editorial"
                >
                  <option value="all">Any Condition</option>
                  <option value="Excellent Vintage">Excellent Vintage</option>
                  <option value="Near Mint">Near Mint</option>
                  <option value="Authentic Work Distressed">Authentic Work Distressed</option>
                </select>
              </div>

              <button
                onClick={() => setMobileFilterOpen(false)}
                className="btn-primary"
                style={{ width: '100%', marginTop: '1rem' }}
              >
                APPLY FILTERS
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 992px) {
          .shop-layout-grid {
            grid-template-columns: 1fr !important;
          }
          .desktop-filters-sidebar {
            display: none !important;
          }
          .mobile-filter-toggle {
            display: inline-flex !important;
          }
          .shop-product-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 580px) {
          .shop-product-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
