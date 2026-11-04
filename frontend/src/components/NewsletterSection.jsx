import React, { useState } from 'react';
import { useToast } from '../context/ToastContext.jsx';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    setSubscribed(true);
    showToast('You are now subscribed to the THRIFTED Private Dispatch.');
  };

  return (
    <section style={{
      padding: '5rem 0',
      backgroundColor: 'var(--bg-ivory)',
      borderBottom: '1px solid var(--border-taupe)',
      textAlign: 'center',
    }}>
      <div className="container" style={{ maxWidth: '640px' }}>
        <div className="section-label" style={{ justifyContent: 'center' }}>
          ARCHIVE DISPATCH
        </div>
        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2.1rem, 3.8vw, 3.2rem)',
          fontWeight: 400,
          margin: '0.4rem 0 1rem',
          letterSpacing: '-0.02em',
        }}>
          LET GOOD THINGS FIND YOU.
        </h2>
        <p style={{
          fontSize: '0.95rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          marginBottom: '2rem',
        }}>
          Receive private notifications 30 minutes before new drops go live. Vintage denim, Japanese outerwear, and one-of-one archival finds.
        </p>

        {subscribed ? (
          <div style={{
            backgroundColor: 'var(--bg-sage-light)',
            border: '1px solid var(--bg-sage)',
            padding: '1.25rem 2rem',
            borderRadius: 'var(--radius-xs)',
            fontFamily: 'var(--font-serif)',
            fontSize: '1.2rem',
            color: 'var(--text-primary)',
          }}>
            Welcome to the inner circle. We will notify you before our next drop.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            maxWidth: '480px',
            margin: '0 auto',
            gap: '0.5rem',
          }} className="newsletter-form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="input-editorial"
              style={{
                borderRadius: 'var(--radius-xs)',
                backgroundColor: 'var(--bg-card)',
              }}
            />
            <button
              type="submit"
              className="btn-primary"
              style={{ whiteSpace: 'nowrap' }}
            >
              SUBSCRIBE
            </button>
          </form>
        )}

        <span style={{
          display: 'block',
          marginTop: '1rem',
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.04em',
        }}>
          No spam, strictly vintage drops & editorial lookbooks. Unsubscribe anytime.
        </span>
      </div>

      <style>{`
        @media (max-width: 580px) {
          .newsletter-form {
            flex-direction: column !important;
          }
        }
      `}</style>
    </section>
  );
}
