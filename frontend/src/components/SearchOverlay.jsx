import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';

export default function SearchOverlay({ isOpen, onClose, onSearchSubmit }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearchSubmit(query.trim());
      onClose();
    }
  };

  const handleSuggestion = (term) => {
    onSearchSubmit(term);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 140,
      backgroundColor: 'rgba(246, 242, 234, 0.98)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      flexDirection: 'column',
      padding: '2.5rem 2rem',
      animation: 'fadeIn 0.25s ease',
    }}>
      <div className="container" style={{ maxWidth: '840px', width: '100%' }}>
        {/* Top Close */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2.5rem' }}>
          <button
            onClick={onClose}
            aria-label="Close search"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
            }}
          >
            <span>ESC / CLOSE</span>
            <X size={20} />
          </button>
        </div>

        {/* Big Search Input */}
        <form onSubmit={handleSubmit} style={{
          borderBottom: '2px solid var(--text-primary)',
          paddingBottom: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}>
          <Search size={28} strokeWidth={1.5} color="var(--text-primary)" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search archival denim, leather, band tees, era..."
            style={{
              width: '100%',
              background: 'none',
              border: 'none',
              outline: 'none',
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.5rem, 3.2vw, 2.4rem)',
              color: 'var(--text-primary)',
            }}
          />
          {query && (
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '0.6rem 1.25rem', fontSize: '0.7rem' }}
            >
              SEARCH
            </button>
          )}
        </form>

        {/* Curated Search Suggestions */}
        <div style={{ marginTop: '3.5rem' }}>
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.7rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            display: 'block',
            marginBottom: '1.25rem',
          }}>
            FREQUENTLY SOUGHT SPECIMENS
          </span>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {[
              "Levi's 501 Selvedge",
              "1990s Band Tees",
              "Schott Leather",
              "French Chore Jacket",
              "Barbour Bedale",
              "Wool Fisherman Knit",
              "Issey Miyake",
              "Carhartt Detroit",
            ].map((term) => (
              <button
                key={term}
                onClick={() => handleSuggestion(term)}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-taupe)',
                  borderRadius: '2px',
                  padding: '0.6rem 1.15rem',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)',
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = 'var(--text-primary)';
                  e.target.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = 'var(--border-taupe)';
                  e.target.style.color = 'var(--text-secondary)';
                }}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
