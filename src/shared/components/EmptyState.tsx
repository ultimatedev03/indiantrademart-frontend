'use client';

import React from 'react';

interface EmptyStateProps {
  icon?: string; // Emoji or icon
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  actionLink?: string;
  variant?: 'default' | 'compact';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📭',
  title,
  description,
  actionText,
  onAction,
  actionLink,
  variant = 'default',
}) => {
  if (variant === 'compact') {
    return (
      <div className="text-center py-6">
        <p className="text-2xl mb-2">{icon}</p>
        <p className="text-gray-600 font-medium">{title}</p>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        {actionText && (onAction || actionLink) && (
          <button
            onClick={onAction}
            className="mt-3 text-sm text-blue-600 hover:text-blue-700 hover:underline"
            {...(actionLink && { onClick: () => window.location.href = actionLink })}
          >
            {actionText} →
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 shadow-sm p-12">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
          <span className="text-4xl">{icon}</span>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        
        {description && (
          <p className="text-gray-600 max-w-md mx-auto mb-6">{description}</p>
        )}
        
        {actionText && (onAction || actionLink) && (
          <button
            onClick={onAction}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            {...(actionLink && { onClick: () => window.location.href = actionLink })}
          >
            {actionText}
            <span className="ml-2">→</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
