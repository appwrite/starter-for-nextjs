import { NextRequest, NextResponse } from 'next/server';
import { uclApiClient } from '@/lib/ucl-api';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const redirectTo = searchParams.get('redirect') || '/dashboard';

    const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback`;
    const state = Buffer.from(JSON.stringify({ redirectTo })).toString('base64');

    console.log('Generating auth URL with redirect URI:', redirectUri);

    const authUrl = uclApiClient.getAuthUrl(redirectUri, state);

    return NextResponse.redirect(authUrl);
}