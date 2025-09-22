
import AppSidebar from '@/components/shared/app-sidebar';
import Chatbot from '@/components/shared/chatbot';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <AppSidebar />
      </Sidebar>
      <SidebarInset>
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
