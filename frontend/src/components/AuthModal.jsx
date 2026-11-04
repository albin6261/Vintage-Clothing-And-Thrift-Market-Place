import React, { useState } from 'react';
import { X, User, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer',
  });
  const [submitting, setSubmitting] = useState(false);

  const { login, register, quickDemoLogin } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    let result;
    if (mode === 'login') {
      result = await login(formData.email, formData.password);
    } else {
      result = await register(formData);
    }
    setSubmitting(false);
    if (result.success) {
      onClose();
    }
  };

  const handleDemo = async (role) => {
    setSubmitting(true);
    const result = await quickDemoLogin(role);
    setSubmitting(false);
    if (result.success) {
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 150,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
    }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(29, 26, 22, 0.75)',
          backdropFilter: 'blur(5px)',
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '460px',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-taupe)',
        borderRadius: 'var(--radius-xs)',
        boxShadow: 'var(--shadow-elevated)',
        zIndex: 151,
        padding: '2.5rem 2rem',
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close auth modal"
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-primary)',
          }}
        >
          <X size={20} />
        </button>

        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.8rem',
            letterSpacing: '0.14em',
            fontWeight: 600,
            color: 'var(--text-primary)',
            textTransform: 'uppercase',
            display: 'block',
          }}>
            THRIFTED
          </span>
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--accent-burgundy)',
            fontWeight: 600,
          }}>
            CLIENT & CONSIGNMENT PORTAL
          </span>
        </div>

        {/* Tab switch */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          marginBottom: '1.75rem',
          borderBottom: '1px solid var(--border-taupe)',
        }}>
          <button
            onClick={() => setMode('login')}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.65rem',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontWeight: mode === 'login' ? 700 : 500,
              color: mode === 'login' ? 'var(--text-primary)' : 'var(--text-muted)',
              borderBottom: mode === 'login' ? '2px solid var(--text-primary)' : 'none',
              marginBottom: '-1px',
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('register')}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.65rem',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontWeight: mode === 'register' ? 700 : 500,
              color: mode === 'register' ? 'var(--text-primary)' : 'var(--text-muted)',
              borderBottom: mode === 'register' ? '2px solid var(--text-primary)' : 'none',
              marginBottom: '-1px',
            }}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mode === 'register' && (
            <div>
              <label className="label-editorial">Full Name *</label>
              <input
                type="text"
                required
                className="input-editorial"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Clara Vance"
              />
            </div>
          )}

          <div>
            <label className="label-editorial">Email Address *</label>
            <input
              type="email"
              required
              className="input-editorial"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="name@domain.com"
            />
          </div>

          <div>
            <label className="label-editorial">Password *</label>
            <input
              type="password"
              required
              className="input-editorial"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="label-editorial">Account Purpose</label>
              <select
                className="input-editorial"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="buyer">Vintage Collector / Buyer</option>
                <option value="seller">Consignor / Independent Archivist</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary"
            style={{
              marginTop: '0.5rem',
              padding: '0.95rem',
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? 'AUTHENTICATING...' : mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </button>
        </form>

        {/* Quick Demo Logins Section */}
        <div style={{
          marginTop: '2rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--border-light)',
          textAlign: 'center',
        }}>
          <span style={{
            fontSize: '0.68rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            display: 'block',
            marginBottom: '0.75rem',
          }}>
            QUICK ACCESS DEMO ACCOUNTS
          </span>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleDemo('buyer')}
              className="btn-secondary"
              style={{ padding: '0.45rem', fontSize: '0.65rem' }}
            >
              Buyer
            </button>
            <button
              type="button"
              onClick={() => handleDemo('seller')}
              className="btn-secondary"
              style={{ padding: '0.45rem', fontSize: '0.65rem' }}
            >
              Seller
            </button>
            <button
              type="button"
              onClick={() => handleDemo('admin')}
              className="btn-secondary"
              style={{
                padding: '0.45rem',
                fontSize: '0.65rem',
                color: 'var(--accent-burgundy)',
                borderColor: 'var(--accent-burgundy)',
              }}
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
