'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HeartPulse, UserCircle, LogIn, LogOut, Stethoscope, CalendarDays, FileText, FlaskConical, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuthStore } from '@/hooks/use-auth-store';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import React from 'react';

const navItems = [
  { href: '/tests', label: 'Tests', icon: Stethoscope },
  { href: '/book-appointment', label: 'Book Appointment', icon: CalendarDays },
  { href: '/reports', label: 'My Reports', icon: FileText },
  { href: '/reports/analyze', label: 'Analyze Report', icon: FlaskConical },
];

export default function Header() {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/'); // Redirect to home page after sign out
    } catch (error) {
      console.error('Error signing out:', error);
      // Optionally, show a toast notification for error
    }
  };

  const renderAuthButton = () => {
    if (isLoading) {
      return <div className="h-10 w-24 animate-pulse rounded-md bg-muted"></div>; // Skeleton loader
    }

    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                <AvatarFallback>
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : <UserCircle />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.displayName || 'User'}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <Button onClick={() => router.push('/auth/signin')} variant="outline">
        <LogIn className="mr-2 h-4 w-4" />
        Login
      </Button>
    );
  };
  
  const NavLinks: React.FC<{ onItemClick?: () => void }> = ({ onItemClick }) => (
    <>
      {navItems.map((item) => (
        <Link key={item.href} href={item.href} passHref>
          <Button variant="ghost" onClick={onItemClick} className="justify-start sm:justify-center w-full sm:w-auto">
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        </Link>
      ))}
    </>
  );


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 text-primary hover:opacity-80 transition-opacity">
          <HeartPulse className="h-7 w-7" />
          <span className="font-bold text-xl">PathAssist</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-1">
          <NavLinks />
        </nav>

        <div className="flex items-center space-x-2">
          <div className="hidden md:block">
            {renderAuthButton()}
          </div>
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-xs">
                <div className="flex flex-col space-y-4 p-4">
                  <Link href="/" className="flex items-center space-x-2 text-primary mb-4" onClick={() => setIsMobileMenuOpen(false)}>
                    <HeartPulse className="h-7 w-7" />
                    <span className="font-bold text-xl">PathAssist</span>
                  </Link>
                  <NavLinks onItemClick={() => setIsMobileMenuOpen(false)} />
                  <div className="pt-4 border-t">
                    {renderAuthButton()}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
