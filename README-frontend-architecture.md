# Indian Trade Mart - Frontend Architecture Guide

**Last Updated:** December 2025  
**Framework:** Next.js 15.5.2 (App Router) + TypeScript + React 19  
**State Management:** Redux Toolkit  
**Styling:** Tailwind CSS  

---

## Table of Contents

1. [High-Level Overview](#1-high-level-overview)
2. [Folder & Module Map](#2-folder--module-map)
3. [Shared & Core Layers](#3-shared--core-layers)
4. [Routing & Subdomains](#4-routing--subdomains)
5. [SEO & Directory System](#5-seo--directory-system)
6. [Lead System](#6-lead-system)
7. [Auth & Dashboard](#7-auth--dashboard)
8. [State Management & API Client](#8-state-management--api-client)
9. [How to Add / Extend Features](#9-how-to-add--extend-features)

---

## 1. High-Level Overview

### What This Frontend Does

**Indian Trade Mart** is a B2B marketplace connecting businesses with service providers and product vendors across India. The frontend serves multiple user types:

- **Buyers/Registered Users:** Browse products, manage cart, wishlist, contact suppliers, create leads
- **Vendors:** Manage product listings, orders, leads, KYC documentation
- **Management/Admin:** Oversee platform (admin, CTO, HR roles)
- **Employees:** Internal data entry, support tickets, finance operations
- **Unregistered Users:** Access public directory of service providers via lead popup

### Tech Stack Summary

| Component | Technology |
|-----------|-----------|
| **Framework** | Next.js 15.5.2 (App Router) |
| **Language** | TypeScript |
| **UI Library** | React 19 |
| **Styling** | Tailwind CSS 3.4 |
| **State Management** | Redux Toolkit 2.8.2 |
| **HTTP Client** | Axios 1.10.0 |
| **Icons** | Lucide React |
| **Internationalization** | i18next |
| **Charts** | Chart.js + React-ChartJS-2, Recharts |
| **UI Components** | Custom + shadcn-inspired (Button, Dialog, Input, etc.) |

### API Layer Pattern

- **Central API Client:** `src/shared/services/api.ts` (Axios instance with interceptors)
- **Endpoints Registry:** `src/shared/config/api-endpoints.ts` (single source of truth)
- **Feature Services:** Thin wrappers in each module (e.g., `src/modules/buyer/lead/services/leadService.ts`)

---

## 2. Folder & Module Map

### Root Structure

```
src/
├── app/                 # Next.js App Router pages & routes
├── modules/             # Feature modules (buyer, vendor, directory, etc.)
├── shared/              # Shared components, config, utilities
├── lib/                 # Library utilities, sitemap sources
├── store/               # Redux store configuration
├── services/            # Legacy services (some may be deprecated)
├── contexts/            # React Context providers
├── hooks/               # Global custom hooks
├── types/               # Global TypeScript types
├── utils/               # Utility functions
├── assets/              # Static images, fonts, etc.
├── styles/              # Global CSS
└── i18n/                # Internationalization config
```

### App Router (src/app/)

The application uses Next.js **App Router** with file-based routing. Major route groups:

#### Authentication Routes
```
/auth/
├── /auth/user/login               # Buyer/registered user login
├── /auth/user/register            # Buyer registration
├── /auth/vendor/login             # Vendor login
├── /auth/vendor/register          # Vendor registration
├── /auth/admin/login              # Admin login
├── /auth/employee/login           # Employee login
├── /auth/forgot-password          # Forgot password flow
└── /auth/hr/pending-approval      # HR approval status
```

#### Directory Routes (SEO-Optimized)
```
/directory/
├── /directory/[...seoParams]/page.tsx    # Catch-all for SEO URLs
│   Supports:
│   ├── /directory/service-slug
│   ├── /directory/service-slug-in-city-state
│   └── Internally rewrites to /directory/* via middleware
└── /                             # Root redirects to main site
```

#### Dashboard Routes (Role-Based)
```
/dashboard/
├── /dashboard/buyer               # Buyer dashboard
├── /dashboard/vendor-panel        # Vendor dashboard
├── /dashboard/admin               # Admin dashboard
├── /dashboard/admin/leads         # Lead management UI
├── /dashboard/cto                 # CTO dashboard
├── /dashboard/hr                  # HR dashboard
├── /dashboard/finance             # Finance module
├── /dashboard/support             # Support/HR support dashboard
└── /dashboard/employee            # Employee portal
```

#### Public Pages
```
/                                  # Homepage
/about-us
/contact-us
/categories                        # Browse categories
/cities                            # Browse cities
/products                          # Product listings
/search                            # Search results
/browse-vendors/city/[city]        # Browse vendors by location
/browse-vendors/city/[city]/category/[category]
/profile                           # User profile
/cart                              # Shopping cart
/orders                            # My orders
/help, /privacy-policy, /terms-of-use
```

#### API Routes
```
/api/
├── /api/categories
├── /api/health
├── /api/locations
└── /api/test-email
```

---

### Modules Structure (src/modules/)

#### **auth/** — Authentication & Core Auth Logic

Located at: `src/modules/auth/` and `src/modules/core/`

**Purpose:** Handles user authentication flows (login, register, OTP, password reset).

**Key Files:**
- `src/modules/core/services/authService.ts` — Main auth service with login, register, logout, OTP verification
- `src/modules/core/components/AuthGuard.tsx` — Route protection wrapper
- `src/modules/core/contexts/AuthContext.tsx` — Auth state (if using Context alongside Redux)

**Responsibility:**
- Login/register for all user types (buyer, vendor, admin, employee)
- Token management (JWT stored in localStorage)
- OTP verification for password-less login
- Role-based redirects

---

#### **buyer/** — Buyer-Facing Features

Located at: `src/modules/buyer/`

**Purpose:** Everything related to registered buyers and lead-generation for unregistered users.

**Submodules:**

**1. buyer/registered/** — Authenticated Buyer Features
```
buyer/registered/
├── components/
│   ├── UserDashboard.tsx
│   ├── BuyerProfile.tsx
│   └── OrderHistory.tsx
└── services/
    ├── buyerApi.ts
    └── wishlistService.ts
```
- Cart management
- Wishlist
- Order history
- User profile & settings

**2. buyer/lead/** — Lead Capture System ⭐ (Important)
```
buyer/lead/
├── components/
│   ├── LeadCaptureForm.tsx         # Form with email, phone, quantity, service
│   ├── LeadPopupContainer.tsx       # Modal wrapper
│   └── index.ts                     # Barrel export
├── hooks/
│   └── useLeadPopup.ts             # State management (open/close, auto-open logic)
├── services/
│   └── leadService.ts              # API calls to submit leads
└── types/
    └── index.ts
```
- Popup form for unregistered users on directory & product pages
- Auto-opens after 2 minutes (configurable)
- Session-based suppression (sessionStorage keys)
- Fields captured: email, phone, quantity, serviceName
- Integrated at: DirectoryPage, ProductDetails, browse-vendors pages

**3. buyer/shared/** — Shared Buyer Utilities
- Common types, constants, helpers

---

#### **vendor/** — Vendor Portal

Located at: `src/modules/vendor/`

**Purpose:** Vendor/supplier side of the marketplace.

**Key Components:**
- `VendorProfile.tsx` — KYC, business details
- `VendorProducts.tsx` — Product listing management
- `VendorOrders.tsx` — Order management
- `VendorLeads.tsx` — Incoming leads from buyers
- `VendorStatsPanel.tsx` — Dashboard stats (products, orders, revenue)

**Key Services:**
- `vendorApi.ts` — Vendor-specific API calls
- Uses cache manager for stats caching (5-minute TTL)

---

#### **directory/** — Service Provider Directory (SEO-Critical)

Located at: `src/modules/directory/`

**Purpose:** SEO-optimized directory of service providers with search and filtering.

**Key Files:**

```
directory/
├── components/
│   ├── DirectoryPage.tsx              # Main page (accepts SEO props)
│   ├── EnhancedDirectorySearch.tsx    # Structured search (service, city, state)
│   ├── ServiceProviderList.tsx        # Results display with pagination
│   ├── DirectoryBreadcrumb.tsx        # Breadcrumb navigation
│   └── LocalSellers.tsx               # Featured vendors sidebar
├── services/
│   ├── directoryApi.ts                # API service with 12+ methods
│   └── mockDirectoryApi.ts            # Mock fallback data
├── types/
│   └── directory.ts                   # ServiceProvider, DirectorySearchFilters, etc.
└── utils/
    └── seoSlug.ts                     # toSlug(), buildDirectorySeoPath()
```

**Behavior:**
- Accepts props: `initialServiceSlug`, `initialCitySlug`, `initialStateSlug`, `source='seo'`
- When `source='seo'`: Shows breadcrumb, converts slugs to human-readable text
- When `source='internal'`: Traditional query-based search
- Integrated with lead popup for unauthenticated users

**SEO URL Support:**
- Pattern 1: `/directory/land-surveyors`
- Pattern 2: `/directory/peb-building-design-consultant-in-visakhapatnam-andhra-pradesh`

---

#### **management/** — Admin & Management Portal

Located at: `src/modules/management/`

**Purpose:** Administrative functions, CTO metrics, HR approvals.

**Submodules:**

**1. management/admin/** — Admin Dashboard
```
admin/
├── components/
│   ├── LeadListPage.tsx             # Lead management UI
│   ├── LeadListTable.tsx            # Lead list with pagination
│   ├── LeadDetailPanel.tsx          # Lead details modal
│   └── [Other admin UIs]
└── services/
    └── leadApi.ts                   # Mock lead API
```
- Lead management (currently mock backend)
- User management
- Product admin
- Order admin

**2. management/cto/** — CTO Dashboard
- Platform metrics, performance, health, security, infrastructure

**3. management/hr/** — HR Management
- Employee approvals, complaints, support tickets

---

#### **employee/** — Internal Employee Operations

Located at: `src/modules/employee/`

**Purpose:** Internal staff workflows.

**Submodules:**

**1. employee/data-entry/** — Data Entry & Category Management
```
data-entry/
├── components/
│   ├── EmployeeFinanceManagement.tsx
│   ├── EmployeeSupportManagement.tsx
│   ├── DataManagementOverview.tsx
│   ├── CategoryManagement.tsx
│   ├── LocationManagement.tsx
│   └── VendorOnboarding.tsx
└── services/
    ├── categoryManagementApi.ts
    ├── locationManagementApi.ts
    └── employeeApi.ts
```

**2. employee/support/** — Support Ticket System
```
support/
├── components/
│   ├── SupportPage.tsx
│   ├── TicketManagement.tsx
│   ├── ChatWindow.tsx
│   ├── KnowledgeBasePanel.tsx
│   └── SupportAnalytics.tsx
└── services/
    ├── supportApi.ts
    └── chatApi.ts
```

**3. employee/finance/** — Finance Operations
- (Placeholder structure; services/components as needed)

---

#### **analytics/** — Platform Analytics

Located at: `src/modules/analytics/`

**Purpose:** Business intelligence, reporting, metrics.

- Sales analytics
- User behavior tracking
- Vendor performance metrics

---

#### **shared/** — Shared Module Assets

Located at: `src/modules/shared/`

**Purpose:** Cross-module types, utilities, constants.

```
shared/
├── types/
│   ├── api.ts                      # API response types (JwtResponse, ApiResponse, etc.)
│   ├── lead.ts                     # Lead-related types
│   └── [Other shared types]
└── [Other shared utilities]
```

---

### Shared Layer (src/shared/)

#### **shared/config/**

**Key File: `api-endpoints.ts`** ⭐ (CRITICAL)

This is the **single source of truth** for all API endpoints in the application.

Structure:
```typescript
export const API = {
  core: { health, apiHealth, ... },
  auth: { login, register, refresh, ...
    admin: { ... },
    vendor: { ... },
    buyer: { ... },
  },
  buyer: {
    registered: {
      cart: { list, add, update, remove, ... },
      wishlist: { list, add, remove, ... },
    },
    lead: { createLead },
  },
  vendor: {
    products: { list, create, ... },
    tax: { gstValidate, panVerify, ... },
    kyc: { ... },
    excel: { ... },
  },
  management: {
    admin: { users, vendors, products, ... },
    cto: { dashboard, metrics, ... },
  },
  employee: { ... },
  directory: { search, getLocations, ... },
};
```

**Usage:**
```typescript
import { API } from '@/shared/config/api-endpoints';
const response = await api.post(API.buyer.lead.createLead, data);
```

---

#### **shared/components/**

Reusable UI components (no business logic):

```
shared/components/
├── Button, Input, Select, Dialog, Badge, Card, etc.  # UI primitives
├── Navbar.tsx                                        # Main navigation
├── Footer.tsx                                        # Footer
├── Filter.tsx                                        # Search filters
├── SearchBar.tsx                                     # Search component
├── MegaMenu.tsx                                      # Category/service menu
├── CategoryGrid.tsx                                  # Category cards
├── ProductGrid.tsx                                   # Product gallery
├── StarRating.tsx                                    # Rating display
├── WishlistButton.tsx                                # Wishlist toggle
├── Chatbot.tsx                                       # Chat widget
├── NotificationCenter.tsx                            # Notifications
└── [Other UI components]
```

---

#### **shared/services/**

```
shared/services/
├── api.ts                          # Axios instance + interceptors
├── errorHandler.ts                 # Error handling utility
├── dynamicDataService.ts           # Dynamic data loading
└── profileService.ts               # User profile operations
```

**Key File: `api.ts`**
- Creates Axios instance with base URL from environment variables
- JWT token management in request interceptor
- 401/403 error handling in response interceptor
- Helper functions: `checkBackendHealth()`, `testAuthAndGetUser()`

---

#### **shared/types/**

Global TypeScript interfaces:

```typescript
// api.ts
export interface JwtResponse {
  token: string;
  user: { id, email, name, role, ... };
  requiresOTP?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// lead.ts
export interface Lead {
  email: string;
  phone: string;
  quantity?: number;
  serviceName?: string;
  ...
}
```

---

### Library Layer (src/lib/)

```
lib/
├── api.ts                           # Re-exports (api, apiClient alias)
├── sitemap/
│   └── directorySitemapSource.ts    # Pluggable sitemap data source
└── [Other utilities]
```

**Key File: `api.ts`**

Re-exports from `src/shared/services/api.ts` for convenience:
- Main API client: `api` and `apiClient` (alias)
- Helper functions: checkBackendHealth, excelAPI, etc.

---

### Store (src/store/)

Redux Toolkit store configuration (if used). Check for:
```
store/
├── index.ts                         # Store configuration
├── slices/                          # Redux slices
│   ├── authSlice.ts                # Auth state (user, token, etc.)
│   ├── cartSlice.ts                # Cart state
│   └── [Other slices]
└── thunks/                          # Async actions
```

---

## 3. Shared & Core Layers

### Key Single Sources of Truth

| File | Responsibility |
|------|-----------------|
| `src/shared/config/api-endpoints.ts` | All API endpoint definitions |
| `src/middleware.ts` | Subdomain routing, directory URL rewriting |
| `src/app/sitemap.ts` | XML sitemap generation |
| `src/shared/services/api.ts` | Central Axios instance, interceptors |
| `src/store/slices/authSlice.ts` | Auth state (Redux) |

### Auth Configuration

- **JWT Storage:** `localStorage.authToken`
- **Token Header:** `Authorization: Bearer <token>`
- **Refresh Logic:** Handled in request/response interceptors in `api.ts`
- **Logout Endpoints:** `/api/auth/logout`

### Role-Based Logic

Roles defined in backend & propagated to frontend:

```
- ROLE_BUYER / buyer / user
- ROLE_VENDOR / vendor
- ROLE_ADMIN / admin
- ROLE_CTO / cto
- ROLE_HR / hr
- ROLE_SUPPORT / support
- ROLE_FINANCE / finance
- ROLE_DATA_ENTRY / data-entry
```

Dashboard role mapping (src/modules/core/services/authService.ts):
```typescript
const roleMap: { [key: string]: string } = {
  buyer: 'user',
  vendor: 'vendor-panel',
  admin: 'admin',
  ...
};
```

---

## 4. Routing & Subdomains

### Middleware (src/middleware.ts) — Core Routing Logic

The middleware handles:
1. **Subdomain-to-path mapping** (e.g., vendor.localhost:3000 → /vendor/...)
2. **Directory SEO URL rewriting** on dir. subdomain
3. **Main domain redirect** for root SEO slugs to dir. subdomain

**Subdomain Map:**
```typescript
const SUBDOMAIN_MAP = {
  vendor: '/vendor',
  buyer: '/buyer',
  emp: '/employee',
  dir: '/directory',
  man: '/management',
};
```

#### Behavior by Subdomain

**1. Vendor Subdomain (vendor.localhost:3000 or vendor.indiantrademart.com)**
- Requests to root `/vendor/...` are rewritten internally
- User sees `/vendor/dashboard`, `/vendor/products`, etc.

**2. Directory Subdomain (dir.localhost:3000 or dir.indiantrademart.com)**
- Root-level SEO URLs are rewritten to `/directory/...`
- Example: `/land-surveyors` → `/directory/land-surveyors` (internal rewrite)
- URL in browser stays as `/land-surveyors`

**3. Main/Www Subdomain (www.indiantrademart.com or root)**
- Reserved paths: `/api`, `/dashboard`, `/auth`, `/directory`, `/vendor`, `/buyer`, etc.
- Any other root path redirects to dir. subdomain with HTTP 308
- Example: `/land-surveyors` on www → redirect to `dir.indiantrademart.com/land-surveyors`

**4. Auth Routes**
- `/auth/vendor/...` → redirects to vendor subdomain
- `/auth/user/...` → redirects to buyer subdomain
- `/auth/admin/...` → redirects to admin (if subdomain exists)

### Dashboard Routes Organization

All dashboard routes are under `/dashboard/<role>`:

- **Buyer:** `/dashboard/buyer` (user profile, orders, wishlist, leads)
- **Vendor:** `/dashboard/vendor-panel` (products, orders, leads, stats)
- **Admin:** `/dashboard/admin` (leads, users, products)
  - Lead management: `/dashboard/admin/leads`
- **Employee:** `/dashboard/employee` (data entry, support)
  - Finance: `/dashboard/finance`
  - Support: `/dashboard/support`
- **CTO:** `/dashboard/cto` (metrics, performance)
- **HR:** `/dashboard/hr` (approvals)

**Note:** Old `/dashboard/user` route was removed and redirects to `/dashboard/buyer`.

### Directory & Browse Routes

- Main directory page: `/directory` (redirects to dir subdomain)
- SEO directory routes: `/directory/[...seoParams]`
- Browse vendors: `/browse-vendors/city/[city]` and `/browse-vendors/city/[city]/category/[category]`

---

## 5. SEO & Directory System

This system is central to the platform's SEO strategy and public-facing discoverability.

### SEO Route Handler

**File:** `src/app/directory/[...seoParams]/page.tsx`

**What It Does:**
1. Captures SEO-friendly URLs using catch-all route `[...seoParams]`
2. Parses slugs using `parseSeoSlug()` utility
3. Extracts: `serviceSlug`, `citySlug`, `stateSlug`
4. Passes these props to `DirectoryPage` with `source="seo"`

**Supported URL Patterns:**

| Pattern | Example | Extracted |
|---------|---------|-----------|
| Service only | `/directory/land-surveyors` | service=land-surveyors |
| Service + City + State | `/directory/peb-building-design-consultant-in-visakhapatnam-andhra-pradesh` | service=peb-building-design-consultant, city=visakhapatnam, state=andhra-pradesh |

**Slug Parsing Logic:**
- Split on `-in-` to separate service from location
- Last two hyphen-separated parts after `-in-` are treated as state (or city if only one part)
- Convert hyphens to spaces for display

---

### Directory Page

**File:** `src/modules/directory/components/DirectoryPage.tsx`

**Props:**
```typescript
interface DirectoryPageProps {
  initialQuery?: string;
  initialLocation?: string;
  initialCategory?: string;
  initialServiceSlug?: string | null;
  initialCitySlug?: string | null;
  initialStateSlug?: string | null;
  source?: 'seo' | 'internal';  // Determines behavior
}
```

**Behavior:**

**When `source="seo"`:**
- Shows breadcrumb navigation
- Humanizes slugs (e.g., `land-surveyors` → "Land Surveyors")
- Converts location slugs to city, state format
- Performs initial search with parsed slugs

**When `source="internal"`:**
- Traditional query-parameter-based search
- No breadcrumb
- Used by dropdown searches, city/category filters

**Lead Popup Integration:**
- Checks authentication: `authService.isAuthenticated()`
- If not authenticated: Shows lead popup on CTA clicks (Contact, View Mobile, Get Quote)
- Auto-opens after 2 minutes (if enabled)
- Session storage prevents re-showing in same session

---

### Breadcrumb Component

**File:** `src/modules/directory/components/DirectoryBreadcrumb.tsx`

Displays navigation trail:
```
Home > Service Name > City, State
```

- Converts slugs to human-readable text
- Links back to intermediate levels
- Only shown when `source="seo"`

---

### SEO URL Generation Utility

**File:** `src/modules/directory/utils/seoSlug.ts`

**Key Functions:**

1. **`toSlug(text: string): string`**
   - Converts "Land Surveyors" → "land-surveyors"
   - Handles spaces, special characters

2. **`buildDirectorySeoPath(options)`**
   - Takes: serviceName, cityName, stateName
   - Returns SEO path:
     - If service only: `/directory/service-slug`
     - If service + city + state: `/directory/service-slug-in-city-slug-state-slug`
     - If no service: returns null

**Usage in Search UI:**
```typescript
const seoPath = buildDirectorySeoPath({
  serviceName: 'Land Surveyors',
  cityName: 'Visakhapatnam',
  stateName: 'Andhra Pradesh',
});
router.push(seoPath); // Navigate to SEO URL
```

---

### Sitemap Generation

**File:** `src/app/sitemap.ts`

Generates XML sitemap for search engines:

1. **Core Pages (www.indiantrademart.com):**
   - `/`, `/about-us`, `/contact-us`, `/directory`, `/products`, `/categories`, `/cities`, `/privacy-policy`, `/terms-of-use`

2. **Directory SEO Entries (dir.indiantrademart.com):**
   - Pulled from pluggable data source: `src/lib/sitemap/directorySitemapSource.ts`
   - Currently returns empty array (TODO: integrate with backend)
   - Once DB is connected: Will generate entries for all service + city combinations

**Pluggable Source:**
```typescript
// src/lib/sitemap/directorySitemapSource.ts
export async function getDirectorySeoEntries(): Promise<DirectorySeoEntry[]> {
  // TODO: Fetch from backend API
  // For now, returns []
  return [];
}

interface DirectorySeoEntry {
  serviceSlug: string;
  citySlug?: string;
  stateSlug?: string;
  lastModified?: string;
}
```

---

## 6. Lead System

### Frontend Lead Capture

**Module:** `src/modules/buyer/lead/`

**Purpose:** Capture inquiries from unregistered users on directory and product pages.

#### Lead Popup Container

**File:** `src/modules/buyer/lead/components/LeadPopupContainer.tsx`

- Modal dialog with backdrop
- Title: "Get a Quote"
- Close button (X)
- Renders `LeadCaptureForm` inside

#### Lead Capture Form

**File:** `src/modules/buyer/lead/components/LeadCaptureForm.tsx`

**Fields:**
- Email (required)
- Phone (required)
- Quantity (optional)
- Service Name (optional)
- Additional fields as needed

**Features:**
- Form validation
- Loading state during submission
- Success screen after submission
- Error handling

#### Lead Popup Hook

**File:** `src/modules/buyer/lead/hooks/useLeadPopup.ts`

**State Management:**
```typescript
const {
  isOpen,           // Modal visible?
  hasSubmitted,     // Form already submitted in this session?
  hasDismissed,     // User closed popup in this session?
  openPopup,        // Manually open
  closePopup,       // Close & mark dismissed
  markAsSubmitted,  // Form submitted
} = useLeadPopup(options);
```

**Options:**
```typescript
{
  enabledAutoOpen: boolean,   // Auto-open after delay?
  autoOpenDelayMs: number,    // Default 120000 (2 minutes)
  productId?: number,
  vendorId?: number,
  serviceName?: string,
}
```

**Session Storage Keys:**
- `lead-popup-dismissed-session` — User closed popup
- `lead-popup-submitted-session` — Form was submitted

Once set, popup won't re-appear in same browser session.

#### Lead Service

**File:** `src/modules/buyer/lead/services/leadService.ts`

API calls:
```typescript
export const leadService = {
  submitLead: async (leadData: Lead) => {
    return api.post(API.buyer.lead.createLead, leadData);
  },
};
```

Endpoint: `POST /api/leads/create`

---

### Admin Lead Management

**Module:** `src/modules/management/admin/`

**Route:** `/dashboard/admin/leads`

**Purpose:** Admin can view, filter, and manage incoming leads (mock backend).

#### Components

**LeadListPage.tsx**
- Main page container
- Displays lead list + detail panel

**LeadListTable.tsx**
- Table with pagination
- Columns: ID, email, phone, service, date, status
- Click row to view details

**LeadDetailPanel.tsx**
- Shows full lead info
- Actions: mark as contacted, convert to buyer, delete, etc.

#### Lead Service (Mock)

**File:** `src/modules/management/admin/services/leadApi.ts`

Currently uses **mock data**. Structure:
```typescript
export const leadApi = {
  getLeads: async (page, limit) => { /* return mock leads */ },
  getLeadById: async (id) => { /* return mock lead */ },
  updateLead: async (id, data) => { /* update mock lead */ },
  deleteLead: async (id) => { /* delete mock lead */ },
};
```

**TODO:** Replace mock with real API calls once backend API is ready.

---

### Shared Lead Types

**File:** `src/modules/shared/types/lead.ts`

```typescript
export interface Lead {
  id?: string;
  email: string;
  phone: string;
  quantity?: number;
  serviceName?: string;
  source?: 'popup' | 'form' | 'directory';
  createdAt?: string;
  status?: 'new' | 'contacted' | 'converted' | 'closed';
}
```

---

### Integration Points

**Where Lead Popup Appears:**

1. **DirectoryPage** (`src/modules/directory/components/DirectoryPage.tsx`)
   - CTA buttons: "Contact Supplier", "View Mobile", "Get Quote"
   - For unauthenticated users: triggers lead popup instead

2. **ProductDetails** (if present)
   - "Contact Supplier" button

3. **Browse-Vendors Pages** (`src/app/browse-vendors/...`)
   - Vendor contact CTAs

---

## 7. Auth & Dashboard

### Authentication Flow

**Services:**
- `src/modules/core/services/authService.ts` — Main auth logic

**Methods:**

1. **`login(loginData)`**
   - Supports multiple user types (buyer, vendor, admin, employee)
   - Endpoint determined by `userType` param
   - Stores JWT token + user data in localStorage
   - Returns `JwtResponse` with token and user

2. **`register(registerData)`**
   - Registers buyer, vendor, or other roles
   - Returns confirmation or OTP requirement

3. **`loginUser()`, `loginVendor()`, `loginAdmin()`**
   - Role-specific shortcuts

4. **`forgotPassword(email)`**
   - Sends OTP to email

5. **`verifyForgotPasswordOtp(otpData)`**
   - Confirms OTP and resets password

6. **`verifyOtp(otpData)`**
   - OTP verification after login (password-less)

7. **`logout()`**
   - Clears localStorage, calls `/api/auth/logout`

8. **`isAuthenticated()`**
   - Checks if JWT token exists in localStorage

### Buyer Dashboard

**Route:** `/dashboard/buyer`

**Page File:** `src/app/dashboard/buyer/page.tsx`

**Features:**
- User profile & settings
- Order history
- Wishlist
- Cart
- Saved addresses
- Lead history (submitted leads)

---

### Vendor Dashboard

**Route:** `/dashboard/vendor-panel`

**Key Panels:**
- **Products:** Add, edit, delete products; bulk import via Excel
- **Orders:** View incoming orders, update status
- **Leads:** Manage incoming leads from buyers
- **Stats:** Total products, orders, revenue, monthly growth (cached in memory)
- **KYC:** Upload documents, verify status
- **Tax Management:** GST, PAN verification and rate selection

---

### Admin Dashboard

**Route:** `/dashboard/admin`

**Key Sections:**
- **Leads** (`/dashboard/admin/leads`) — Lead management UI
- **Users** — View, search, manage users
- **Vendors** — Vendor approvals, type management
- **Products** — Product catalog, featured items
- **Orders** — Order overview, status updates

---

## 8. State Management & API Client

### Redux Store Setup

**Location:** `src/store/`

**Store Slices (likely present):**
- `authSlice.ts` — User, token, auth state
- `cartSlice.ts` — Cart items
- Other feature slices as needed

**Usage in Components:**
```typescript
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';

const user = useSelector((state: RootState) => state.auth.user);
```

---

### Central API Client

**File:** `src/shared/services/api.ts`

**Axios Instance:**
```typescript
export const api = axios.create({
  baseURL: getBackendUrl(),  // From env vars
  withCredentials: true,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});
```

**Request Interceptor:**
- Adds JWT token from localStorage: `Authorization: Bearer <token>`
- Logs requests

**Response Interceptor:**
- Handles 401/403 errors (token expired, insufficient permissions)
- Clears localStorage and reloads page on 401 + protected endpoint
- Logs errors

**Helper Functions:**
- `checkBackendHealth()` — Checks if backend is running
- `testAuthAndGetUser()` — Gets current user profile
- `checkApiHealth()` — Health check

---

### Feature-Level API Services

Each feature module defines thin service layers on top of the shared client:

**Example: Lead Service**
```typescript
// src/modules/buyer/lead/services/leadService.ts
import { api } from '@/shared/services/api';
import { API } from '@/shared/config/api-endpoints';

export const leadService = {
  submitLead: async (leadData: Lead) => {
    return api.post(API.buyer.lead.createLead, leadData);
  },
};
```

**Example: Directory API**
```typescript
// src/modules/directory/services/directoryApi.ts
export const directoryApi = {
  searchServiceProviders: async (filters) => {
    return api.get(API.directory.search, { params: filters });
  },
  getServiceProvider: async (id) => {
    return api.get(`/api/directory/providers/${id}`);
  },
};
```

---

## 9. How to Add / Extend Features

### Scenario 1: Add a New API Endpoint

**Steps:**

1. **Define the endpoint in `src/shared/config/api-endpoints.ts`:**
   ```typescript
   export const API = {
     // ... existing
     myFeature: {
       list: '/api/my-feature',
       create: '/api/my-feature',
       getById: (id) => `/api/my-feature/${id}`,
     },
   };
   ```

2. **Create a service in your module:**
   ```typescript
   // src/modules/mymodule/services/myApi.ts
   import { api } from '@/shared/services/api';
   import { API } from '@/shared/config/api-endpoints';

   export const myApi = {
     fetchItems: async () => api.get(API.myFeature.list),
     createItem: async (data) => api.post(API.myFeature.create, data),
     getById: async (id) => api.get(API.myFeature.getById(id)),
   };
   ```

3. **Use in components:**
   ```typescript
   const { data } = await myApi.fetchItems();
   ```

---

### Scenario 2: Add a New SEO Directory Entry Pattern

**Steps:**

1. **Update slug parsing logic in `src/app/directory/[...seoParams]/page.tsx`:**
   ```typescript
   // If you want to support a new pattern, modify parseSeoSlug()
   // Example: /service-in-city-state-country
   ```

2. **Update `buildDirectorySeoPath()` in `src/modules/directory/utils/seoSlug.ts`:**
   ```typescript
   export function buildDirectorySeoPath(options) {
     // Add support for new pattern
   }
   ```

3. **Update sitemap source in `src/lib/sitemap/directorySitemapSource.ts`:**
   ```typescript
   // When DB is integrated, ensure new pattern is included
   ```

---

### Scenario 3: Add a New Dashboard Route

**Steps:**

1. **Create route directory:**
   ```
   src/app/dashboard/<role>/<feature>/page.tsx
   ```

2. **Create module components:**
   ```
   src/modules/<role>/<feature>/components/...
   src/modules/<role>/<feature>/services/...
   src/modules/<role>/<feature>/types/...
   ```

3. **Add module index export:**
   ```typescript
   // src/modules/<role>/<feature>/index.ts
   export { default as MainComponent } from './components/Main.tsx';
   ```

4. **Wire navigation (optional):**
   - Update `src/shared/components/Navbar.tsx` or sidebar links

5. **Add auth guard if needed:**
   ```typescript
   // In your route page.tsx
   <AuthGuard requiredRole="<role>">
     <YourComponent />
   </AuthGuard>
   ```

---

### Scenario 4: Add Authentication for a New User Type

**Steps:**

1. **Add login/register endpoints in `src/shared/config/api-endpoints.ts`:**
   ```typescript
   auth: {
     myRole: {
       login: '/api/auth/myrole/login',
       register: '/api/auth/myrole/register',
     },
   }
   ```

2. **Update middleware `src/middleware.ts`:**
   ```typescript
   // Add route handling for /auth/myrole/...
   if (pathname.startsWith('/auth/myrole/') && subdomain !== 'myrole') {
     const redirectUrl = buildSubdomainRedirectUrl(req, host, hostname, 'myrole');
     return NextResponse.redirect(redirectUrl);
   }

   // Add subdomain mapping
   const SUBDOMAIN_MAP: Record<string, string> = {
     myrole: '/myrole',
     // ...
   };
   ```

3. **Update `authService.ts` with new role handling:**
   ```typescript
   async login(loginData) {
     switch (userType) {
       case 'myrole':
         endpoint = '/api/auth/myrole/login';
         break;
       // ...
     }
   }
   ```

---

## Important Notes

### Build & Development

**Development:**
```bash
npm run dev              # Start dev server
npm run lint            # Check linting
npm run type-check      # TypeScript check
```

**Production Build:**
```bash
npm run build           # Build for production
npm run start           # Start production server
```

### Environment Variables

Create `.env.local` with:
```
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_BASE_URL=http://localhost:8080
NODE_ENV=development
```

### Legacy Code Notes

- **Old `/dashboard/user` route:** Removed; redirects to `/dashboard/buyer`
- **Mock data:** Admin lead management currently uses mock API (file: `src/modules/management/admin/services/leadApi.ts`)
- **Directory mock API:** Fallback when real API is unavailable

### Current Limitations & TODOs

- Directory sitemap source is empty (TODO: integrate DB)
- Admin lead API is mock (TODO: real backend)
- Some APIs may still reference old endpoint patterns (TODO: audit)

---

## Quick Reference Checklist

When onboarding or reviewing features, verify:

- [ ] API endpoints defined in `src/shared/config/api-endpoints.ts`
- [ ] Feature service created with thin wrapper around `api` client
- [ ] Components use lead popup for unauthenticated users (where applicable)
- [ ] Directory-related features use SEO-friendly slug utility
- [ ] Auth flows return proper `JwtResponse` structure
- [ ] Role-based dashboard routes under `/dashboard/<role>`
- [ ] Subdomain routing tested in middleware for new feature routes
- [ ] Sitemap updated if adding SEO pages
- [ ] Redux state updated for user-facing state (auth, cart, etc.)

---

**Generated:** December 2025  
**Frontend Version:** 0.1.2  
**Next.js Version:** 15.5.2
