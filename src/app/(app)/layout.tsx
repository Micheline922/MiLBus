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
        {children}
        <Chatbot />
      </SidebarInset>
    </SidebarProvider>
  );
}
