# 🏪 Indian Trade Mart - Frontend

**A comprehensive e-commerce and B2B trading platform for Indian businesses**

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Deployment](#deployment)
- [API Integration](#api-integration)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Support](#support)

---

## 🎯 Overview

Indian Trade Mart is a modern, full-featured e-commerce platform built with Next.js and React. It provides a complete marketplace experience for buyers and sellers with comprehensive admin tools for data management and analytics.

**Live URL:** [https://indiantrademart.com](https://indiantrademart.com)

### Key Capabilities

- 🛍️ Full e-commerce marketplace with products, categories, and inventory
- 👤 Multi-role user system (Buyers, Vendors/Sellers, Admin, Employees, Support)
- 💳 Integrated payment processing (Razorpay)
- 📊 Advanced analytics and reporting
- 📂 Hierarchical category and location management
- 📱 Fully responsive mobile-first design
- 🔐 Secure authentication with JWT tokens
- 🌐 Cross-platform deployment ready

---

## ✨ Features

### 👥 User Management
- **Buyer Portal**: Browse products, manage cart, place orders, track shipments
- **Vendor Portal**: Create/manage products, view analytics, manage orders
- **Admin Panel**: System configuration, approvals, analytics, user management
- **Employee Tools**: Category and location data management
- **Support Dashboard**: Issue tracking and customer support management

### 🛒 Shopping Experience
- Advanced product search with filters and sorting
- Shopping cart with persistent storage
- Coupon and promotion system
- Order tracking in real-time
- Order history and wishlist

### 📦 Vendor Management
- Product listing and inventory management
- Order fulfillment dashboard
- Sales analytics and reporting
- Commission tracking
- Vendor performance metrics

### 🎛️ Admin & Data Management
- User approval workflows
- Vendor verification process
- Product approval system
- Category hierarchy management (Main → Sub → Micro)
- Location/State management
- System configuration and settings
- Comprehensive analytics dashboard

### 💳 Payment Integration
- Razorpay payment gateway
- Multiple payment methods
- Order refund processing
- Payment history tracking

### 📊 Analytics
- User acquisition and engagement metrics
- Product performance analytics
- Revenue tracking
- Order fulfillment metrics
- Vendor performance insights

---

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 14+** - React framework with SSR, SSG, and API routes
- **React 18+** - UI library with hooks
- **TypeScript** - Type-safe JavaScript

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - High-quality React components
- **Lucide React** - Icon library
- **Framer Motion** - Animation library

### State Management & Data
- **Zustand/Redux** - Global state management
- **TanStack Query** - Server state management
- **Axios** - HTTP client

### Authentication & Security
- **JWT** - Token-based authentication
- **Next-Auth** - Authentication for Next.js
- **bcryptjs** - Password hashing

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking
- **Webpack** - Module bundler

---

## 📁 Project Structure

```
indiantrademart-frontend-main/
├── public/                          # Static assets
│   ├── images/                      # Images
│   ├── icons/                       # Icon files
│   └── favicon.ico
│
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── (auth)/                  # Authentication routes
│   │   ├── dashboard/               # User dashboards
│   │   ├── admin/                   # Admin panel
│   │   ├── vendor/                  # Vendor portal
│   │   ├── employee/                # Employee tools
│   │   ├── products/                # Product pages
│   │   ├── checkout/                # Checkout flow
│   │   └── layout.tsx               # Root layout
│   │
│   ├── components/                  # Reusable React components
│   │   ├── common/                  # Common UI components
│   │   ├── auth/                    # Authentication components
│   │   ├── products/                # Product components
│   │   ├── cart/                    # Cart components
│   │   ├── dashboard/               # Dashboard components
│   │   └── admin/                   # Admin components
│   │
│   ├── modules/                     # Feature modules
│   │   ├── auth/                    # Authentication module
│   │   ├── products/                # Products module
│   │   ├── cart/                    # Shopping cart module
│   │   ├── orders/                  # Orders module
│   │   ├── admin/                   # Admin module
│   │   ├── vendor/                  # Vendor module
│   │   ├── employee/                # Employee module
│   │   └── support/                 # Support module
│   │
│   ├── services/                    # API service clients
│   │   ├── auth.service.ts          # Authentication API
│   │   ├── product.service.ts       # Products API
│   │   ├── cart.service.ts          # Cart API
│   │   ├── order.service.ts         # Orders API
│   │   ├── admin.service.ts         # Admin API
│   │   ├── vendor.service.ts        # Vendor API
│   │   ├── payment.service.ts       # Payment API
│   │   ├── file.service.ts          # File upload API
│   │   └── api-client.ts            # HTTP client config
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAuth.ts               # Authentication hook
│   │   ├── useCart.ts               # Cart management hook
│   │   ├── useFetch.ts              # Data fetching hook
│   │   └── useLocalStorage.ts       # Local storage hook
│   │
│   ├── context/                     # React Context
│   │   ├── AuthContext.tsx          # Auth context
│   │   └── CartContext.tsx          # Cart context
│   │
│   ├── types/                       # TypeScript types
│   │   ├── user.ts                  # User types
│   │   ├── product.ts               # Product types
│   │   ├── order.ts                 # Order types
│   │   ├── api.ts                   # API response types
│   │   └── common.ts                # Common types
│   │
│   ├── utils/                       # Utility functions
│   │   ├── api.ts                   # API utilities
│   │   ├── auth.ts                  # Auth utilities
│   │   ├── format.ts                # Formatting utilities
│   │   └── validation.ts            # Validation utilities
│   │
│   ├── config/                      # Configuration files
│   │   ├── api.config.ts            # API configuration
│   │   ├── constants.ts             # App constants
│   │   └── colors.ts                # Color constants
│   │
│   ├── middleware.ts                # Next.js middleware
│   ├── instrumentation.ts           # App instrumentation
│   └── globals.css                  # Global styles
│
├── .env.local                       # Local development env (not committed)
├── .env.production                  # Production env variables
├── .env.staging                     # Staging env variables
├── .env.example                     # Env template
│
├── package.json                     # Dependencies
├── package-lock.json                # Locked versions
├── tsconfig.json                    # TypeScript config
├── next.config.js                   # Next.js config
├── tailwind.config.js               # Tailwind config
├── postcss.config.js                # PostCSS config
├── .eslintrc.json                   # ESLint config
├── .prettierrc                      # Prettier config
│
└── README.md                        # This file
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **yarn** (v3.0.0 or higher)
- **Git** (for version control)
- **VS Code** or your preferred code editor

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/dipanshupandey95/indiantrademart-frontend.git
cd indiantrademart-frontend-main
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration.

### Step 4: Verify Installation

```bash
npm run lint
npm run type-check
```

---

## 🔧 Environment Configuration

### Local Development (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:8080/ws
NEXT_PUBLIC_DEBUG_API=true
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_RAZORPAY_KEY_ID={{your_key}}
```

### Production (`.env.production`)

```env
NEXT_PUBLIC_API_URL=https://indiantrademart-backend.onrender.com
NEXT_PUBLIC_API_BASE_URL=https://indiantrademart-backend.onrender.com/api/v1
NEXT_PUBLIC_WEBSOCKET_URL=wss://indiantrademart-backend.onrender.com/ws
NEXT_PUBLIC_DEBUG_API=false
NEXT_PUBLIC_DEBUG_MODE=false
NEXT_PUBLIC_RAZORPAY_KEY_ID={{your_key}}
```

### Staging (`.env.staging`)

```env
NEXT_PUBLIC_API_URL=https://indiantrademart-backend.onrender.com
NEXT_PUBLIC_API_BASE_URL=https://indiantrademart-backend.onrender.com/api/v1
NEXT_PUBLIC_WEBSOCKET_URL=wss://indiantrademart-backend.onrender.com/ws
NEXT_PUBLIC_DEBUG_API=true
NEXT_PUBLIC_DEBUG_MODE=false
NEXT_PUBLIC_RAZORPAY_KEY_ID={{your_key}}
```

---

## 💻 Development

### Start Development Server

```bash
npm run dev
```

Open [https://indiantrademart.com](https://indiantrademart.com) (or localhost:3000) in your browser.

### Available Commands

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Check code quality
npm run lint:fix         # Fix linting issues
npm run format           # Format code with Prettier
npm run type-check       # Check TypeScript types
npm test                 # Run tests
```

---

## 🏗️ Building for Production

```bash
npm run build
npm start
```

---

## 🚀 Deployment

### Deploy to Netlify

1. Push code to GitHub
2. Connect GitHub repository to Netlify
3. Set environment variables in Netlify dashboard
4. Deploy

**Build Command:** `npm run build`  
**Publish Directory:** `.next`

---

## 🔌 API Integration

The frontend connects to the backend API at: **https://indiantrademart-backend.onrender.com/api/v1**

### Main Services

| Service | Purpose |
|---------|---------|
| AuthService | User authentication |
| ProductService | Product management |
| CartService | Shopping cart |
| OrderService | Order management |
| AdminService | Admin dashboard |
| PaymentService | Payment processing |

---

## 🔍 Troubleshooting

### Cannot connect to backend

1. Verify `NEXT_PUBLIC_API_URL` in `.env.local`
2. Check if backend is running
3. Clear browser cache
4. Check browser console for CORS errors

### Port 3000 already in use

```bash
npm run dev -- -p 3001
```

### Dependencies not installing

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Documentation

- [Backend README](../indiantrademartmain-backend-main/README.md)
- [Employee Module Guide](./src/modules/employee/README.md)
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)

---

## 👤 Author

**Dipanshu Kumar Pandey**

---

**Live URL:** [https://indiantrademart.com](https://indiantrademart.com)  
**Last Updated:** November 2, 2025  
**Status:** Production Ready ✅
