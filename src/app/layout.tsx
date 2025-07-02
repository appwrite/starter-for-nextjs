import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'UCL myPM',
    description: 'UCL Computer Science Programming Mentorship Platform',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
        </head>
        <body className={inter.className}>
        <AuthProvider>
            {children}
        </AuthProvider>
        </body>
        </html>
    );
}