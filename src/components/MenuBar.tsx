import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MenuBarProps {
  showSignIn?: boolean;
  onSignIn?: () => void;
}

export const MenuBar: React.FC<MenuBarProps> = ({ showSignIn = true, onSignIn }) => {
  const { user, login, logout } = useAuth();

  return (
    <nav className="w-full bg-[#002855] h-28 flex items-center justify-between px-8 border-b-2 border-[#e5e1ff]">
      <Link href="/" className="flex items-center gap-4 group" style={{ textDecoration: 'none' }}>
        <div className="flex items-center">
          <Image src="/uclcs-logo.jpeg" alt="UCL Computer Science Logo" width={70} height={70} className="rounded bg-white p-1" />
        </div>
        <span className="text-white text-4xl italic font-bold ml-4 group-hover:underline">myPM</span>
      </Link>
      {user ? (
        <div className="flex-1 flex justify-end items-center gap-16">
          <div className="flex gap-10 text-white text-xl items-center">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="#" className="hover:underline">My Group</Link>
            <Link href="#" className="hover:underline">Open Sessions</Link>
            <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          </div>
          <div className="ml-12 flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-3 py-2 text-white hover:bg-[#1a3760] focus:bg-[#1a3760]">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={undefined} alt={user.given_name} />
                    <AvatarFallback>{user.given_name?.[0] ?? '?'}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline font-bold">Hello, <span className="font-extrabold">{user.given_name}</span></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-700">Log Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ) : (
        showSignIn && (
          <Button
            onClick={onSignIn || login}
            className="bg-white text-[#002855] font-semibold rounded-full px-8 py-3 text-xl shadow hover:bg-gray-100 transition"
          >
            Sign In
          </Button>
        )
      )}
    </nav>
  );
};

export default MenuBar; 