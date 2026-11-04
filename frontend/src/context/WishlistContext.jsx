import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/api.js';
import { useAuth } from './AuthContext.jsx';
import { useToast } from './ToastContext.jsx';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const local = localStorage.getItem('thrifted_guest_wishlist');
      return local ? JSON.parse(local) : [];
    } catch {
      return [];
    }
  });

  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get('/wishlist');
      if (res.data.wishlist) {
        setWishlist(res.data.wishlist);
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated, fetchWishlist]);

  // Persist guest wishlist
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('thrifted_guest_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isAuthenticated]);

  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item.product_id || item.id) === productId);
  };

  const toggleWishlist = async (product) => {
    const pId = product.id || product.product_id;
    const exists = isInWishlist(pId);

    if (isAuthenticated) {
      try {
        const res = await api.post(`/wishlist/${pId}`);
        await fetchWishlist();
        showToast(res.data.message || (exists ? 'Removed from wishlist' : 'Saved to wishlist'));
      } catch (err) {
        showToast('Failed to update wishlist', 'error');
      }
    } else {
      // Guest
      if (exists) {
        setWishlist((prev) => prev.filter((item) => (item.product_id || item.id) !== pId));
        showToast('Removed from wishlist');
      } else {
        setWishlist((prev) => [
          ...prev,
          {
            product_id: pId,
            id: pId,
            title: product.title,
            slug: product.slug,
            brand: product.brand,
            price: product.price,
            size: product.size,
            condition_status: product.condition_status,
            image_url: product.image_url,
          },
        ]);
        showToast('Saved to your archive wishlist');
      }
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isWishlistOpen,
        setIsWishlistOpen,
        openWishlist: () => setIsWishlistOpen(true),
        closeWishlist: () => setIsWishlistOpen(false),
        isInWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
