import React from 'react';
import { SiteProvider } from '@/context/SiteContext';

export default function AppProviders({ children }) {
  return (
    <SiteProvider>
      {children}
    </SiteProvider>
  );
}
