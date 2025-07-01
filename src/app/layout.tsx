import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'UCL App',
    description: 'UCL API Integration with NextJS',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <AuthProvider>
            {children}
        </AuthProvider>
        </body>
        </html>
    );
}