/**
 * Cart Service
 * Handles all shopping cart related API calls
 */

import apiService from './api.service';
import API_CONFIG from '@/config/api.config';

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
  vendorId: number;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  updatedAt: string;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

class CartService {
  // Get Cart
  async getCart() {
    return apiService.get<Cart>(API_CONFIG.ENDPOINTS.CART.GET_CART);
  }

  async getCartItems() {
    return apiService.get(API_CONFIG.ENDPOINTS.CART.GET_CART_ITEMS);
  }

  // Add to Cart
  async addToCart(data: AddToCartRequest) {
    return apiService.post<Cart>(API_CONFIG.ENDPOINTS.CART.ADD_TO_CART, data);
  }

  async addMultipleToCart(items: AddToCartRequest[]) {
    return apiService.post<Cart>(API_CONFIG.ENDPOINTS.CART.ADD_MULTIPLE_TO_CART, items);
  }

  // Update Cart Item
  async updateCartItem(cartItemId: number, data: UpdateCartItemRequest) {
    return apiService.put<Cart>(API_CONFIG.ENDPOINTS.CART.UPDATE_CART_ITEM(cartItemId), data);
  }

  async updateQuantity(cartItemId: number, quantity: number) {
    return apiService.patch<Cart>(
      API_CONFIG.ENDPOINTS.CART.UPDATE_QUANTITY(cartItemId),
      null,
      {
        params: { quantity },
      }
    );
  }

  // Remove from Cart
  async removeFromCart(cartItemId: number) {
    return apiService.delete(API_CONFIG.ENDPOINTS.CART.REMOVE_FROM_CART(cartItemId));
  }

  async removeMultipleFromCart(cartItemIds: number[]) {
    return apiService.post(API_CONFIG.ENDPOINTS.CART.REMOVE_MULTIPLE_FROM_CART, {
      cartItemIds,
    });
  }

  // Clear Cart
  async clearCart() {
    return apiService.post(API_CONFIG.ENDPOINTS.CART.CLEAR_CART, {});
  }

  // Cart Operations
  async getCartCount() {
    return apiService.get(API_CONFIG.ENDPOINTS.CART.GET_CART_COUNT);
  }

  async getCartTotal() {
    return apiService.get(API_CONFIG.ENDPOINTS.CART.GET_CART_TOTAL);
  }

  async applyCoupon(couponCode: string) {
    return apiService.post<Cart>(API_CONFIG.ENDPOINTS.CART.APPLY_COUPON, {
      couponCode,
    });
  }

  async removeCoupon(couponCode: string) {
    return apiService.post(API_CONFIG.ENDPOINTS.CART.REMOVE_COUPON, { couponCode });
  }

  async validateCart() {
    return apiService.post(API_CONFIG.ENDPOINTS.CART.VALIDATE_CART, {});
  }

  async saveForLater(cartItemId: number) {
    return apiService.post(API_CONFIG.ENDPOINTS.CART.SAVE_FOR_LATER(cartItemId), {});
  }

  async getSavedItems() {
    return apiService.get(API_CONFIG.ENDPOINTS.CART.GET_SAVED_ITEMS);
  }

  async moveToCart(savedItemId: number) {
    return apiService.post(API_CONFIG.ENDPOINTS.CART.MOVE_TO_CART(savedItemId), {});
  }

  async removeSavedItem(savedItemId: number) {
    return apiService.delete(API_CONFIG.ENDPOINTS.CART.REMOVE_SAVED_ITEM(savedItemId));
  }

  // Cart Summary
  async getCartSummary() {
    return apiService.get(API_CONFIG.ENDPOINTS.CART.GET_CART_SUMMARY);
  }

  async calculateTax() {
    return apiService.post(API_CONFIG.ENDPOINTS.CART.CALCULATE_TAX, {});
  }

  async calculateShipping(zipCode: string) {
    return apiService.post(API_CONFIG.ENDPOINTS.CART.CALCULATE_SHIPPING, {
      zipCode,
    });
  }

  // Checkout
  async proceedToCheckout() {
    return apiService.post(API_CONFIG.ENDPOINTS.CART.PROCEED_TO_CHECKOUT, {});
  }

  async validateBeforeCheckout() {
    return apiService.post(API_CONFIG.ENDPOINTS.CART.VALIDATE_BEFORE_CHECKOUT, {});
  }
}

export default new CartService();
