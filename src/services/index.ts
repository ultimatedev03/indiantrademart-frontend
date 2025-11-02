/**
 * Services Index
 * Centralized export point for all API services
 * Import any service from: import { authService, productService } from '@/services'
 */

export { default as apiService } from './api.service';
export { default as authService } from './auth.service';
export { default as productService } from './product.service';
export { default as vendorService } from './vendor.service';
export { default as orderService } from './order.service';
export { default as cartService } from './cart.service';
export { default as paymentService } from './payment.service';
export { default as reviewService } from './review.service';
export { default as notificationService } from './notification.service';
export { default as searchService } from './search.service';
export { default as categoryService } from './category.service';
export { default as couponService } from './coupon.service';

// Commented out - endpoints not in API_CONFIG yet
// export { default as analyticsService } from './analytics.service';
// export { default as categoryService } from './category.service';
// export { default as couponService } from './coupon.service';
// export { default as wishlistService } from './wishlist.service';
// export { default as addressService } from './address.service';

// Export all types and interfaces
export type { User, LoginResponse, LoginRequest } from './auth.service';
export type { Cart, CartItem } from './cart.service';
export type { Product } from './product.service';
export type { Order, OrderItem } from './order.service';
export type { Notification } from './notification.service';
export type { Category } from './category.service';
export type { Coupon } from './coupon.service';
