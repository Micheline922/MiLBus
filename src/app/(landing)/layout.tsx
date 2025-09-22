
import { AuthProvider } from '@/hooks/use-auth';
import React from 'react';

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
        {children}
    </AuthProvider>
  );
}
