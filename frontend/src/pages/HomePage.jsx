import React, { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection.jsx';
import CategoryEditorialSection from '../components/CategoryEditorialSection.jsx';
import ProductCard from '../components/ProductCard.jsx';
import BrandStoryBanner from '../components/BrandStoryBanner.jsx';
import CuratedCollections from '../components/CuratedCollections.jsx';
import EditorialLookbook from '../components/EditorialLookbook.jsx';
import SustainabilitySection from '../components/SustainabilitySection.jsx';
import NewsletterSection from '../components/NewsletterSection.jsx';
import api from '../api/api.js';
import { ArrowRight, Sparkles, Heart, Tag, CheckCircle2 } from 'lucide-react';

export default function HomePage({ onNavigate, onSelectProduct }) {
  const [newArrivals, setNewArrivals] = useState([]);
  const [girlsDresses, setGirlsDresses] = useState([]);
  const [boysJerseys, setBoysJerseys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHomeProducts() {
      try {
        const [arrivalsRes, girlsRes, boysRes] = await Promise.all([
          api.get('/products', { params: { newArrivals: 'true', limit: 8 } }),
          api.get('/products', { params: { category: 'girls-dresses', limit: 4 } }),
          api.get('/products', { params: { category: 'boys-jerseys', limit: 4 } }),
        ]);

        setNewArrivals(arrivalsRes.data.products || []);
        setGirlsDresses(girlsRes.data.products || []);
        setBoysJerseys(boysRes.data.products || []);
      } catch (err) {
        console.error('Failed to fetch home collections:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchHomeProducts();
  }, []);

  return (
    <main>
      {/* 1. Hero Section */}
      <HeroSection
        onExploreShop={() => onNavigate('shop')}
        onDiscoverStory={() => onNavigate('story')}
      />

      {/* 1.5. ThriftWallet-Inspired Affordable Guarantee Banner */}
      <section style={{
        backgroundColor: '#241F1A',
        color: '#FAF7F2',
        padding: '1.25rem 0',
        borderBottom: '1px solid var(--border-taupe)',
      }}>
        <div className="container-wide" style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          fontSize: '0.8rem',
          letterSpacing: '0.08em',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Tag size={16} color="#4caf50" />
            <span><strong>AFFORDABLE THRIFT:</strong> Real vintage from ₹399 & ₹499</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} color="#fbc02d" />
            <span><strong>ACCURATE SIZING:</strong> Measured in real chest & length inches</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="#e91e63" />
            <span><strong>100% SANITIZED:</strong> Freshly washed, steamed & quality-checked</span>
          </div>
        </div>
      </section>

      {/* 2. Category Editorial Section */}
      <CategoryEditorialSection
        onSelectCategory={(slug) => onNavigate('shop', { category: slug })}
      />

      {/* 3. GIRLS' THRIFT DRESSES SPOTLIGHT */}
      <section style={{
        padding: '5rem 0 6rem',
        backgroundColor: '#FAF5F7',
        borderBottom: '1px solid #ebdbe2',
      }}>
        <div className="container-wide">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            <div>
              <div className="section-label" style={{ color: '#880e4f' }}>
                👗 GIRLS & WOMEN EXCLUSIVE
              </div>
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.1rem, 3.8vw, 3.2rem)',
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                margin: '0.2rem 0',
              }}>
                GIRLS' THRIFT DRESSES & VINTAGE SKIRTS
              </h2>
              <p style={{ fontSize: '0.9rem', color: '#6d4c57', maxWidth: '600px' }}>
                Cottagecore prairie midis, 90s tartan plaid pinafores, Y2K silk cowl slip dresses, and pleated tennis skirts from ₹449.
              </p>
            </div>

            <button
              onClick={() => onNavigate('shop', { category: 'girls-dresses', gender: 'girls' })}
              className="editorial-link"
              style={{ color: '#880e4f' }}
            >
              <span>SHOP ALL GIRLS' DRESSES</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.75rem',
          }} className="home-product-grid">
            {girlsDresses.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <button
              onClick={() => onNavigate('shop', { category: 'girls-dresses', gender: 'girls' })}
              className="btn-primary"
              style={{ padding: '0.85rem 2.25rem', backgroundColor: '#880e4f' }}
            >
              EXPLORE ALL GIRLS' THRIFT DRESSES
            </button>
          </div>
        </div>
      </section>

      {/* 4. BOYS' SPORTS JERSEYS & STREETWEAR SPOTLIGHT */}
      <section style={{
        padding: '5rem 0 6rem',
        backgroundColor: '#F3F6FA',
        borderBottom: '1px solid #d8e2ed',
      }}>
        <div className="container-wide">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            <div>
              <div className="section-label" style={{ color: '#0d47a1' }}>
                ⚾ BOYS & MEN STREETWEAR
              </div>
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.1rem, 3.8vw, 3.2rem)',
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                margin: '0.2rem 0',
              }}>
                VINTAGE SPORTS JERSEYS & STREET FITS
              </h2>
              <p style={{ fontSize: '0.9rem', color: '#455a64', maxWidth: '600px' }}>
                Authentic MLB baseball pinstripes, 90s NBA Bulls singlets, oversized hockey sweaters, and moto racing tops.
              </p>
            </div>

            <button
              onClick={() => onNavigate('shop', { category: 'boys-jerseys', gender: 'boys' })}
              className="editorial-link"
              style={{ color: '#0d47a1' }}
            >
              <span>SHOP ALL BOYS' JERSEYS</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.75rem',
          }} className="home-product-grid">
            {boysJerseys.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <button
              onClick={() => onNavigate('shop', { category: 'boys-jerseys', gender: 'boys' })}
              className="btn-primary"
              style={{ padding: '0.85rem 2.25rem', backgroundColor: '#0d47a1' }}
            >
              EXPLORE ALL BOYS' SPORTS JERSEYS
            </button>
          </div>
        </div>
      </section>

      {/* 5. New Arrivals: "NEW FINDS, OLD SOUL" */}
      <section style={{
        padding: '6rem 0',
        backgroundColor: 'var(--bg-ivory)',
        borderBottom: '1px solid var(--border-taupe)',
      }}>
        <div className="container-wide">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '3rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            <div>
              <div className="section-label">JUST CATALOGUED</div>
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.1rem, 3.8vw, 3.2rem)',
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
              }}>
                NEW FINDS, OLD SOUL
              </h2>
            </div>

            <button
              onClick={() => onNavigate('shop', { newArrivals: 'true' })}
              className="editorial-link"
            >
              <span>VIEW COMPLETE DROP</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Product Grid (4 columns desktop) */}
          {loading ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1.75rem',
            }} className="home-product-grid">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} style={{ height: '420px', backgroundColor: '#EAE5DB', borderRadius: '2px', animation: 'pulse 1.5s infinite' }} />
              ))}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1.75rem',
            }} className="home-product-grid">
              {newArrivals.slice(0, 8).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={onSelectProduct}
                />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <button
              onClick={() => onNavigate('shop')}
              className="btn-secondary"
              style={{ padding: '1rem 2.5rem' }}
            >
              DISCOVER COMPLETE THRIFT INVENTORY
            </button>
          </div>
        </div>
      </section>

      {/* 6. Brand Story Banner: "NOT JUST SECOND-HAND. SECOND TO NONE." */}
      <BrandStoryBanner
        onDiscoverStory={() => onNavigate('story')}
      />

      {/* 7. Curated Collections: Girls' Dresses, Boys' Streetwear, Knits, etc. */}
      <CuratedCollections
        onSelectCollection={(name) => onNavigate('shop', { collection: name })}
      />

      {/* 8. Editorial Lookbook: "WORN DIFFERENTLY" */}
      <EditorialLookbook />

      {/* 9. Sustainability Section */}
      <SustainabilitySection />

      {/* 10. Newsletter Section: "LET GOOD THINGS FIND YOU." */}
      <NewsletterSection />

      <style>{`
        @media (max-width: 1100px) {
          .home-product-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .home-product-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
