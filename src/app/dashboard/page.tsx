'use client';

import { useAuth, useRequireAuth } from '@/components/AuthProvider';
import { UserProfile } from '@/components/UserProfile';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PERMISSIONS } from '@/lib/rbac';
import { Users, BookOpen, Code } from 'lucide-react';
import SidebarLayout from '@/components/SidebarLayout';

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [showDebug, setShowDebug] = useState(false);

    // Require authentication and user:read permission
    useRequireAuth({ requiredPermission: PERMISSIONS.USER_READ });

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f7f8fa]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    // Font classes
    const literata = 'font-literata';

    return (
        <SidebarLayout>
            <main className="flex-1 w-full">
                {/* Welcome Section */}
                <section className="w-full bg-gradient-to-b from-[#e3eafc] to-[#f7f8fa] border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 flex flex-col md:flex-row items-center gap-8 md:gap-16">
                        <div className="flex-1 text-center md:text-left">
                            <h1 className={`text-3xl sm:text-4xl md:text-5xl font-light mb-4 leading-tight ${literata}`}>👋 Welcome, <span className="font-bold">{user.given_name}</span>!</h1>
                            <p className="text-lg text-gray-700 max-w-xl mx-auto md:mx-0 mb-4 font-inter">This is your personalised Programming Mentorship dashboard.</p>
                        </div>
                        <div className="flex-1 flex justify-center md:justify-end">
                            <img src="/myPM-logo.png" alt="myPM Logo" className="w-32 h-32 md:w-40 md:h-40 bg-white p-2 rounded-lg shadow" />
                        </div>
                    </div>
                </section>

                {/* Announcements */}
                <section className="w-full bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
                        <h2 className={`text-2xl md:text-3xl font-semibold text-[#002248] mb-4 flex items-center gap-2 ${literata}`}>
                        <span role="img" aria-label="announcements">📢</span> Announcements
                    </h2>
                        <div className="space-y-3">
                            <Card className="shadow-sm border-0 bg-[#e3eafc]">
                                <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between px-4 py-3">
                                    <span className="font-semibold text-[#002248]">[18 Mar 2026]</span>
                                    <span className="ml-0 md:ml-2 text-[#002248]">Open sessions are now available to book!</span>
                        </CardContent>
                    </Card>
                        </div>
                        <div className="text-right text-sm font-semibold mt-2">
                            <Link href="#" className="hover:underline text-[#002248]">See past announcements →</Link>
                        </div>
                    </div>
                </section>

                {/* Main Dashboard Actions */}
                <section className="w-full bg-[#f7f8fa]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            <Link href="/dashboard/my-group" className="group">
                                <Card className="flex flex-col items-center justify-center py-10 shadow-lg bg-[#009688] hover:bg-[#00796b] transition text-white rounded-xl group-hover:scale-[1.03] group-active:scale-100">
                                    <CardContent className="flex flex-col items-center">
                                        <Users className="w-10 h-10 mb-3" />
                                        <span className="text-xl md:text-2xl font-bold font-geist-mono">My Group</span>
                                    </CardContent>
                                </Card>
                            </Link>
                            <Link href="#" className="group">
                                <Card className="flex flex-col items-center justify-center py-10 shadow-lg bg-[#ff6f1b] hover:bg-[#e65100] transition text-white rounded-xl group-hover:scale-[1.03] group-active:scale-100">
                                    <CardContent className="flex flex-col items-center">
                                        <BookOpen className="w-10 h-10 mb-3" />
                                        <span className="text-xl md:text-2xl font-bold font-geist-mono">My Sessions</span>
                                    </CardContent>
                    </Card>
                        </Link>
                            <Link href="#" className="group">
                                <Card className="flex flex-col items-center justify-center py-10 shadow-lg bg-[#8a004f] hover:bg-[#5a0033] transition text-white rounded-xl group-hover:scale-[1.03] group-active:scale-100">
                                    <CardContent className="flex flex-col items-center">
                                        <Code className="w-10 h-10 mb-3" />
                                        <span className="text-xl md:text-2xl font-bold font-geist-mono">Resources</span>
                                    </CardContent>
                    </Card>
                        </Link>
                            <Link href="/profile" className="group">
                                <Card className="flex flex-col items-center justify-center py-10 shadow-lg bg-[#002248] hover:bg-[#00132b] transition text-white rounded-xl group-hover:scale-[1.03] group-active:scale-100">
                                    <CardContent className="flex flex-col items-center">
                                        <Users className="w-10 h-10 mb-3" />
                                        <span className="text-xl md:text-2xl font-bold font-geist-mono">My Profile</span>
                                    </CardContent>
                    </Card>
                            </Link>
                        </div>
                </div>
                </section>

                {/* Debug View (hidden on mobile) */}
                <section className="hidden md:block w-full bg-white border-t">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Button
                        variant="link"
                        size="sm"
                            className="text-xs text-[#002248] underline mb-2"
                        onClick={() => setShowDebug((v) => !v)}
                    >
                        {showDebug ? 'Hide Debug View' : 'Show Debug View'}
                    </Button>
                    {showDebug && (
                        <div className="bg-white border border-gray-200 rounded-lg p-4 mt-2">
                            <h3 className="font-bold mb-2">Debug View</h3>
                            <pre className="text-xs text-gray-700 overflow-x-auto mb-4">{JSON.stringify({ user, loading }, null, 2)}</pre>
                            <UserProfile />
                        </div>
                    )}
                </div>
                </section>
            </main>
        </SidebarLayout>
    );
}
