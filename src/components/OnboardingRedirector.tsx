'use client';
import { useAuth } from '@/components/AuthProvider';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function OnboardingRedirector() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (!loading && user && pathname !== '/' && pathname !== '/onboarding') {
      fetch('/api/onboarding/status').then(res => res.json()).then(data => {
        if (!data.onboarded) {
          router.replace('/onboarding');
        }
      });
    }
  }, [user, loading, pathname, router]);
  return null;
} 