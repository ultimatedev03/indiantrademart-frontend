// Module: buyer/lead - Modal container for lead capture popup
'use client';

import React from 'react';
import LeadCaptureForm, { LeadCaptureFormProps } from './LeadCaptureForm';

export type LeadPopupContainerProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  formProps: Omit<LeadCaptureFormProps, 'onClose' | 'onSuccess'>;
};

export default function LeadPopupContainer({
  isOpen,
  onClose,
  onSuccess,
  formProps,
}: LeadPopupContainerProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Get a Quote
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Cloe modal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Form WITHOUT cancel button (removed by not passing onClose) */}
          <LeadCaptureForm
            {...formProps}
            onSuccess={onSuccess}
          />
        </div>
      </div>
    </>
  );
}
