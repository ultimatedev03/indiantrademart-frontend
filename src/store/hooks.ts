import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Export pre-typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Auth selectors
export const useAuth = () => {
  return useAppSelector((state) => state.auth);
};

export const useIsAuthenticated = () => {
  return useAppSelector((state) => state.auth.isAuthenticated);
};

export const useAuthUser = () => {
  return useAppSelector((state) => state.auth.user);
};

export const useAuthLoading = () => {
  return useAppSelector((state) => state.auth.loading);
};

export const useAuthError = () => {
  return useAppSelector((state) => state.auth.error);
};

// Product selectors
export const useProducts = () => {
  return useAppSelector((state) => state.products);
};

export const useProductsList = () => {
  return useAppSelector((state) => state.products.items);
};

export const useCurrentProduct = () => {
  return useAppSelector((state) => state.products.currentProduct);
};

export const useProductsLoading = () => {
  return useAppSelector((state) => state.products.loading);
};

export const useProductsError = () => {
  return useAppSelector((state) => state.products.error);
};

// Cart selectors
export const useCart = () => {
  return useAppSelector((state) => state.cart);
};

export const useCartData = () => {
  return useAppSelector((state) => state.cart.data);
};

export const useCartTotal = () => {
  return useAppSelector((state) => state.cart.data?.totalPrice || 0);
};

export const useCartItemsCount = () => {
  return useAppSelector((state) => state.cart.data?.totalItems || 0);
};

export const useCartLoading = () => {
  return useAppSelector((state) => state.cart.loading);
};

export const useCartError = () => {
  return useAppSelector((state) => state.cart.error);
};

// Order selectors
export const useOrders = () => {
  return useAppSelector((state) => state.orders);
};

export const useOrdersList = () => {
  return useAppSelector((state) => state.orders.orders);
};

export const useCurrentOrder = () => {
  return useAppSelector((state) => state.orders.currentOrder);
};

export const useOrdersLoading = () => {
  return useAppSelector((state) => state.orders.loading);
};

export const useOrdersError = () => {
  return useAppSelector((state) => state.orders.error);
};

// Notification selectors
export const useNotifications = () => {
  return useAppSelector((state) => state.notifications);
};

export const useNotificationsList = () => {
  return useAppSelector((state) => state.notifications.notifications);
};

export const useUnreadNotificationsCount = () => {
  return useAppSelector((state) => state.notifications.unreadCount);
};

export const useNotificationsLoading = () => {
  return useAppSelector((state) => state.notifications.loading);
};

export const useNotificationsError = () => {
  return useAppSelector((state) => state.notifications.error);
};
