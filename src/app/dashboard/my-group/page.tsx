'use client';

import React, { useEffect, useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Users, Info, Mail } from 'lucide-react';
import SidebarLayout from '@/components/SidebarLayout';
import { PageHeader } from '@/components/PageHeader';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

export default function MyGroupPage() {
  const { user, loading: userLoading } = useAuth();
  const [group, setGroup] = useState<{
    id: string;
    groupNumber: number;
    info: string;
    mentor: {
      id: string;
      upi: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
    };
    mentees: Array<{
      id: string;
      upi: string;
      firstName: string;
      lastName: string;
      email: string;
    }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [infoEdit, setInfoEdit] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!userLoading && user) {
      setLoading(true);
      fetch('/api/user/group?trueMentor=1')
        .then(res => res.json())
        .then(data => {
          setGroup(data.group);
          setInfoEdit(data.group?.info || '');
          setError(null);
        })
        .catch(() => setError('Failed to load group info.'))
        .finally(() => setLoading(false));
    }
  }, [user, userLoading]);

  const isMentor = group && user && group.mentor && group.mentor.id === user.id;

  const handleSaveInfo = async () => {
    setSaving(true);
    setSuccess(false);
    const res = await fetch('/api/user/group', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ info: infoEdit }),
    });
    setSaving(false);
    if (res.ok) {
      setSuccess(true);
      setGroup((g) => g ? { ...g, info: infoEdit } : null);
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  if (userLoading || loading) {
    return (
      <SidebarLayout>
        <div className="min-h-screen bg-[#f7f8fa] flex flex-col">
          <main className="flex-1 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col items-center justify-center flex-1">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002248] mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading your group...</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </SidebarLayout>
    );
  }

  if (error) {
    return (
      <SidebarLayout>
        <div className="min-h-screen bg-[#f7f8fa] flex flex-col">
          <main className="flex-1 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col items-center justify-center flex-1">
                <div className="p-8 max-w-lg w-full text-center shadow-xl bg-white rounded-2xl">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Info className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-4 text-[#002248]" style={{ fontFamily: 'Literata, serif' }}>
                    Error Loading Group
                  </h2>
                  <p className="mb-6 text-gray-700">{error}</p>
                  <Button onClick={() => window.location.reload()} className="bg-[#002248] hover:bg-[#003366]">
                    Try Again
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </SidebarLayout>
    );
  }

  if (!group) {
    return (
      <SidebarLayout>
        <div className="min-h-screen bg-[#f7f8fa] flex flex-col">
          <main className="flex-1 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col items-center justify-center flex-1">
                <div className="p-8 max-w-lg w-full text-center shadow-xl bg-white rounded-2xl">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-4 text-[#002248]" style={{ fontFamily: 'Literata, serif' }}>
                    No Group Assigned
                  </h2>
                  <p className="mb-6 text-gray-700 leading-relaxed">
                    You haven&apos;t been assigned to a mentor group yet. Group assignments will be made soon. 
                    Please contact your course administrator if you have any questions.
                  </p>
                  <Link href="/dashboard">
                    <Button className="bg-[#002248] hover:bg-[#003366]">
                      Return to Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <PageHeader icon={<Users className="w-10 h-10" />} title="My Mentor Group" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Group Info */}
          <div className="lg:col-span-2">
            <div className="shadow-xl rounded-2xl bg-white overflow-hidden">
              <div className="bg-gradient-to-r from-[#002248] to-[#003366] text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Literata, serif' }}>
                      Mentor Group {group.groupNumber}
                    </h2>
                    <p className="text-white/80">Your learning community</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Mentor Info */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16 ring-2 ring-[#002248]/20 flex-shrink-0">
                      <AvatarImage 
                        src={group.mentor?.upi ? `/api/user/profile-pic/${group.mentor.upi}?v=${Date.now()}` : undefined}
                        alt={`${group.mentor?.firstName} ${group.mentor?.lastName}`}
                      />
                      <AvatarFallback className="bg-[#002248] text-white text-xl font-bold">
                        {group.mentor?.firstName?.[0]}{group.mentor?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#002248] mb-1" style={{ fontFamily: 'Literata, serif' }}>
                        Your Mentor
                      </h3>
                      <p className="text-2xl font-bold text-gray-900 mb-2">
                        {group.mentor?.firstName} {group.mentor?.lastName}
                        {group.mentor?.role && (
                          <span className="ml-2 text-xs text-[#002248] bg-blue-100 px-2 py-1 rounded-full font-semibold align-middle">
                            {group.mentor.role
                              .replace('_', ' ')
                              .replace('SUPERADMIN', 'Superadmin')
                              .replace('SENIOR MENTOR', 'Senior Mentor')
                              .toLowerCase()
                              .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                          </span>
                        )}
                      </p>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${group.mentor?.email}`} className="hover:text-[#002248] transition-colors">
                          {group.mentor?.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Group Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-[#002248] flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Group Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    {isMentor ? (
                      <div>
                        <textarea
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 text-sm"
                          rows={3}
                          value={infoEdit}
                          onChange={e => setInfoEdit(e.target.value)}
                          placeholder="Add group information, meeting times, etc..."
                        />
                        <Button
                          className="bg-[#002248] hover:bg-[#003366]"
                          onClick={handleSaveInfo}
                          disabled={saving}
                        >
                          {saving ? 'Saving...' : 'Save'}
                        </Button>
                        {success && <span className="ml-3 text-green-600 text-sm font-medium">Saved!</span>}
                      </div>
                    ) : group.info ? (
                      <p className="text-gray-700 leading-relaxed">{group.info}</p>
                    ) : (
                      <p className="text-gray-500 italic">No additional information provided</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Group Members Sidebar */}
          <div className="lg:col-span-1">
            <div className="shadow-xl rounded-2xl bg-white overflow-hidden h-fit">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200 p-6">
                <h3 className="text-lg font-semibold text-[#002248] flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Group Members
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {group.mentees?.length || 0} member{(group.mentees?.length || 0) !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {group.mentees?.map((mentee) => (
                    <div key={mentee.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <Avatar className="w-10 h-10 ring-1 ring-gray-200">
                        <AvatarImage 
                          src={mentee.upi ? `/api/user/profile-pic/${mentee.upi}?v=${Date.now()}` : undefined}
                          alt={`${mentee.firstName} ${mentee.lastName}`}
                        />
                        <AvatarFallback className="bg-[#002248] text-white text-sm font-semibold">
                          {mentee.firstName?.[0]}{mentee.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {mentee.firstName} {mentee.lastName}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {mentee.email}
                        </p>
                      </div>
                    </div>
                  ))}
                  {(!group.mentees || group.mentees.length === 0) && (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Users className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-sm">No other members yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}