
'use client';

import { CartProvider } from '@/hooks/use-cart';
import React from 'react';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
        <div className="min-h-screen bg-background">{children}</div>
    </CartProvider>
  );
}
