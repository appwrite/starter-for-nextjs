'use client';

import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { MenuBar } from '@/components/MenuBar';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

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
            <div className="min-h-screen flex items-center justify-center bg-[#f7f8fa]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f8fa] flex flex-col">
            <MenuBar hideSignInButton />
            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center mt-8">
                <div className="flex items-center gap-4 mb-6">
    <Image src="/uclcs-logo.jpeg" alt="UCL CS Logo" width={80} height={80} />
    <Image src="/myPM-logo.png" alt="myPM Logo" width={80} height={80} />
</div>

                
                    <h1 className="text-2xl font-bold mb-8 text-center">Sign in to myPM</h1>
                    <Button
                        onClick={login}
                        className="w-full flex items-center justify-center gap-3 bg-[#002248] text-white font-mono font-semibold rounded-md px-6 py-3 text-base shadow hover:bg-[#003366] transition mb-4"
                        size="lg"
                    >
                        <Image src="/portico-logo.png" alt="Portico Logo" width={20} height={20} />
                        Sign in with UCL
                    </Button>
                    <Link href="/" className="mt-2 text-sm text-[#002248] hover:underline">Back to Home</Link>
                </div>
            </div>
        </div>
    );
}