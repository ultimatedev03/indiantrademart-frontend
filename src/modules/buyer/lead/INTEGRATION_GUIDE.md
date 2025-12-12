# Lead Popup Integration Guide

## Overview
The lead popup is designed for non-logged-in users who want to submit their details without creating a full account.

## Components Available

1. **LeadCaptureForm** - The form component with fields: email, phone, quantity, serviceName
2. **LeadPopupContainer** - Modal wrapper for the form
3. **useLeadPopup** - Hook managing popup state and auto-open behavior
4. **leadService** - API service for form submission

## Basic Usage Example

```tsx
'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useLeadPopup, LeadPopupContainer } from '@/modules/buyer/lead';

export default function ServiceDetailPage() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  // Initialize popup with auto-open only for non-logged-in users
  const leadPopup = useLeadPopup({
    autoOpenDelayMs: 120000, // 2 minutes
    enabledAutoOpen: !isAuthenticated, // Auto-open only for guests
    serviceName: 'Premium Consulting',
    vendorId: 123,
  });

  const handleContactSupplier = () => {
    // Open popup on button click
    leadPopup.openPopup();
  };

  return (
    <>
      {/* Your page content */}
      <button onClick={handleContactSupplier}>
        Get Quote
      </button>

      {/* Popup component */}
      <LeadPopupContainer
        isOpen={leadPopup.isOpen}
        onClose={leadPopup.closePopup}
        onSuccess={leadPopup.markAsSubmitted}
        formProps={{
          vendorId: 123,
          serviceName: 'Premium Consulting',
          triggerType: 'click',
        }}
      />
    </>
  );
}
```

## Behavior by User Type

### Non-Logged-In Users (Lead-Only)
- Popup auto-opens after 2 minutes on service detail pages
- Can manually open via "Get Quote" / "Contact Supplier" button clicks
- Once submitted or dismissed, won't show again in that session (using sessionStorage)
- Lead data submitted to `/api/leads/create`

### Logged-In Registered Buyers
- Auto-open disabled (set `enabledAutoOpen: false`)
- Can still open popup manually via buttons for quick quote requests
- Full registered buyer flows remain available

## Integration Points

### 1. Directory Module (ServiceProviderCard, DirectoryPage)
```tsx
// In ServiceProviderCard or page where "Contact Supplier" button exists
const leadPopup = useLeadPopup({
  enabledAutoOpen: !isAuthenticated,
  serviceName: providerData.serviceName,
  vendorId: providerData.id,
});

// Wire up the button
<button onClick={leadPopup.openPopup}>Contact Supplier</button>
```

### 2. Buyer Directory / Listing Pages
Any page where users browse services/vendors can use the same pattern.

### 3. Service Detail Pages
Auto-open + manual trigger for comprehensive lead capture.

## API Endpoint

The form uses `API.buyer.lead.createLead` from the centralized API config:
- Endpoint: `POST /api/leads/create`
- Payload: `{ email, phone, quantity, serviceName, productId?, vendorId?, sourcePage?, triggerType? }`
- Response: Lead record created in backend

## Session Storage Keys

- `lead-popup-dismissed-session`: Tracks if user dismissed the popup in this session
- `lead-popup-submitted-session`: Tracks if user submitted the form in this session

Both keys persist across page navigations within the same session.

## Customization

### Auto-open Delay
```tsx
const leadPopup = useLeadPopup({
  autoOpenDelayMs: 180000, // 3 minutes instead of 2
});
```

### Disabling Auto-open for Specific Pages
```tsx
const leadPopup = useLeadPopup({
  enabledAutoOpen: false, // Never auto-open on this page
});
```

### Pre-filling Service Name
```tsx
const leadPopup = useLeadPopup({
  serviceName: 'Your Service Name', // Will be pre-filled in form
});
```

## Form Validation

The form includes built-in validation for:
- Email format (required, valid email)
- Phone format (required, basic phone number validation)
- Quantity (required, positive number)
- Service Name (required, non-empty)

Error messages display inline and clear when user starts typing.
