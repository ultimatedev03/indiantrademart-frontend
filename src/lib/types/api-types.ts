// =============================================================================
// API Types - Complete Type Definitions for 777+ Endpoints
// =============================================================================

// =========================================================================
// AUTHENTICATION TYPES
// =========================================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  user: User;
  expiresIn: number;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  userType?: 'BUYER' | 'VENDOR' | 'ADMIN';
}

export interface VendorRegisterRequest extends RegisterRequest {
  companyName: string;
  businessType: string;
  gstNumber?: string;
  panNumber?: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// =========================================================================
// USER & PROFILE TYPES
// =========================================================================

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  role: UserRole;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'BUYER' | 'VENDOR' | 'ADMIN' | 'SUPPORT' | 'CTO' | 'DATA_ENTRY';

export interface UserProfile extends User {
  address?: Address;
  company?: Company;
  preferences?: UserPreferences;
  documents?: KycDocument[];
}

export interface UserPreferences {
  language: string;
  currency: string;
  notifications: NotificationPreferences;
  theme: 'LIGHT' | 'DARK';
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  orderUpdates: boolean;
  promotions: boolean;
}

// =========================================================================
// ADDRESS TYPES
// =========================================================================

export interface Address {
  id: string;
  userId: string;
  type: 'BILLING' | 'SHIPPING' | 'OFFICE';
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  isDefault: boolean;
  createdAt: string;
}

// =========================================================================
// BUYER TYPES
// =========================================================================

export interface Buyer extends User {
  companyId?: string;
  industry?: string;
  annualBudget?: number;
  isPremium: boolean;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  kycDocuments?: KycDocument[];
}

export interface BuyerProfile extends Buyer {
  totalOrders: number;
  totalSpend: number;
  averageOrderValue: number;
  lastOrderDate?: string;
  favoriteCategories: string[];
}

export interface KycDocument {
  id: string;
  userId: string;
  documentType: 'AADHAR' | 'PAN' | 'PASSPORT' | 'DRIVING_LICENSE';
  documentUrl: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  createdAt: string;
  verifiedAt?: string;
}

// =========================================================================
// VENDOR TYPES
// =========================================================================

export interface Vendor extends User {
  companyId: string;
  businessType: string;
  category: string;
  rating: number;
  totalReviews: number;
  totalOrders: number;
  totalProducts: number;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  isPremium: boolean;
  subscriptionTier?: 'BASIC' | 'PROFESSIONAL' | 'ENTERPRISE';
  serviceAreas: string[];
  certifications?: string[];
}

export interface VendorProfile extends Vendor {
  bankDetails?: BankDetails;
  businessInfo?: BusinessInfo;
  contactPerson?: ContactPerson;
  paymentMethods: PaymentMethod[];
}

export interface BusinessInfo {
  gstNumber: string;
  panNumber: string;
  businessRegistration: string;
  businessRegistrationDate: string;
  employeeCount: number;
  annualTurnover: number;
  businessDescription: string;
  website?: string;
}

export interface ContactPerson {
  name: string;
  designation: string;
  email: string;
  phone: string;
}

export interface BankDetails {
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  accountType: 'SAVINGS' | 'CURRENT';
}

export interface PaymentMethod {
  id: string;
  type: 'BANK_TRANSFER' | 'CHEQUE' | 'UPI' | 'WALLET';
  isActive: boolean;
  details: any;
}

// =========================================================================
// COMPANY TYPES
// =========================================================================

export interface Company {
  id: string;
  name: string;
  registrationNumber: string;
  gstNumber: string;
  panNumber: string;
  website?: string;
  email: string;
  phone: string;
  address: Address;
  industry: string;
  employeeCount: number;
  annualTurnover: number;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  subscriptionStatus: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  logo?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

// =========================================================================
// PRODUCT TYPES
// =========================================================================

export interface Product {
  id: string;
  vendorId: string;
  categoryId: string;
  subCategoryId?: string;
  microCategoryId?: string;
  name: string;
  description: string;
  sku: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  quantity: number;
  unit: string;
  images: ProductImage[];
  specifications?: Record<string, string>;
  rating: number;
  totalReviews: number;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'ARCHIVED';
  isFeatured: boolean;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface ProductDetailed extends Product {
  vendor: Vendor;
  reviews: Review[];
  relatedProducts: Product[];
  videos?: ProductVideo[];
}

export interface ProductVideo {
  id: string;
  productId: string;
  title: string;
  url: string;
  type: 'YOUTUBE' | 'VIMEO' | 'UPLOADED';
  isPrimary: boolean;
  views: number;
  createdAt: string;
}

export interface ProductSearchFilters {
  query?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  vendorId?: string;
  sortBy?: 'RELEVANCE' | 'PRICE_LOW' | 'PRICE_HIGH' | 'NEWEST' | 'RATING';
  page?: number;
  size?: number;
}

// =========================================================================
// CATEGORY TYPES
// =========================================================================

export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  icon?: string;
  image?: string;
  displayOrder: number;
  isActive: boolean;
  parentId?: string;
  productCount: number;
  createdAt: string;
}

export interface CategoryHierarchy extends Category {
  subCategories?: SubCategory[];
}

export interface SubCategory extends Category {
  categoryId: string;
  microCategories?: MicroCategory[];
}

export interface MicroCategory extends Category {
  subCategoryId: string;
}

// =========================================================================
// CART & CHECKOUT TYPES
// =========================================================================

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  discount?: number;
  tax?: number;
  total: number;
  addedAt: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  lastUpdated: string;
}

export interface CheckoutRequest {
  items: {
    productId: string;
    quantity: number;
  }[];
  shippingAddressId: string;
  billingAddressId?: string;
  paymentMethodId: string;
  couponCode?: string;
  notes?: string;
}

export interface CheckoutResponse {
  orderId: string;
  orderNumber: string;
  paymentRequired: boolean;
  paymentUrl?: string;
  razorpayOrderId?: string;
  estimatedDelivery: string;
}

// =========================================================================
// ORDER TYPES
// =========================================================================

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  orderDate: string;
  estimatedDelivery: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'PROCESSING' 
  | 'SHIPPED' 
  | 'DELIVERED' 
  | 'CANCELLED' 
  | 'REFUNDED';

export type PaymentStatus = 
  | 'PENDING' 
  | 'COMPLETED' 
  | 'FAILED' 
  | 'REFUNDED' 
  | 'PARTIAL';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  vendorId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
  status: OrderStatus;
}

// =========================================================================
// REVIEW & RATING TYPES
// =========================================================================

export interface Review {
  id: string;
  productId?: string;
  vendorId?: string;
  buyerId: string;
  buyer: User;
  rating: number;
  title: string;
  comment: string;
  photos?: string[];
  verified: boolean;
  helpful: number;
  createdAt: string;
}

// =========================================================================
// INQUIRY & QUOTE TYPES
// =========================================================================

export interface Inquiry {
  id: string;
  productId?: string;
  categoryId?: string;
  buyerId: string;
  vendorId?: string;
  title: string;
  description: string;
  quantity: number;
  budget: number;
  deadline?: string;
  attachments?: string[];
  status: 'OPEN' | 'IN_PROGRESS' | 'QUOTED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  responses?: InquiryResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface InquiryResponse {
  id: string;
  inquiryId: string;
  vendorId: string;
  vendor: Vendor;
  quotedPrice: number;
  deliveryTime: string;
  message: string;
  attachments?: string[];
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

// =========================================================================
// PAYMENT TYPES
// =========================================================================

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  razorpayPaymentId?: string;
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
}

export interface PaymentInitiateRequest {
  orderId: string;
  amount: number;
  currency?: string;
  method: 'RAZORPAY' | 'BANK_TRANSFER' | 'WALLET';
}

export interface PaymentVerifyRequest {
  orderId: string;
  paymentId: string;
  signature?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  features: SubscriptionFeature[];
  maxProducts?: number;
  maxListings?: number;
  commissionRate: number;
  isActive: boolean;
  createdAt: string;
}

export interface SubscriptionFeature {
  name: string;
  description: string;
  isIncluded: boolean;
}

// =========================================================================
// WISHLIST TYPES
// =========================================================================

export interface Wishlist {
  id: string;
  userId: string;
  products: Product[];
  createdAt: string;
  updatedAt: string;
}

// =========================================================================
// SUPPORT TYPES
// =========================================================================

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  subject: string;
  description: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  attachments?: string[];
  messages: ChatMessage[];
  assignedTo?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  sender: User;
  message: string;
  attachments?: string[];
  readAt?: string;
  createdAt: string;
}

// =========================================================================
// ANALYTICS TYPES
// =========================================================================

export interface Dashboard {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts?: number;
  orderTrend: TrendData[];
  revenueTrend: TrendData[];
  topProducts: Product[];
  recentOrders: Order[];
}

export interface TrendData {
  date: string;
  value: number;
}

export interface VendorAnalytics {
  dashboard: Dashboard;
  productPerformance: ProductMetrics[];
  orderAnalytics: OrderAnalytics;
  customerAnalytics: CustomerAnalytics;
}

export interface ProductMetrics {
  productId: string;
  productName: string;
  views: number;
  sales: number;
  revenue: number;
  conversionRate: number;
  rating: number;
}

export interface OrderAnalytics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  orderTrend: TrendData[];
  orderStatusDistribution: Record<OrderStatus, number>;
}

export interface CustomerAnalytics {
  totalCustomers: number;
  newCustomers: number;
  repeatCustomers: number;
  customerRetentionRate: number;
  topCustomers: Buyer[];
}

// =========================================================================
// PAGINATION TYPES
// =========================================================================

export interface PaginationParams {
  page: number;
  size: number;
  sort?: string;
  direction?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  hasNext: boolean;
  hasPrevious: boolean;
  isFirst: boolean;
  isLast: boolean;
}

// =========================================================================
// ERROR TYPES
// =========================================================================

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string>;
  timestamp: string;
  path?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  rejectedValue?: any;
}

// =========================================================================
// RESPONSE WRAPPER TYPES
// =========================================================================

export interface ApiResponse<T> {
  status: number;
  data?: T;
  message: string;
  errors?: Record<string, any>;
  timestamp: number;
}

export interface ApiListResponse<T> extends ApiResponse<T[]> {
  pagination: {
    total: number;
    pages: number;
    currentPage: number;
    pageSize: number;
  };
}

// =========================================================================
// FILTER & SEARCH TYPES
// =========================================================================

export interface SearchFilters {
  query?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  filters?: Record<string, any>;
}

export interface VendorSearchFilters extends SearchFilters {
  category?: string;
  city?: string;
  state?: string;
  rating?: number;
  isPremium?: boolean;
}

export interface BuyerSearchFilters extends SearchFilters {
  status?: string;
  verificationStatus?: string;
  industry?: string;
}

// =========================================================================
// NOTIFICATION TYPES
// =========================================================================

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'ORDER' | 'PAYMENT' | 'PRODUCT' | 'SYSTEM' | 'MESSAGE';
  data?: Record<string, any>;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

