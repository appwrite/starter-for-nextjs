"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Menu, Home, Users, BookOpen, LayoutDashboard } from 'lucide-react';

export const MenuBar: React.FC = () => {
  const { user, login, logout } = useAuth();

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "#", label: "My Group", icon: Users },
    { href: "#", label: "Open Sessions", icon: BookOpen },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#002248] border-b border-white/20 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        {/* === Left Side: Logo & Brand === */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-white p-1 rounded-md">
            <Image src="/uclcs-logo.jpeg" alt="UCL CS Logo" width={40} height={40} />
          </div>
          <span className="text-white text-2xl font-bold italic group-hover:underline">
            myPM
          </span>
        </Link>

        {/* === Center: Desktop Navigation === */}
        {user && (
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-sm font-medium text-gray-200 hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        {/* === Right Side: Auth & Mobile Menu === */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/10">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.picture ?? undefined} alt={user.given_name} />
                      <AvatarFallback>{user.given_name?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.given_name} {user.family_name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link href="/dashboard">Dashboard</Link></DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="text-red-500 focus:text-red-600 focus:bg-red-50">Log Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Trigger */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/10">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-[#002248] text-white border-l-white/20 w-[280px]">
                  <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-white/20">
                      <h2 className="text-lg font-semibold">Menu</h2>
                    </div>
                    <nav className="flex-1 flex flex-col gap-2 p-4">
                      {navLinks.map((link) => (
                        <SheetClose key={link.label} asChild>
                          <Link href={link.href} className="flex items-center gap-4 px-3 py-3 rounded-md text-base font-medium hover:bg-white/10 transition-colors">
                            <link.icon className="h-5 w-5" />
                            {link.label}
                          </Link>
                        </SheetClose>
                      ))}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <Button
              onClick={login}
              className="bg-white text-[#002248] font-mono font-semibold rounded-md px-6 py-2 text-sm shadow hover:bg-gray-200 transition-colors"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default MenuBar;