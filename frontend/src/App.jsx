import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';

import AnnouncementBar from './components/AnnouncementBar.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import CheckoutModal from './components/CheckoutModal.jsx';
import WishlistDrawer from './components/WishlistDrawer.jsx';
import AuthModal from './components/AuthModal.jsx';
import SearchOverlay from './components/SearchOverlay.jsx';

import HomePage from './pages/HomePage.jsx';
import ShopPage from './pages/ShopPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import SellerDashboard from './pages/SellerDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import OurStoryPage from './pages/OurStoryPage.jsx';
import OrderHistoryPage from './pages/OrderHistoryPage.jsx';

function MainApp() {
  const [currentPage, setCurrentPage] = useState('home');
  const [filterParam, setFilterParam] = useState(null);
  const [selectedProductSlug, setSelectedProductSlug] = useState(null);

  // Modals & overlays
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);

  // Handle browser back/forward or hash
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('product/')) {
        const slug = hash.replace('product/', '');
        setSelectedProductSlug(slug);
        setCurrentPage('product');
      } else if (['shop', 'story', 'sell', 'admin', 'orders'].includes(hash)) {
        setCurrentPage(hash);
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (page, param = null) => {
    setCurrentPage(page);
    setFilterParam(param);
    if (page !== 'product') {
      window.location.hash = page === 'home' ? '' : page;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product) => {
    const slug = product.slug || product.id;
    setSelectedProductSlug(slug);
    setCurrentPage('product');
    window.location.hash = `product/${slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (searchTerm) => {
    navigateTo('shop', { search: searchTerm });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-ivory)' }}>
      {/* 1. Slim Burgundy Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Refined Sticky Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={navigateTo}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenSearch={() => setSearchOverlayOpen(true)}
      />

      {/* 3. Page Content Switcher */}
      <div style={{ flexGrow: 1 }}>
        {currentPage === 'home' && (
          <HomePage
            onNavigate={navigateTo}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'shop' && (
          <ShopPage
            initialFilter={filterParam}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'product' && (
          <ProductDetailPage
            productSlug={selectedProductSlug}
            onBackToShop={() => navigateTo('shop')}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'story' && (
          <OurStoryPage
            onExploreShop={() => navigateTo('shop')}
          />
        )}

        {currentPage === 'sell' && (
          <SellerDashboard
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {currentPage === 'admin' && (
          <AdminDashboard
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {currentPage === 'orders' && (
          <OrderHistoryPage
            onOpenAuth={() => setAuthModalOpen(true)}
            onExploreShop={() => navigateTo('shop')}
            onSelectProduct={handleSelectProduct}
          />
        )}
      </div>

      {/* 4. Luxury Dark Espresso Footer */}
      <Footer onNavigate={navigateTo} />

      {/* 5. Drawers & Modals */}
      <CartDrawer
        onSelectProduct={handleSelectProduct}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      <CheckoutModal
        onOrderComplete={(order) => {
          navigateTo('orders');
        }}
      />

      <WishlistDrawer
        onSelectProduct={handleSelectProduct}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <SearchOverlay
        isOpen={searchOverlayOpen}
        onClose={() => setSearchOverlayOpen(false)}
        onSearchSubmit={handleSearchSubmit}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <MainApp />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
