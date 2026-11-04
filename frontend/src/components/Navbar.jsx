import React, { useState, useEffect } from 'react';
import { Search, Heart, ShoppingBag, User, Menu, X, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

export default function Navbar({ onNavigate, currentPage, onOpenAuth, onOpenSearch }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { user, isAuthenticated, logout, isAdmin, isSeller } = useAuth();
  const { itemCount, openBag } = useCart();
  const { wishlistCount, openWishlist } = useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (page, filterParam = null) => {
    onNavigate(page, filterParam);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 40,
      backgroundColor: isScrolled ? 'rgba(246, 242, 234, 0.96)' : 'var(--bg-ivory)',
      backdropFilter: isScrolled ? 'blur(10px)' : 'none',
      borderBottom: '1px solid var(--border-taupe)',
      transition: 'background-color 0.3s ease, border-color 0.3s ease',
    }}>
      <div className="container-wide" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '74px',
      }}>
        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: '8px',
          }}
          className="mobile-toggle-btn"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Brand Wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <button
            onClick={() => handleNavClick('home')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              textAlign: 'left',
            }}
          >
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.95rem',
              fontWeight: 600,
              letterSpacing: '0.14em',
              color: 'var(--text-primary)',
              textTransform: 'uppercase',
              display: 'block',
              lineHeight: 1,
            }}>
              THRIFTED
            </span>
            <span style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.58rem',
              letterSpacing: '0.24em',
              color: 'var(--accent-burgundy)',
              textTransform: 'uppercase',
              fontWeight: 600,
              display: 'block',
              marginTop: '4px',
            }}>
              ARCHIVAL & VINTAGE
            </span>
          </button>
        </div>

        {/* Desktop Primary Navigation */}
        <nav
          aria-label="Main Navigation"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2.4rem',
          }}
          className="desktop-nav-links"
        >
          <button
            onClick={() => handleNavClick('shop')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              fontWeight: currentPage === 'shop' ? 700 : 500,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: currentPage === 'shop' ? 'var(--accent-burgundy)' : 'var(--text-primary)',
              position: 'relative',
              padding: '6px 0',
            }}
          >
            Shop
            {currentPage === 'shop' && (
              <span style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '1px',
                backgroundColor: 'var(--accent-burgundy)',
              }} />
            )}
          </button>

          {/* Girls' Thrift Dresses */}
          <button
            onClick={() => handleNavClick('shop', { category: 'girls-dresses', gender: 'girls' })}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#880e4f',
              padding: '6px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            👗 Girls' Dresses
            <span style={{
              fontSize: '0.55rem',
              backgroundColor: '#fce4ec',
              color: '#c2185b',
              padding: '1px 5px',
              borderRadius: '2px',
              fontWeight: 700,
            }}>₹449+</span>
          </button>

          {/* Boys' Sports Jerseys */}
          <button
            onClick={() => handleNavClick('shop', { category: 'boys-jerseys', gender: 'boys' })}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#0d47a1',
              padding: '6px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            ⚾ Boys' Jerseys
            <span style={{
              fontSize: '0.55rem',
              backgroundColor: '#e3f2fd',
              color: '#1565c0',
              padding: '1px 5px',
              borderRadius: '2px',
              fontWeight: 700,
            }}>HOT</span>
          </button>

          {/* Under ₹499 Steals */}
          <button
            onClick={() => handleNavClick('shop', { maxPrice: 499 })}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#1b5e20',
              padding: '6px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            ⚡ Under ₹499
          </button>

          <button
            onClick={() => handleNavClick('shop', { newArrivals: 'true' })}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
              padding: '6px 0',
            }}
          >
            New Arrivals
          </button>

          <button
            onClick={() => handleNavClick('shop', { collection: 'all' })}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
              padding: '6px 0',
            }}
          >
            Collections
          </button>

          <button
            onClick={() => handleNavClick('story')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              fontWeight: currentPage === 'story' ? 700 : 500,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: currentPage === 'story' ? 'var(--accent-burgundy)' : 'var(--text-primary)',
              padding: '6px 0',
            }}
          >
            Our Story
          </button>

          <button
            onClick={() => handleNavClick('sell')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              fontWeight: currentPage === 'sell' ? 700 : 500,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: currentPage === 'sell' ? 'var(--accent-burgundy)' : 'var(--text-primary)',
              padding: '6px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            Sell With Us
            <span style={{
              fontSize: '0.6rem',
              backgroundColor: 'var(--accent-burgundy-light)',
              color: 'var(--accent-burgundy)',
              padding: '1px 5px',
              borderRadius: '2px',
              fontWeight: 700,
            }}>CONSIGN</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => handleNavClick('admin')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#fff',
                backgroundColor: 'var(--accent-burgundy)',
                padding: '4px 10px',
                borderRadius: '2px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <ShieldCheck size={13} />
              Curation Admin
            </button>
          )}
        </nav>

        {/* Action Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            aria-label="Search vintage items"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.2s ease',
            }}
            title="Search archive"
          >
            <Search size={19} strokeWidth={1.8} />
          </button>

          {/* Wishlist Trigger */}
          <button
            onClick={openWishlist}
            aria-label="View wishlist"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              padding: '6px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.2s ease',
            }}
            title="Wishlist"
          >
            <Heart size={19} strokeWidth={1.8} />
            {wishlistCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '0px',
                right: '-2px',
                backgroundColor: 'var(--accent-burgundy)',
                color: '#fff',
                fontSize: '0.62rem',
                fontWeight: 700,
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Bag Trigger */}
          <button
            onClick={openBag}
            aria-label="View shopping bag"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              padding: '6px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.2s ease',
            }}
            title="Shopping Bag"
          >
            <ShoppingBag size={19} strokeWidth={1.8} />
            {itemCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '0px',
                right: '-2px',
                backgroundColor: 'var(--bg-espresso)',
                color: '#fff',
                fontSize: '0.62rem',
                fontWeight: 700,
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {itemCount}
              </span>
            )}
          </button>

          {/* User Account / Auth Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                if (isAuthenticated) {
                  setUserDropdownOpen(!userDropdownOpen);
                } else {
                  onOpenAuth();
                }
              }}
              aria-label="Account options"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.75rem',
                fontWeight: 500,
              }}
              title={isAuthenticated ? user.name : 'Sign in'}
            >
              <User size={19} strokeWidth={1.8} />
              {isAuthenticated && (
                <span className="user-name-label" style={{
                  maxWidth: '90px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.04em',
                }}>
                  {user.name.split(' ')[0]}
                </span>
              )}
            </button>

            {/* Dropdown Menu */}
            {userDropdownOpen && isAuthenticated && (
              <div style={{
                position: 'absolute',
                top: '120%',
                right: 0,
                width: '210px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-taupe)',
                borderRadius: '2px',
                boxShadow: 'var(--shadow-medium)',
                zIndex: 60,
                padding: '0.5rem 0',
              }}>
                <div style={{
                  padding: '0.65rem 1.15rem',
                  borderBottom: '1px solid var(--border-light)',
                  marginBottom: '0.35rem',
                }}>
                  <p style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-primary)' }}>{user.name}</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user.email}</p>
                  <span style={{
                    display: 'inline-block',
                    fontSize: '0.6rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    fontWeight: 700,
                    marginTop: '4px',
                    color: 'var(--accent-burgundy)',
                  }}>
                    {user.role} Account
                  </span>
                </div>

                <button
                  onClick={() => handleNavClick('orders')}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    padding: '0.6rem 1.15rem',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-sans)',
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-ivory)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Order History
                </button>

                {isSeller && (
                  <button
                    onClick={() => handleNavClick('sell')}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      padding: '0.6rem 1.15rem',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-sans)',
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-ivory)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    Seller Portal
                  </button>
                )}

                {isAdmin && (
                  <button
                    onClick={() => handleNavClick('admin')}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      padding: '0.6rem 1.15rem',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      color: 'var(--accent-burgundy)',
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 600,
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-ivory)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    Admin Curation
                  </button>
                )}

                <div style={{ borderTop: '1px solid var(--border-light)', marginTop: '0.35rem', paddingTop: '0.35rem' }}>
                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      padding: '0.6rem 1.15rem',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      color: '#a03030',
                      fontFamily: 'var(--font-sans)',
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-ivory)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '74px',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'var(--bg-ivory)',
          zIndex: 50,
          padding: '2rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--border-taupe)',
          overflowY: 'auto',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <button
              onClick={() => handleNavClick('shop')}
              style={{
                background: 'none',
                border: 'none',
                textAlign: 'left',
                fontSize: '1.25rem',
                fontFamily: 'var(--font-serif)',
                cursor: 'pointer',
                color: 'var(--text-primary)',
              }}
            >
              Shop All Archive
            </button>

            <button
              onClick={() => handleNavClick('shop', { category: 'girls-dresses', gender: 'girls' })}
              style={{
                background: 'none',
                border: 'none',
                textAlign: 'left',
                fontSize: '1.25rem',
                fontFamily: 'var(--font-serif)',
                cursor: 'pointer',
                color: '#880e4f',
                fontWeight: 600,
              }}
            >
              👗 Girls' Thrift Dresses
            </button>

            <button
              onClick={() => handleNavClick('shop', { category: 'boys-jerseys', gender: 'boys' })}
              style={{
                background: 'none',
                border: 'none',
                textAlign: 'left',
                fontSize: '1.25rem',
                fontFamily: 'var(--font-serif)',
                cursor: 'pointer',
                color: '#0d47a1',
                fontWeight: 600,
              }}
            >
              ⚾ Boys' Sports Jerseys
            </button>

            <button
              onClick={() => handleNavClick('shop', { maxPrice: 499 })}
              style={{
                background: 'none',
                border: 'none',
                textAlign: 'left',
                fontSize: '1.25rem',
                fontFamily: 'var(--font-serif)',
                cursor: 'pointer',
                color: '#1b5e20',
                fontWeight: 600,
              }}
            >
              ⚡ Under ₹499 Thrift Steals
            </button>

            <button
              onClick={() => handleNavClick('shop', { newArrivals: 'true' })}
              style={{
                background: 'none',
                border: 'none',
                textAlign: 'left',
                fontSize: '1.25rem',
                fontFamily: 'var(--font-serif)',
                cursor: 'pointer',
                color: 'var(--text-primary)',
              }}
            >
              New Arrivals
            </button>

            <button
              onClick={() => handleNavClick('shop', { collection: 'all' })}
              style={{
                background: 'none',
                border: 'none',
                textAlign: 'left',
                fontSize: '1.25rem',
                fontFamily: 'var(--font-serif)',
                cursor: 'pointer',
                color: 'var(--text-primary)',
              }}
            >
              Curated Collections
            </button>

            <button
              onClick={() => handleNavClick('story')}
              style={{
                background: 'none',
                border: 'none',
                textAlign: 'left',
                fontSize: '1.25rem',
                fontFamily: 'var(--font-serif)',
                cursor: 'pointer',
                color: 'var(--text-primary)',
              }}
            >
              Our Story
            </button>

            <button
              onClick={() => handleNavClick('sell')}
              style={{
                background: 'none',
                border: 'none',
                textAlign: 'left',
                fontSize: '1.25rem',
                fontFamily: 'var(--font-serif)',
                cursor: 'pointer',
                color: 'var(--accent-burgundy)',
                fontWeight: 600,
              }}
            >
              Sell With Us (Consign)
            </button>

            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                style={{
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  fontSize: '1.1rem',
                  fontFamily: 'var(--font-sans)',
                  cursor: 'pointer',
                  color: 'var(--accent-burgundy)',
                  fontWeight: 700,
                }}
              >
                Admin Curation Dashboard
              </button>
            )}
          </div>

          <div style={{ borderTop: '1px solid var(--border-taupe)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {isAuthenticated ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: 600 }}>{user.name}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="editorial-link"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="btn-primary"
                style={{ width: '100%' }}
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 992px) {
          .desktop-nav-links {
            display: none !important;
          }
          .mobile-toggle-btn {
            display: block !important;
          }
          .user-name-label {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
