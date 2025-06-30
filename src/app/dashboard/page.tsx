'use client';

import { useAuth } from '@/components/AuthProvider';
import { UserProfile } from '@/components/UserProfile';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

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
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">
                        Welcome, {user.given_name}!
                    </h1>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <UserProfile />

                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                            <div className="space-y-3">
                                <button className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg">
                                    View Timetable
                                </button>
                                <button className="w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 rounded-lg">
                                    Check Grades
                                </button>
                                <button className="w-full text-left px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-lg">
                                    Library Services
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
