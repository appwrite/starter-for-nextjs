import { NextRequest, NextResponse } from 'next/server';
import { uclApiClient } from '@/lib/ucl-api';
import { createSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const result = searchParams.get('result');

    console.log('Callback received:', { code: code?.substring(0, 10) + '...', result, state });

    // Check if user denied access
    if (result === 'denied' || !code) {
        console.log('Access denied or no code received');
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=access_denied`);
    }

    try {
        const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback`;

        console.log('Exchanging code for token with redirect URI:', redirectUri);

        // Exchange code for token
        const accessToken = await uclApiClient.exchangeCodeForToken(code, redirectUri);
        console.log('Access token received:', accessToken.substring(0, 10) + '...');

        // Get user info
        const uclUser = await uclApiClient.getUserInfo(accessToken);
        console.log('User info received:', { email: uclUser.email, name: uclUser.full_name });

        // Create session
        const sessionToken = await createSession(uclUser);
        console.log('Session created');

        // Parse redirect destination
        let redirectTo = '/dashboard';
        if (state) {
            try {
                const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
                redirectTo = stateData.redirectTo || '/dashboard';
            } catch (e) {
                console.log('Invalid state data, using default redirect');
                console.log(e)
            }
        }

        // Set session cookie and redirect
        const response = NextResponse.redirect(`${process.env.NEXTAUTH_URL}${redirectTo}`);
        response.cookies.set('session', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60, // 24 hours
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Authentication error:', error);
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=auth_failed`);
    }
}