
'use client';

import AppSidebar from '@/components/shared/app-sidebar';
import Chatbot from '@/components/shared/chatbot';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function ProtectedAppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    // You can show a loading spinner here
    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Loading...</p>
        </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <AppSidebar />
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
            <SidebarTrigger className="md:hidden" />
            <h1 className="font-headline text-lg">MiLBus</h1>
        </header>
        <div className="flex-1">
          {children}
        </div>
        <footer className="text-center p-4 text-muted-foreground text-sm border-t">
          Conçu par Micheline Ntale
        </footer>
        <Chatbot />
      </SidebarInset>
    </SidebarProvider>
  );
}


export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
      <ProtectedAppLayout>{children}</ProtectedAppLayout>
  );
}
