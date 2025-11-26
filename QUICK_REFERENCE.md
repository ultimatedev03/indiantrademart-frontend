# Quick Reference Guide - Multi-Role Dashboards

## 🎯 Key Files & Locations

### Admin Dashboard
- **Page**: `src/app/dashboard/admin/page.tsx`
- **Main Component**: `src/app/management/page.tsx`
- **New Components**:
  - `src/modules/admin/components/CreateHRForm.tsx`
  - `src/modules/admin/components/CreateCTOForm.tsx`
- **URL**: `/dashboard/admin`

### HR Dashboard  
- **Page**: `src/app/dashboard/hr/page.tsx` ✨ COMPLETELY REWRITTEN
- **URL**: `/dashboard/hr`
- **Features**: Employee creation, employee list, real statistics

### DataEntry Dashboard
- **Page**: `src/app/dashboard/employee/page.tsx`
- **Main Component**: `src/modules/employee/components/EmployeeDashboardTabs.tsx`
- **URL**: `/dashboard/employee`
- **Features**: Categories, Locations, Vendor verification

### Support Dashboard
- **Page**: `src/app/dashboard/support/page.tsx`
- **Main Component**: `src/modules/support/components/TicketManagement.tsx`
- **URL**: `/dashboard/support`
- **Features**: Ticket management, filtering, resolution workflow

---

## 🔑 Important Constants

```javascript
// API Base URL (all dashboards use this)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Authentication Endpoints
'/auth/support/register'       // Create HR
'/auth/cto/register'           // Create CTO
'/auth/dataentry/register'     // Create DataEntry
'/auth/finance/register'       // Create Finance

// User Management
'/api/admin/users'
'/api/admin/users/{id}/status'
'/api/admin/users/{id}/verify'

// Employee Management
'/api/employee/profiles'
'/api/employee/profiles/statistics'

// Data Management
'/api/categories'
'/api/locations'

// Support
'/api/support-tickets'
```

---

## 📋 Component Props & Interfaces

### CreateHRForm
```typescript
interface CreateHRFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}
```

### CreateCTOForm
```typescript
interface CreateCTOFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}
```

### HR Dashboard Employee Form
```typescript
interface EmployeeFormData {
  displayName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  workLocation: string;
  role: 'dataentry' | 'support' | 'finance';
  password: string;
  confirmPassword: string;
}
```

---

## 🚀 Deployment Steps

### 1. Environment Setup
```bash
# Set API URL in .env.local
NEXT_PUBLIC_API_URL=http://your-api-url.com

# Ensure backend is running
# Run database migrations if needed
```

### 2. Build & Test
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### 3. Testing Sequence
1. Admin Login → Create HR/CTO users
2. HR Login → Create employees
3. Employee Login → Access their dashboard
4. All role logins → Verify data displays correctly

---

## 🔧 Common Customizations

### Change API Endpoint
```javascript
// In any dashboard component
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://new-url.com';
```

### Add New Role
1. Add registration endpoint in backend
2. Create form component in `src/modules/admin/components/`
3. Add button in `/src/app/management/page.tsx`
4. Update `src/app/dashboard/` routing

### Change Styling
- Tailwind classes are used throughout
- Color scheme: Blue/Indigo primary, with role-based secondary colors
- Update `tailwind.config.js` for global changes

### Add New Dashboard Feature
```typescript
// 1. Create component
// src/modules/[module]/components/NewFeature.tsx

// 2. Add to dashboard tabs
// Update EmployeeDashboardTabs.tsx or similar

// 3. Add API integration
// const response = await axios.get(API_ENDPOINT);

// 4. Add error handling
try {
  // API call
} catch (err) {
  setError('User-friendly message');
}
```

---

## 🧪 Testing Quick Commands

### Test Admin User Creation
```javascript
// In browser console while logged in as admin
const formData = {
  name: 'Test HR',
  email: 'hr@test.com',
  phone: '9999999999',
  password: 'Test@123'
};
// Submit form manually or test API call
```

### Test API Connection
```javascript
// In browser console
fetch('http://localhost:8080/api/admin/users')
  .then(r => r.json())
  .then(data => console.log(data))
  .catch(e => console.error(e));
```

### Check Authentication Token
```javascript
// In browser console
console.log(localStorage.getItem('token'));
console.log(localStorage.getItem('user'));
```

---

## 📊 Data Flow Diagrams

### User Creation Flow
```
Admin Dashboard
  ↓
Create HR Form Modal
  ↓
Form Validation
  ↓
POST /auth/support/register
  ↓
Success Message
  ↓
Modal Close
```

### Employee Creation Flow
```
HR Dashboard
  ↓
Create Employee Form Modal
  ↓
Select Role (dataentry/support/finance)
  ↓
Form Validation
  ↓
POST /auth/{role}/register
  ↓
Refresh Employee List
  ↓
Show Success Message
```

### Ticket Resolution Flow
```
Support Dashboard
  ↓
View Ticket List
  ↓
Filter by Status/Priority
  ↓
Click View
  ↓
Read Details
  ↓
Update Status → Resolution → Close
```

---

## 🆘 Troubleshooting Quick Fixes

| Issue | Solution |
|-------|----------|
| Empty employee list | Check API response, verify token, check backend |
| Form not submitting | Check validation, look at console errors |
| Statistics not updating | Refresh page, check API endpoint |
| Modal won't close | Check success condition, verify onClose prop |
| Tickets not loading | Verify support API, check filters |
| Role-based redirect failing | Check user role in localStorage |

---

## 📱 Responsive Breakpoints

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md)
- **Desktop**: > 1024px (lg)

All dashboards are fully responsive using Tailwind's responsive prefixes.

---

## 🔐 Security Checklist

- ✅ Token stored in localStorage
- ✅ Authorization headers on all API calls
- ✅ Role validation on routes
- ✅ Form validation on client
- ✅ Error messages don't expose sensitive data
- ✅ No hardcoded credentials
- ✅ HTTPS ready for production

---

## 📈 Performance Optimization

- **Lazy Loading**: Components load on demand
- **Pagination**: Large datasets paginated
- **Memoization**: React.memo used where appropriate
- **Code Splitting**: Each dashboard is a separate route
- **Bundle Size**: No unnecessary imports

---

## 🎨 Color Scheme

- **Primary**: Blue/Indigo (Admin)
- **Success**: Green
- **Warning**: Orange/Yellow
- **Error**: Red
- **Info**: Blue
- **Neutral**: Gray

---

## 📖 Component Hierarchy

```
App
├── AuthLayout
│   ├── LoginPages
│   └── RegisterPages
│
└── DashboardLayout
    ├── AdminDashboard
    │   ├── ManagementDashboard
    │   │   ├── CreateHRForm
    │   │   ├── CreateCTOForm
    │   │   ├── UserManagement
    │   │   └── ...
    │
    ├── HRDashboard
    │   ├── EmployeeForm
    │   └── EmployeeList
    │
    ├── EmployeeDashboard
    │   ├── CategoryManagement
    │   ├── LocationManagement
    │   ├── VendorOnboarding
    │   └── VendorKycReview
    │
    └── SupportDashboard
        └── TicketManagement
```

---

## 📞 Quick Reference - What Each Role Can Do

### Admin
- ✅ Create HR users
- ✅ Create CTO users  
- ✅ View all users
- ✅ Verify users
- ✅ Activate/Deactivate users
- ✅ View analytics

### HR
- ✅ Create employees (dataentry, support, finance)
- ✅ View all employees
- ✅ Track employee statistics
- ✅ View employee details

### DataEntry
- ✅ Manage categories
- ✅ Manage locations (states/cities)
- ✅ Verify vendors
- ✅ View vendor listings

### Support
- ✅ View tickets
- ✅ Filter tickets
- ✅ Update ticket status
- ✅ Resolve tickets
- ✅ View statistics

---

## 🎯 Next.js Commands

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build            # Build project
npm start                # Start production server

# Testing
npm run test             # Run tests
npm run test:watch      # Watch mode

# Linting
npm run lint             # Check linting
npm run lint:fix         # Fix linting issues

# TypeScript
npm run typecheck        # Check TypeScript errors
```

---

## 📊 Important Files Summary

| File | Purpose | Status |
|------|---------|--------|
| `/app/dashboard/admin/page.tsx` | Admin entry point | ✅ Working |
| `/app/dashboard/hr/page.tsx` | HR entry point | ✅ Rewritten |
| `/app/dashboard/employee/page.tsx` | DataEntry entry point | ✅ Working |
| `/app/dashboard/support/page.tsx` | Support entry point | ✅ Working |
| `/modules/admin/components/CreateHRForm.tsx` | HR creation form | ✅ New |
| `/modules/admin/components/CreateCTOForm.tsx` | CTO creation form | ✅ New |
| `/app/management/page.tsx` | Admin main dashboard | ✅ Updated |
| `/modules/admin/index.ts` | Admin exports | ✅ Updated |

---

**Last Updated**: 2025-11-21  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
