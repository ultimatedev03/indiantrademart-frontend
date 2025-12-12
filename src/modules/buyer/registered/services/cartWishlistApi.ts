import { api } from '@/shared/services/api';
import { API } from '@/shared/config/api-endpoints';

export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrls?: string;
    vendor: {
      id: number;
      companyName: string;
    };
  };
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  id: number;
  userId: number;
  productId: number;
  createdAt: string;
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrls?: string;
    vendor: {
      id: number;
      companyName: string;
    };
  };
}

export interface AddToCartDto {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

// Cart & Wishlist API functions
export const cartWishlistAPI = {
  // Cart Management
  cart: {
    // Get user cart
    get: async (): Promise<Cart> => {
      const response = await api.get(API.buyer.registered.cart.list);
      return response.data;
    },

    // Add item to cart
    addItem: async (data: AddToCartDto): Promise<CartItem> => {
      const response = await api.post(API.buyer.registered.cart.add, data);
      return response.data;
    },

    // Update cart item quantity
    updateItem: async (cartItemId: number, data: UpdateCartItemDto): Promise<CartItem> => {
      const response = await api.put(API.buyer.registered.cart.update(cartItemId), data);
      return response.data;
    },

    // Remove item from cart
    removeItem: async (cartItemId: number): Promise<void> => {
      await api.delete(API.buyer.registered.cart.remove(cartItemId));
    },

    // Clear entire cart
    clear: async (): Promise<void> => {
      await api.delete(API.buyer.registered.cart.clear);
    },

    // Get cart item count
    getCount: async (): Promise<number> => {
      const response = await api.get(API.buyer.registered.cart.count);
      return response.data;
    }
  },

  // Wishlist Management
  wishlist: {
    // Get user wishlist
    get: async (): Promise<WishlistItem[]> => {
      const response = await api.get(API.buyer.registered.wishlist.list);
      return response.data;
    },

    // Add product to wishlist
    addItem: async (productId: number): Promise<WishlistItem> => {
      const response = await api.post(API.buyer.registered.wishlist.add(productId));
      return response.data;
    },

    // Remove product from wishlist
    removeItem: async (productId: number): Promise<void> => {
      await api.delete(API.buyer.registered.wishlist.remove(productId));
    },

    // Check if product is in wishlist
    isInWishlist: async (productId: number): Promise<boolean> => {
      try {
        const response = await api.get(API.buyer.registered.wishlist.check(productId));
        return response.data;
      } catch (error) {
        return false;
      }
    },

    // Get wishlist count
    getCount: async (): Promise<number> => {
      const response = await api.get(API.buyer.registered.wishlist.count);
      return response.data;
    },

    // Move item from wishlist to cart
    moveToCart: async (productId: number, quantity: number = 1): Promise<CartItem> => {
      const response = await api.post(API.buyer.registered.wishlist.moveToCart(productId), { quantity });
      return response.data;
    }
  }
};