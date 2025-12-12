'use client';

import React from 'react';

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ value, onValueChange, className = '', children }) => {
  return (
    <div className={className} data-tabs-root>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { activeTab: value, onTabChange: onValueChange } as any)
          : child
      )}
    </div>
  );
};

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

export const TabsList: React.FC<TabsListProps> = ({ className = '', children }) => {
  return (
    <div className={`flex border-b bg-gray-50 ${className}`} data-tabs-list>
      {children}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  children,
  className = '',
  activeTab,
  onTabChange,
}) => {
  const isActive = value === activeTab;
  return (
    <button
      onClick={() => onTabChange?.(value)}
      className={`
        px-6 py-3 font-medium text-sm transition-all border-b-2
        ${isActive
          ? 'border-blue-600 text-blue-600 bg-white'
          : 'border-transparent text-gray-600 hover:text-gray-900 bg-gray-50'
        }
        ${className}
      `}
      data-tab-trigger={value}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  activeTab?: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({ value, children, className = '', activeTab }) => {
  if (value !== activeTab) return null;
  
  return (
    <div className={`animate-fadeIn ${className}`} data-tab-content={value}>
      {children}
    </div>
  );
};
