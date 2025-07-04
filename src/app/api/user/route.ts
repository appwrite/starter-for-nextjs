import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { hasPermission, PERMISSIONS } from '@/lib/rbac';
import { logDeniedAccess } from '@/lib/auth';
import path from 'path';
import sharp from 'sharp';
import fsPromises from 'fs/promises';

export async function GET(request: NextRequest) {
    const sessionToken = request.cookies.get('session')?.value;

    if (!sessionToken) {
        return NextResponse.json({ error: 'No session' }, { status: 401 });
    }

    const user = await verifySession(sessionToken);

    if (!user) {
        return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // Authorization: user:read
    if (!hasPermission(user.role, PERMISSIONS.USER_READ)) {
        logDeniedAccess({ user, route: '/api/user', reason: 'Missing user:read permission' });
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ user });
}

export async function POST(request: NextRequest) {
    const sessionToken = request.cookies.get('session')?.value;
    if (!sessionToken) {
        return NextResponse.json({ error: 'No session' }, { status: 401 });
    }
    const user = await verifySession(sessionToken);
    if (!user) {
        return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }
    // Authorization: user:update
    if (!hasPermission(user.role, PERMISSIONS.USER_UPDATE)) {
        logDeniedAccess({ user, route: '/api/user', reason: 'Missing user:update permission for profile picture upload' });
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    // Only allow the user to update their own profile picture
    const upi = user.upi;
    const formData = await request.formData();
    const file = formData.get('profilePic');
    if (!file || typeof file === 'string') {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    // Delete any existing files for this UPI
    const extensions = ['webp', 'png', 'jpg', 'jpeg'];
    for (const ext of extensions) {
        const filePath = path.resolve(process.cwd(), 'public', 'profile-pics', `${upi}.${ext}`);
        try { await fsPromises.unlink(filePath); } catch {}
    }
    // Convert to PNG and save
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = `${upi}.png`;
    const filePath = path.resolve(process.cwd(), 'public', 'profile-pics', fileName);
    await sharp(buffer).resize(256, 256).png({ quality: 90 }).toFile(filePath);
    return NextResponse.json({ success: true });
}