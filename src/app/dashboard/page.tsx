'use client';

import { useAuth } from '@/components/AuthProvider';
import { UserProfile } from '@/components/UserProfile';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import MenuBar from '@/components/MenuBar';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const [showDebug, setShowDebug] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
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

    return (
        <div className="min-h-screen bg-[#f7f8fa]">
            <MenuBar />
            <div className="max-w-7xl mx-auto py-8 px-4">
                {/* Welcome Section */}
                <h1 className="text-4xl font-bold text-[#002855] flex items-center gap-2 mb-8 mt-4">
                    <span role="img" aria-label="wave">👋</span> Welcome, {user.given_name}!
                </h1>

                {/* Announcements */}
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-[#002855] flex items-center gap-2 mb-2">
                        <span role="img" aria-label="announcements">📢</span> Announcements
                    </h2>
                    <Card className="mb-1">
                        <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between bg-[#cfd8e3] rounded-lg px-4 py-3">
                            <span className="font-semibold">[18 Mar 2026]</span> <span className="ml-2">Open sessions are now available to book!</span>
                        </CardContent>
                    </Card>
                    <div className="text-right text-sm font-semibold mt-1">
                        <Link href="#" className="hover:underline">See past announcements →</Link>
                    </div>
                </div>

                {/* Main Dashboard Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <Card className="flex flex-col items-center justify-center py-10 shadow-lg bg-[#009688] hover:bg-[#00796b] transition text-white">
                        <Link href="#" className="flex flex-col items-center">
                            <span className="text-4xl mb-3">👤</span>
                            <span className="text-2xl font-bold">My Group</span>
                        </Link>
                    </Card>
                    <Card className="flex flex-col items-center justify-center py-10 shadow-lg bg-[#ff6f1b] hover:bg-[#e65100] transition text-white">
                        <Link href="#" className="flex flex-col items-center">
                            <span className="text-4xl mb-3">📅</span>
                            <span className="text-2xl font-bold">My Sessions</span>
                        </Link>
                    </Card>
                    <Card className="flex flex-col items-center justify-center py-10 shadow-lg bg-[#8a004f] hover:bg-[#5a0033] transition text-white">
                        <Link href="#" className="flex flex-col items-center">
                            <span className="text-4xl mb-3">📖</span>
                            <span className="text-2xl font-bold">Resources</span>
                        </Link>
                    </Card>
                </div>

                {/* Debug View */}
                <div className="mb-8">
                    <Button
                        variant="link"
                        size="sm"
                        className="text-xs text-[#002855] underline mb-2"
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
            </div>
        </div>
    );
}
