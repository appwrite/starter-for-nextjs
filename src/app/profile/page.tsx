"use client";
import { UserProfile } from '@/components/UserProfile';
import { useRequireAuth } from '@/components/AuthProvider';
import { PERMISSIONS } from '@/lib/rbac';
import SidebarLayout from '@/components/SidebarLayout';
import { PageHeader } from '@/components/PageHeader';
import { User as UserIcon } from 'lucide-react';

export default function ProfilePage() {
  useRequireAuth({ requiredPermission: PERMISSIONS.USER_READ });
  return (
    <SidebarLayout>
      <PageHeader icon={<UserIcon className="w-10 h-10" />} title="My Profile" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <UserProfile />
      </div>
    </SidebarLayout>
  );
} 