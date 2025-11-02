# 👨‍💼 Employee Module

**Data Management System for Indian Trade Mart**

The Employee Module provides a comprehensive data management interface for employees to manage the core reference data that powers the Indian Trade Mart website.

## 🎯 Overview

This module allows employees to:

- 📁 **Category Management**: Create, read, update, and delete product categories, subcategories, and micro-categories
- 📍 **Location Management**: Manage states and cities that appear in location dropdowns
- 📊 **Data Analytics**: View statistics and health metrics for the managed data

## ✨ Features

### 📈 Dashboard Overview
- 📊 Real-time statistics for categories and locations
- ⚕️ System health monitoring
- 📋 Recent activity tracking
- ⚡ Quick action buttons

### 📂 Category Management
- 🏗️ **Hierarchical Structure**: Main → Sub → Micro categories
- 🔄 **CRUD Operations**: Create, read, update, delete categories
- 📦 **Bulk Operations**: Import/export, bulk edit, bulk delete
- 🔍 **Search & Filter**: Advanced search with level and parent filters
- 🎯 **SEO Optimization**: SEO title and description fields
- ✅ **Status Management**: Activate/deactivate categories
- 🔢 **Sort Ordering**: Custom sort order management

### 🗺️ Location Management
- 🏛️ **State Management**: Add/edit Indian states with codes
- 🏙️ **City Management**: Add cities under respective states
- 📦 **Bulk Operations**: Import/export locations
- 🔍 **Search & Filter**: Search with state filtering
- ✅ **Status Management**: Activate/deactivate locations

## 🔌 API Integration

The module expects the following backend API endpoints to be available:

### 🔐 Employee APIs
```
GET    /api/employee/profile           # Get employee profile
PUT    /api/employee/profile           # Update employee profile
GET    /api/employee/stats             # Get statistics
GET    /api/employee/dashboard         # Get dashboard data
GET    /api/employee/activity-logs     # Get activity logs
GET    /api/employee/system-health     # Get system health
```

### 📁 Category Management APIs
```
GET    /api/employee/categories/hierarchy        # Get category hierarchy
GET    /api/employee/categories                  # List categories (paginated)
GET    /api/employee/categories/:id              # Get category by ID
POST   /api/employee/categories                  # Create category
PUT    /api/employee/categories/:id              # Update category
DELETE /api/employee/categories/:id              # Delete category
PATCH  /api/employee/categories/:id/toggle-status # Toggle status
GET    /api/employee/categories/main             # Get main categories
GET    /api/employee/categories/:id/subcategories # Get subcategories
GET    /api/employee/categories/search           # Search categories
PATCH  /api/employee/categories/reorder          # Reorder categories
PATCH  /api/employee/categories/bulk-update      # Bulk update
DELETE /api/employee/categories/bulk-delete      # Bulk delete
GET    /api/employee/categories/stats            # Get statistics
```

### 🗺️ Location Management APIs
```
GET    /api/employee/states                 # List states
GET    /api/employee/states/paginated       # List states (paginated)
GET    /api/employee/states/:id             # Get state by ID
POST   /api/employee/states                 # Create state
PUT    /api/employee/states/:id             # Update state
DELETE /api/employee/states/:id             # Delete state
PATCH  /api/employee/states/:id/toggle-status # Toggle state status
GET    /api/employee/cities                 # List cities
GET    /api/employee/cities/paginated       # List cities (paginated)
GET    /api/employee/states/:id/cities      # Get cities by state
POST   /api/employee/cities                 # Create city
PUT    /api/employee/cities/:id             # Update city
DELETE /api/employee/cities/:id             # Delete city
PATCH  /api/employee/cities/:id/toggle-status # Toggle city status
GET    /api/employee/locations/stats        # Get statistics
```

## 📋 Data Models

### Category
```typescript
interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  level: 'main' | 'sub' | 'micro';
  isActive: boolean;
  sortOrder: number;
  icon?: string;
  image?: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
  subcategories?: Category[];
}
```

### State
```typescript
interface State {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  cities?: City[];
}
```

### City
```typescript
interface City {
  id: string;
  name: string;
  stateId: string;
  stateName?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}
```

## 🧩 Components Structure

```
src/modules/employee/
├── components/
│   ├── EmployeeDashboard.tsx          # Main dashboard wrapper
│   ├── EmployeeDashboardTabs.tsx      # Tab navigation
│   ├── DataManagementOverview.tsx     # Overview/stats page
│   ├── CategoryManagement.tsx         # Category management page
│   ├── CategoryTable.tsx              # Category data table
│   ├── CategoryForm.tsx               # Category create/edit form
│   ├── LocationManagement.tsx         # Location management page
│   ├── LocationTable.tsx              # Location data table
│   └── LocationForm.tsx               # Location create/edit form
├── services/
│   ├── employeeApi.ts                 # Employee profile/stats APIs
│   ├── categoryManagementApi.ts       # Category CRUD APIs
│   └── locationManagementApi.ts       # Location CRUD APIs
├── types/
│   └── employee.ts                    # TypeScript type definitions
└── index.ts                           # Module exports
```

## 🚀 Usage

### Accessing the Employee Dashboard

1. **Login**: Navigate to `/auth/employee/login`
2. **Dashboard**: After login, access `/dashboard/employee`

### Using the Components

```tsx
import { EmployeeDashboard } from '@/modules/employee';

export default function EmployeePage() {
  return <EmployeeDashboard />;
}
```

## 🔐 Permissions

The module supports role-based permissions:

```typescript
interface EmployeePermissions {
  canCreateCategories: boolean;
  canUpdateCategories: boolean;
  canDeleteCategories: boolean;
  canCreateLocations: boolean;
  canUpdateLocations: boolean;
  canDeleteLocations: boolean;
  canViewAnalytics: boolean;
}
```

## ⭐ Key Features

### 🔍 Search & Filtering
- Real-time search across categories and locations
- Advanced filtering by level, parent, status
- Pagination with configurable page sizes

### ✔️ Data Validation
- Required field validation
- Unique slug validation for categories
- State code format validation
- Sort order numeric validation

### 👥 User Experience
- Responsive design for mobile and desktop
- Loading states and error handling
- Confirmation dialogs for destructive actions
- Toast notifications for actions
- Keyboard shortcuts support

### 📤 Data Import/Export
- CSV/Excel import for bulk data
- Export functionality for backup
- Error reporting for failed imports
- Template download for proper format

## ⚠️ Error Handling

The module includes comprehensive error handling:

- API error display with user-friendly messages
- Form validation errors
- Network connectivity issues
- Permission denied scenarios
- Data conflict resolution

## 🔒 Security Considerations

- All API calls include authentication tokens
- Role-based access control
- CSRF protection
- XSS prevention
- SQL injection protection (backend)

## ⚡ Performance Optimization

- Pagination for large datasets
- Lazy loading of subcategories
- Debounced search queries
- Caching of frequently accessed data
- Optimistic UI updates

## 🔗 Integration Points

This module integrates with:

- **Product Module**: Categories are used for product classification
- **Directory Module**: Locations are used for business listings
- **Search Module**: Categories and locations power search filters
- **Analytics Module**: Provides data usage statistics

## 🛠️ Development

To extend this module:

1. Add new components in `components/` directory
2. Create corresponding API services in `services/`
3. Update types in `types/employee.ts`
4. Export new components in `index.ts`
5. Add routes in Next.js `app/` directory

## 🧪 Testing

The module should be tested with:

- Unit tests for components and services
- Integration tests for API calls
- E2E tests for user workflows
- Performance tests for large datasets
- Security tests for authorization

## 🚀 Deployment

Ensure the following environment variables are set:

```env
NEXT_PUBLIC_API_URL=https://indiantrademart-backend.onrender.com
NEXT_PUBLIC_API_BASE_URL=https://indiantrademart-backend.onrender.com/api/v1
NEXT_PUBLIC_WEBSOCKET_URL=wss://indiantrademart-backend.onrender.com/ws
```

## 💬 Support

For technical support or questions about the Employee Module:

- 📧 Contact the development team
- 📚 Refer to the main project documentation
- 🐛 Report issues on GitHub
- 💡 Check the FAQ section

---

**Live URL:** [https://indiantrademart.com](https://indiantrademart.com)  
**Author:** Dipanshu Kumar Pandey  
**Last Updated:** November 2, 2025  
**Status:** Production Ready ✅
