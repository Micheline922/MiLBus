
'use client';

import { CartProvider } from '@/hooks/use-cart';
import React, { Suspense } from 'react';

function PublicLayoutContent({ children }: { children: React.ReactNode }) {
    return (
        <CartProvider>
            <div className="min-h-screen bg-background">{children}</div>
        </CartProvider>
    );
}


export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
        <PublicLayoutContent>{children}</PublicLayoutContent>
    </Suspense>
  );
}
