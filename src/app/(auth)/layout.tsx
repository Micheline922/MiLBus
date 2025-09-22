
import { AuthProvider } from '@/hooks/use-auth';
import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
        <div className="min-h-screen bg-background">{children}</div>
    </AuthProvider>
  );
}
