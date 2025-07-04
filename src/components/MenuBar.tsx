"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';

import clsx from 'clsx';

export const MenuBar: React.FC<{ hideSignInButton?: boolean; hideNavLinks?: boolean; showLogoutOnly?: boolean }> = ({ hideSignInButton }) => {
  const { user } = useAuth();

  // Font classes
  const literata = 'font-literata';
  const mono = 'font-geist-mono';

  return (
    <header className="sticky top-0 z-50 w-full bg-[#002248] border-b border-white/20 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        {/* === Left Side: Logo & Brand === */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-white p-1 rounded-md">
            <Image src="/myPM-logo.png" alt="UCL CS Logo" width={40} height={40} />
          </div>
          <span className={clsx(literata, "text-white text-2xl font-bold")}>
            myPM
          </span>
        </Link>

        {/* === Right Side: Auth Buttons === */}
        <div className="flex items-center gap-4">
          {user ? (
            <Link href="/dashboard">
              <Button size="lg" className={clsx(mono, "bg-white text-[#002248] font-bold py-3 px-8 rounded-md hover:bg-gray-200 transition-colors text-lg")}>Dashboard</Button>
            </Link>
          ) : (
            !hideSignInButton && (
              <Link href="/login">
                <Button size="lg" className={clsx(mono, "bg-white text-[#002248] font-bold py-3 px-8 rounded-md hover:bg-gray-200 transition-colors text-lg")}>Sign In</Button>
              </Link>
            )
          )}
        </div>
      </div>
      
      <style jsx global>{`
        .font-literata { font-family: 'Literata', serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
        .font-geist-mono { font-family: 'Geist Mono', monospace; }
      `}</style>
    </header>
  );
};

export default MenuBar;