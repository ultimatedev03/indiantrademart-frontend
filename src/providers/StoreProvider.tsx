'use client';

import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';

interface StoreProviderProps {
  children: ReactNode;
}

/**
 * Store Provider Component
 * Wraps the application with Redux Provider
 *
 * Usage in layout.tsx:
 * import StoreProvider from '@/providers/StoreProvider';
 *
 * export default function RootLayout({ children }: { children: ReactNode }) {
 *   return (
 *     <html>
 *       <body>
 *         <StoreProvider>
 *           {children}
 *         </StoreProvider>
 *       </body>
 *     </html>
 *   );
 * }
 */
export default function StoreProvider({ children }: StoreProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}
