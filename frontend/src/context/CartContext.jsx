import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import api from '../api/api.js';
import { useAuth } from './AuthContext.jsx';
import { useToast } from './ToastContext.jsx';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const local = localStorage.getItem('thrifted_guest_cart');
      return local ? JSON.parse(local) : [];
    } catch {
      return [];
    }
  });

  const [isBagOpen, setIsBagOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState(null);

  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  // Sync cart with backend if authenticated
  const fetchBackendCart = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get('/cart');
      if (res.data.items) {
        setCartItems(res.data.items);
      }
    } catch (err) {
      console.error('Error fetching cart from backend:', err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBackendCart();
    }
  }, [isAuthenticated, fetchBackendCart]);

  // Persist guest cart to localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('thrifted_guest_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  const addToBag = async (product, quantity = 1) => {
    // Check if one-of-one item is already in bag
    const existingIndex = cartItems.findIndex(
      (item) => (item.product_id || item.id) === (product.id || product.product_id)
    );

    if (existingIndex > -1 && product.is_one_of_one) {
      showToast(`"${product.title}" is a 1-of-1 vintage piece and is already in your bag.`, 'info');
      setIsBagOpen(true);
      return;
    }

    if (isAuthenticated) {
      try {
        await api.post('/cart', {
          productId: product.id || product.product_id,
          quantity: product.is_one_of_one ? 1 : quantity,
        });
        await fetchBackendCart();
        showToast(`Added to your bag: ${product.title}`);
        setIsBagOpen(true);
      } catch (err) {
        showToast(err.response?.data?.error || 'Failed to add item to bag', 'error');
      }
    } else {
      // Guest state
      const pId = product.id || product.product_id;
      if (existingIndex > -1) {
        const updated = [...cartItems];
        updated[existingIndex].quantity = product.is_one_of_one ? 1 : updated[existingIndex].quantity + quantity;
        setCartItems(updated);
      } else {
        setCartItems([
          ...cartItems,
          {
            product_id: pId,
            id: pId,
            title: product.title,
            slug: product.slug,
            brand: product.brand,
            price: Number(product.price),
            size: product.size,
            condition_status: product.condition_status,
            is_one_of_one: product.is_one_of_one,
            image_url: product.image_url,
            quantity: 1,
          },
        ]);
      }
      showToast(`Added to your bag: ${product.title}`);
      setIsBagOpen(true);
    }
  };

  const removeFromBag = async (productId) => {
    if (isAuthenticated) {
      try {
        await api.delete(`/cart/${productId}`);
        setCartItems((prev) => prev.filter((item) => (item.product_id || item.id) !== productId));
        showToast('Item removed from shopping bag');
      } catch (err) {
        showToast('Failed to remove item', 'error');
      }
    } else {
      setCartItems((prev) => prev.filter((item) => (item.product_id || item.id) !== productId));
      showToast('Item removed from shopping bag');
    }
  };

  const clearBag = async () => {
    if (isAuthenticated) {
      try {
        await api.delete('/cart');
      } catch {}
    }
    setCartItems([]);
    localStorage.removeItem('thrifted_guest_cart');
  };

  // Checkout with Cash on Delivery
  const checkoutCashOnDelivery = async (shippingAddress, notes = '') => {
    if (cartItems.length === 0) {
      showToast('Your bag is empty', 'error');
      return { success: false };
    }

    setIsPlacingOrder(true);
    try {
      const orderPayload = {
        shippingAddress,
        paymentMethod: 'Cash on Delivery',
        items: cartItems.map((item) => ({
          product_id: item.product_id || item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        notes,
      };

      const res = await api.post('/orders', orderPayload);
      const createdOrder = res.data.order;

      // Confetti burst
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#753B3B', '#A5AA91', '#D9D0C2', '#29251F'],
      });

      setOrderSuccessData(createdOrder);
      setCartItems([]);
      localStorage.removeItem('thrifted_guest_cart');
      setCheckoutModalOpen(false);
      setIsBagOpen(false);
      showToast(`Order #${createdOrder.orderNumber} confirmed! Cash on Delivery.`);

      return { success: true, order: createdOrder };
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to place order. Please try again.';
      showToast(msg, 'error');
      return { success: false, error: msg };
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemCount,
        subtotal,
        isBagOpen,
        setIsBagOpen,
        openBag: () => setIsBagOpen(true),
        closeBag: () => setIsBagOpen(false),
        checkoutModalOpen,
        setCheckoutModalOpen,
        orderSuccessData,
        setOrderSuccessData,
        isPlacingOrder,
        addToBag,
        removeFromBag,
        clearBag,
        checkoutCashOnDelivery,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
