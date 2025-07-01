'use client';

import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import MenuBar from '@/components/MenuBar';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
    const { user, login, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push('/dashboard');
        }
    }, [user, router]);

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

    return (
        <div className="min-h-screen bg-white border border-[#a78bfa]">
            <MenuBar showSignIn={false} />
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-7rem)]">
                <h1 className="text-5xl font-bold text-[#002855] mb-10 mt-10">Sign In</h1>
                <Button
                    onClick={login}
                    size="lg"
                    className="flex items-center gap-3 bg-[#002855] text-white text-xl font-semibold rounded-full px-8 py-4 shadow hover:bg-[#003366] transition"
                >
                    <span className="bg-white rounded-full w-8 h-8 flex items-center justify-center text-[#002855] font-bold text-lg">🏛️</span>
                    Sign in with UCL
                </Button>
            </div>
        </div>
    );
}