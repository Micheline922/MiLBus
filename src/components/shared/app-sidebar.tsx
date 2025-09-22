'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import {
  BarChart3,
  ChevronDown,
  ClipboardList,
  LayoutGrid,
  Package,
  Settings,
  ShoppingCart,
  Users,
  Home,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

export default function AppSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState({ products: false });

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-2 bg-primary rounded-md flex items-center justify-center">
                  <span className="font-bold text-primary-foreground">M</span>
              </div>
              <span className="font-headline text-xl">MiLBus</span>
            </Link>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/dashboard" className="w-full">
              <SidebarMenuButton
                isActive={isActive('/dashboard')}
                icon={<LayoutGrid />}
              >
                Tableau de bord
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/orders" className="w-full">
              <SidebarMenuButton isActive={isActive('/orders')} icon={<ClipboardList />}>
                Commandes
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/sales" className="w-full">
              <SidebarMenuButton isActive={isActive('/sales')} icon={<ShoppingCart />}>
                Ventes
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
             <SidebarMenuButton
              icon={<Package />}
              rightIcon={<ChevronDown size={16} className={`transition-transform duration-200 ${open.products ? 'rotate-180' : ''}`} />}
              onClick={() => setOpen(prev => ({...prev, products: !prev.products}))}
              isActive={pathname.startsWith('/products')}
            >
              Produits
            </SidebarMenuButton>
            {open.products && (
                <SidebarMenuSub>
                    <SidebarMenuSubItem>
                        <Link href="/products" className="w-full">
                            <SidebarMenuSubButton isActive={isActive('/products')}>
                                Gérer les produits
                            </SidebarMenuSubButton>
                        </Link>
                    </SidebarMenuSubItem>
                </SidebarMenuSub>
            )}
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/customers" className="w-full">
              <SidebarMenuButton isActive={isActive('/customers')} icon={<Users />}>
                Clients
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/reports" className="w-full">
              <SidebarMenuButton isActive={isActive('/reports')} icon={<BarChart3 />}>
                Rapports
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/invoices" className="w-full">
              <SidebarMenuButton isActive={isActive('/invoices')} icon={<FileText />}>
                Factures
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <div className="flex items-center gap-3 p-2">
          <Avatar>
            <AvatarImage src="https://picsum.photos/seed/user/40/40" />
            <AvatarFallback>EN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Entrepreneuse</span>
            <span className="text-xs text-muted-foreground">contact@milbus.com</span>
          </div>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/settings" className="w-full">
              <SidebarMenuButton isActive={isActive('/settings')} icon={<Settings />}>
                Paramètres
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
