
'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import {
  BarChart3,
  ClipboardList,
  LayoutGrid,
  Package,
  Settings,
  ShoppingCart,
  Users,
  Home,
  FileText,
  CreditCard,
  LogOut,
  User,
  GalleryHorizontal,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '../ui/button';

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

const navLinks = [
  { href: '/', icon: <Home className="h-4 w-4" />, text: 'Vitrine' },
  { href: '/dashboard', icon: <LayoutGrid className="h-4 w-4" />, text: 'Tableau de bord' },
  { href: '/gallery', icon: <GalleryHorizontal className="h-4 w-4" />, text: 'Galerie' },
  { href: '/orders', icon: <ClipboardList className="h-4 w-4" />, text: 'Commandes' },
  { href: '/sales', icon: <ShoppingCart className="h-4 w-4" />, text: 'Ventes' },
  { href: '/products', icon: <Package className="h-4 w-4" />, text: 'Marchandises' },
  { href: '/customers', icon: <Users className="h-4 w-4" />, text: 'Clients' },
  { href: '/debts', icon: <CreditCard className="h-4 w-4" />, text: 'Dettes' },
  { href: '/reports', icon: <BarChart3 className="h-4 w-4" />, text: 'Rapports' },
  { href: '/invoices', icon: <FileText className="h-4 w-4" />, text: 'Factures' },
];


export default function AppSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    if (path === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(path) && path !== '/';
  };

  return (
    <>
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
           <div className="p-1 bg-primary rounded-md flex items-center justify-center">
              <MilbusLogo className="w-6 h-6 text-primary-foreground" />
            </div>
          <span className="font-headline text-xl">MiLBus</span>
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {navLinks.map(link => (
             <Link
                key={link.text}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${isActive(link.href) ? 'bg-muted text-primary' : 'text-muted-foreground'}`}
              >
                {link.icon}
                {link.text}
              </Link>
          ))}
        </nav>
      </div>
       <div className="mt-auto p-4 border-t">
          <div className="flex items-center gap-3 p-2 mb-2">
            <Avatar>
              <AvatarImage src={user?.profilePicture || `https://picsum.photos/seed/${user?.username}/40/40`} />
              <AvatarFallback>
                {user?.username ? user.username.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{user?.businessName || user?.username || "Entrepreneuse"}</span>
              <span className="text-xs text-muted-foreground">{user?.businessContact}</span>
            </div>
          </div>
          <nav className="grid gap-1">
              <Link href="/settings" className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${pathname === '/settings' ? 'bg-muted text-primary' : 'text-muted-foreground'}`}>
                <Settings className="h-4 w-4" />
                Paramètres
              </Link>
              <Button variant="ghost" className="justify-start w-full text-muted-foreground hover:text-primary" onClick={handleLogout}>
                 <LogOut className="mr-3 h-4 w-4" />
                Déconnexion
              </Button>
          </nav>
      </div>
    </>
  );
}
