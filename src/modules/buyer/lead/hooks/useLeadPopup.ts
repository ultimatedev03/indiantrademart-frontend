// Module: buyer/lead - Hook for lead popup state management
'use client';

import { useState, useEffect, useRef } from 'react';

export type UseLeadPopupOptions = {
  autoOpenDelayMs?: number; // default 20000 (20 seconds)
  enabledAutoOpen?: boolean; // true only for non-logged-in users
  productId?: number;
  vendorId?: number;
  serviceName?: string;
};

const POPUP_SUBMITTED_KEY = 'lead-popup-submitted-session';

export function useLeadPopup(options: UseLeadPopupOptions = {}) {
  const {
    autoOpenDelayMs = 20000, // 20 seconds (changed from 120000)
    enabledAutoOpen = false,
    productId,
    vendorId,
    serviceName = '',
  } = options;

  const [isOpen, setIsOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check session storage on mount for previous submit
  // NOTE: We only check for submitted flag, not dismissed (dismissed is page-view only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const submitted = sessionStorage.getItem(POPUP_SUBMITTED_KEY);
      if (submitted) {
        setHasSubmitted(true);
      }
    }
  }, []);

  // Auto-open timer: only fires once per page view
  // If user has submitted form in this session, don't schedule auto-open at all
  useEffect(() => {
    // Don't auto-open if:
    // 1. enabledAutoOpen is false (user is logged in or feature disabled)
    // 2. user has already submitted form in this session
    // 3. user has dismissed popup on this page view
    if (!enabledAutoOpen || hasSubmitted || hasDismissed) {
      return;
    }

    // Schedule auto-open after delay
    timerRef.current = setTimeout(() => {
      setIsOpen(true);
    }, autoOpenDelayMs);

    // Cleanup timer on unmount or dependency change
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [enabledAutoOpen, hasSubmitted, hasDismissed, autoOpenDelayMs]);

  const openPopup = () => {
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
    // Only set hasDismissed in state (in-memory only)
    // Don't persist to sessionStorage
    // This way, dismissed popups don't show on THIS page view,
    // but can show again on ANOTHER page view (as long as not submitted)
    setHasDismissed(true);
  };

  const markAsSubmitted = () => {
    setIsOpen(false);
    setHasSubmitted(true);
    // Persist submitted flag to sessionStorage
    // This prevents auto-popups for the rest of the browser session
    // Manual openPopup() via CTAs will still work
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(POPUP_SUBMITTED_KEY, 'true');
    }
  };

  return {
    isOpen,
    hasSubmitted,
    hasDismissed,
    openPopup,
    closePopup,
    markAsSubmitted,
    popupProps: {
      productId,
      vendorId,
      serviceName,
    },
  };
}
