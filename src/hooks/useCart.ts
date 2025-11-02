import { useEffect, useState } from 'react';
import { cartService } from '@/services';

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
}

interface Cart {
  id: number;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cartService.getCart();
      setCart(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: number, quantity: number) => {
    try {
      setError(null);
      const updatedCart = await cartService.addToCart({ productId, quantity });
      setCart(updatedCart);
      return updatedCart;
    } catch (err: any) {
      setError(err.message || 'Failed to add to cart');
      throw err;
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    try {
      setError(null);
      await cartService.removeFromCart(cartItemId);
      await fetchCart();
    } catch (err: any) {
      setError(err.message || 'Failed to remove from cart');
      throw err;
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    try {
      setError(null);
      const updatedCart = await cartService.updateQuantity(cartItemId, quantity);
      setCart(updatedCart);
      return updatedCart;
    } catch (err: any) {
      setError(err.message || 'Failed to update quantity');
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      await cartService.clearCart();
      setCart(null);
    } catch (err: any) {
      setError(err.message || 'Failed to clear cart');
      throw err;
    }
  };

  const applyCoupon = async (couponCode: string) => {
    try {
      setError(null);
      const updatedCart = await cartService.applyCoupon(couponCode);
      setCart(updatedCart);
      return updatedCart;
    } catch (err: any) {
      setError(err.message || 'Failed to apply coupon');
      throw err;
    }
  };

  const removeCoupon = async (couponCode: string) => {
    try {
      setError(null);
      await cartService.removeCoupon(couponCode);
      await fetchCart();
    } catch (err: any) {
      setError(err.message || 'Failed to remove coupon');
      throw err;
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return {
    cart,
    loading,
    error,
    fetchCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    cartTotal: cart?.totalPrice || 0,
    itemCount: cart?.totalItems || 0,
  };
}
