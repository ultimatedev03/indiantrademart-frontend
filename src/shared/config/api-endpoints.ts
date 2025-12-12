/**
 * Centralized API Endpoints Registry
 * 
 * Single source of truth for all API endpoints across the application.
 * Organized by module and feature for easy maintenance and updates.
 * 
 * Usage:
 * import { API } from '@/shared/config/api-endpoints';
 * api.get(API.vendor.products.list)
 * api.post(API.buyer.cart.add, data)
 */

export const API = {
  // ==========================================
  // CORE / HEALTH CHECK
  // ==========================================
  core: {
    health: '/health',
    apiHealth: '/api/health',
    actuatorHealth: '/actuator/health',
  },

  // ==========================================
  // AUTHENTICATION & USERS
  // ==========================================
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    profile: '/auth/profile',
    forgotPassword: '/api/auth/forgot-password',
    verifyForgotPasswordOtp: '/api/auth/verify-forgot-password-otp',
    setPassword: '/api/auth/set-password',
    verifyOtp: '/api/auth/verify-otp',
    verifyEmailOtp: '/api/auth/verify-email-otp',
    resendEmailOtp: '/api/auth/resend-email-otp',
    checkEmailRole: '/api/auth/check-email-role',
    
    admin: {
      login: '/auth/admin/login',
      register: '/auth/admin/register',
    },
    
    vendor: {
      login: '/api/auth/vendor/login',
      register: '/api/auth/vendor/register',
    },
    
    buyer: {
      login: '/api/auth/buyer/login',
      register: '/api/auth/buyer/register',
    },
    
    employee: {
      login: '/auth/employee/login',
      register: '/auth/employee/register',
    },
  },

  users: {
    profile: '/api/users/profile',
  },

  // ==========================================
  // PUBLIC LOCATIONS & UTILITIES
  // ==========================================
  public: {
    locations: {
      states: '/api/public/locations/states',
      citiesByState: (stateId: number | string) => `/api/public/locations/states/${stateId}/cities`,
      citiesByStateName: (stateName: string) => `/api/public/locations/cities?state=${stateName}`,
    },
  },

  // ==========================================
  // BUYER MODULE
  // ==========================================
  buyer: {
    registered: {
      cart: {
        list: '/api/cart',
        add: '/api/cart/add',
        update: (cartItemId: string | number) => `/api/cart/item/${cartItemId}`,
        remove: (cartItemId: string | number) => `/api/cart/item/${cartItemId}`,
        clear: '/api/cart/clear',
        count: '/api/cart/count',
      },
      wishlist: {
        list: '/api/wishlist/my-wishlist',
        add: (productId: string | number) => `/api/wishlist/add/${productId}`,
        remove: (productId: string | number) => `/api/wishlist/remove/${productId}`,
        check: (productId: string | number) => `/api/wishlist/check/${productId}`,
        count: '/api/wishlist/count',
        moveToCart: (productId: string | number) => `/api/wishlist/move-to-cart/${productId}`,
      },
    },
    lead: {
      // Popup form submissions for lead-only users
      createLead: '/api/leads/create', // TBD: confirm with backend
    },
  },

  // ==========================================
  // VENDOR MODULE
  // ==========================================
  vendor: {
    ranking: (vendorId: string | number) => `/vendor/${vendorId}/ranking`,
    
    products: {
      list: (vendorId?: string | number) => vendorId ? `/api/products/vendor/${vendorId}` : '/api/products',
      create: '/api/v1/vendor/products',
      uploadImages: (vendorId: string | number, productId: string | number) => `/vendor/${vendorId}/products/${productId}/upload-images`,
    },
    
    tax: {
      gstRates: '/vendor/gst-rates',
      gstValidate: (vendorId: string | number, gstNumber: string) => `/vendor/${vendorId}/gst/${gstNumber}/validate`,
      gstVerify: (vendorId: string | number, gstNumber: string) => `/vendor/${vendorId}/gst/${gstNumber}/verify`,
      gstDetails: (vendorId: string | number, gstNumber: string) => `/vendor/${vendorId}/gst/${gstNumber}/details`,
      gstSelections: (vendorId: string | number, gstNumber: string) => `/vendor/${vendorId}/gst/${gstNumber}/selections`,
      gstSelectedRates: (vendorId: string | number, gstNumber: string) => `/vendor/${vendorId}/gst/${gstNumber}/selected-rates`,
      
      panValidate: (vendorId: string | number, panNumber: string) => `/vendor/${vendorId}/pan/${panNumber}/validate`,
      panVerify: (vendorId: string | number, panNumber: string) => `/vendor/${vendorId}/pan/${panNumber}/verify`,
      panDetails: (vendorId: string | number, panNumber: string) => `/vendor/${vendorId}/pan/${panNumber}/details`,
      panSelections: (vendorId: string | number, panNumber: string) => `/vendor/${vendorId}/tds/${panNumber}/selections`,
      panSelectedRates: (vendorId: string | number, panNumber: string) => `/vendor/${vendorId}/tds/${panNumber}/selected-rates`,
      
      selections: (vendorId: string | number) => `/vendor/${vendorId}/tax-selections`,
      dashboard: (vendorId: string | number) => `/vendor/${vendorId}/tax-dashboard`,
    },
    
    kyc: {
      submitDocuments: '/api/v1/vendor-kyc/documents',
    },
    
    excel: {
      template: '/api/excel/template',
      import: (vendorId: string | number) => `/api/excel/import/${vendorId}`,
      dashboardImportTemplate: (vendorId: string | number) => `/vendor/vendors/${vendorId}/dashboard/import-template`,
      dashboardDownloadTemplate: (vendorId: string | number) => `/vendor/vendors/${vendorId}/dashboard/download-template`,
    },
  },

  // ==========================================
  // MANAGEMENT MODULE (Admin, CTO, HR)
  // ==========================================
  management: {
    admin: {
      users: {
        list: '/api/users',
        count: '/api/users/count',
        countByRole: (role: string) => `/api/users/count/role/${role}`,
        getByRole: (role: string) => `/api/users/role/${role}`,
        getById: (id: string | number) => `/api/users/${id}`,
        update: (id: string | number) => `/api/users/${id}`,
        delete: (id: string | number) => `/api/users/${id}`,
        verified: '/api/users/verified',
        unverified: '/api/users/unverified',
        active: '/api/users/active',
        inactive: '/api/users/inactive',
      },
      vendors: {
        list: '/admin/vendors',
        updateType: (userId: string | number) => `/admin/vendor/${userId}/type`,
      },
      products: {
        list: '/api/products',
        getById: (id: string | number) => `/api/products/${id}`,
        featured: '/api/products/featured',
        bulkImport: '/admin/products/bulk-import',
        countTotal: '/api/products/count',
      },
      orders: {
        countTotal: '/api/orders/count',
        getById: (id: string | number) => `/api/orders/${id}`,
        updateStatus: (orderId: string | number) => `/api/orders/${orderId}/status`,
      },
      support: {
        tickets: '/api/support/tickets/admin',
        updateTicketStatus: (ticketId: string | number) => `/api/support/tickets/${ticketId}/status`,
        chatSessions: '/api/support/chat/sessions',
      },
    },
    
    cto: {
      dashboard: {
        metrics: '/api/cto-dashboard/metrics',
        performance: '/api/cto-dashboard/performance',
        health: '/api/cto-dashboard/health',
        security: '/api/cto-dashboard/security',
        infrastructure: '/api/cto-dashboard/infrastructure',
      },
    },
    
    hr: {
      // HR role endpoints (add as needed)
    },
  },

  // ==========================================
  // EMPLOYEE MODULE (DataEntry, Support, Finance)
  // ==========================================
  employee: {
    dataEntry: {
      analytics: {
        dashboard: '/api/dataentry/analytics/dashboard',
        categoryStats: '/api/dataentry/analytics/category-stats',
      },
      categories: {
        list: '/api/dataentry/categories',
        hierarchy: '/api/dataentry/hierarchy/full',
        getById: (id: string | number) => `/api/dataentry/categories/${id}`,
        create: '/api/dataentry/categories',
        update: (id: string | number) => `/api/dataentry/categories/${id}`,
        delete: (id: string | number) => `/api/dataentry/categories/${id}`,
      },
      subcategories: {
        list: (parentId: string | number) => `/api/dataentry/categories/${parentId}/subcategories`,
        create: '/api/dataentry/subcategories',
        update: (id: string | number) => `/api/dataentry/subcategories/${id}`,
        delete: (id: string | number) => `/api/dataentry/subcategories/${id}`,
      },
      microcategories: {
        list: (parentId: string | number) => `/api/dataentry/subcategories/${parentId}/microcategories`,
        create: '/api/dataentry/microcategories',
        update: (id: string | number) => `/api/dataentry/microcategories/${id}`,
        delete: (id: string | number) => `/api/dataentry/microcategories/${id}`,
      },
      products: {
        // Product data entry endpoints (add as needed)
      },
    },
    
    support: {
      tickets: {
        list: '/api/support/tickets',
        create: '/api/support/tickets',
        getById: (ticketId: string | number) => `/api/support/tickets/${ticketId}`,
        updateStatus: (ticketId: string | number) => `/api/support/tickets/${ticketId}/status`,
        addMessage: (ticketId: string | number) => `/api/support/tickets/${ticketId}/messages`,
        getMessages: (ticketId: string | number) => `/api/support/tickets/${ticketId}/messages`,
        stats: '/api/support/tickets/stats',
      },
      chat: {
        start: '/api/support/chat/start',
        sendMessage: (sessionId: string | number) => `/api/support/chat/${sessionId}/message`,
        getMessages: (sessionId: string | number) => `/api/support/chat/${sessionId}/messages`,
        endSession: (sessionId: string | number) => `/api/support/chat/${sessionId}/end`,
      },
    },
    
    finance: {
      // Finance endpoints (payouts, invoices, etc.) - add as needed
    },
  },

  // ==========================================
  // ANALYTICS MODULE
  // ==========================================
  analytics: {
    dashboard: '/api/analytics/dashboard',
    vendorAnalytics: (vendorId: string | number) => `/api/analytics/vendor/${vendorId}`,
    systemMetrics: '/api/analytics/system-metrics',
    
    vendor: {
      overview: '/api/vendor-analytics/overview',
      products: '/api/vendor-analytics/products',
      sales: '/api/vendor-analytics/sales',
    },
    
    admin: {
      overview: '/api/admin-analytics/overview',
      users: '/api/admin-analytics/users',
      vendors: '/api/admin-analytics/vendors',
      products: '/api/admin-analytics/products',
    },
  },

  // ==========================================
  // DIRECTORY MODULE
  // ==========================================
  directory: {
    search: '/api/directory/search',
    providers: {
      list: '/api/directory/providers',
      getById: (id: string | number) => `/api/directory/providers/${id}`,
      featured: '/api/directory/featured',
      topRated: '/api/directory/top-rated',
      byCity: (city: string) => `/api/directory/city/${city}`,
    },
    categories: '/api/directory/categories',
    locations: '/api/directory/locations',
    stats: '/api/directory/stats',
    suggestions: '/api/directory/suggestions',
    popularSearches: '/api/directory/popular-searches',
    quoteRequest: '/api/directory/quote-request',
    contactSupplier: '/api/directory/contact-supplier',
  },
};
