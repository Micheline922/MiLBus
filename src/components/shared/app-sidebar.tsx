
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
  SidebarMenuSubItem,
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
  FileText,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

function MilbusLogo(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M20 80C20 80 30 20 50 20C70 20 80 80 80 80" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M35 80C35 80 40 50 50 50C60 50 65 80 65 80" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M50 50V35" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
            <path d="M42 25L50 35L58 25" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}

export default function AppSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState({ products: false });

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-1 bg-primary rounded-md flex items-center justify-center">
                  <MilbusLogo className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-headline text-xl">MiLBus</span>
            </Link>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/" className="w-full">
              <SidebarMenuButton
                isActive={isActive('/')}
                icon={<Home />}
              >
                Accueil
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
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
                            <SidebarMenuSubButton asChild isActive={isActive('/products')}>
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
            <Link href="/debts" className="w-full">
              <SidebarMenuButton isActive={isActive('/debts')} icon={<CreditCard />}>
                Dettes
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
