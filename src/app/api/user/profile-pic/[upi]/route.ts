import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { db } from '@/lib/db';
import fs from 'fs/promises';
import path from 'path';
import { createCanvas } from 'canvas';
import crypto from 'crypto';

export async function GET(
    request: NextRequest, 
    context: { params: Promise<{ upi: string }> }
) {
    try {
        // Verify authentication
        const sessionToken = request.cookies.get('session')?.value;
        if (!sessionToken) {
            return new NextResponse('Not authenticated', { status: 401 });
        }

        const user = await verifySession(sessionToken);
        if (!user) {
            return new NextResponse('Invalid session', { status: 401 });
        }

        // Await params as per Next.js 15+ requirements
        const { upi } = await context.params;
        
        if (!upi) {
            return new NextResponse('UPI is required', { status: 400 });
        }

        // Check for existing files with different extensions
        const extensions = ['webp', 'png', 'jpg', 'jpeg'];
        let existingFile: { path: string; stats: { mtime: Date; size: number }; contentType: string } | null = null;

        for (const ext of extensions) {
            const filePath = path.resolve(process.cwd(), 'public', 'profile-pics', `${upi}.${ext}`);
            try {
                const stats = await fs.stat(filePath);
                const contentType = ext === 'webp' ? 'image/webp' : 
                                  ext === 'png' ? 'image/png' : 'image/jpeg';
                existingFile = { path: filePath, stats, contentType };
                break;
            } catch {
                // File doesn't exist, continue to next extension
                continue;
            }
        }

        if (existingFile) {
            // Generate ETag based on file modification time and size
            const etag = `"${existingFile.stats.mtime.getTime()}-${existingFile.stats.size}"`;
            const lastModified = existingFile.stats.mtime.toUTCString();
            
            // Check if client has cached version
            const clientEtag = request.headers.get('if-none-match');
            const clientLastModified = request.headers.get('if-modified-since');
            
            if (clientEtag === etag || clientLastModified === lastModified) {
                return new NextResponse(null, {
                    status: 304,
                    headers: {
                        'ETag': etag,
                        'Last-Modified': lastModified,
                        'Cache-Control': 'private, max-age=3600, must-revalidate', // 1 hour with validation
                    },
                });
            }

            const imageBuffer = await fs.readFile(existingFile.path);
            return new NextResponse(imageBuffer, {
                status: 200,
                headers: {
                    'Content-Type': existingFile.contentType,
                    'ETag': etag,
                    'Last-Modified': lastModified,
                    'Cache-Control': 'private, max-age=3600, must-revalidate', // 1 hour with validation
                },
            });
        }

        // No existing file found, generate initials avatar
        console.log('Generating avatar for UPI:', upi);
        
        const dbUser = await db.user.findUnique({ 
            where: { upi },
            select: { firstName: true, lastName: true, updatedAt: true }
        });
        
        const initials = dbUser 
            ? (dbUser.firstName[0] + (dbUser.lastName?.[0] || '')).toUpperCase()
            : upi.slice(0, 2).toUpperCase();

        console.log('Generated initials:', initials);

        // Generate avatar with more robust canvas setup
        const canvas = createCanvas(256, 256);
        const ctx = canvas.getContext('2d');
        
        // Ensure context is available
        if (!ctx) {
            throw new Error('Failed to get canvas context');
        }
        
        // Background
        ctx.fillStyle = '#002248';
        ctx.fillRect(0, 0, 256, 256);
        
        // Text
        ctx.font = 'bold 120px Arial, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(initials, 128, 128);

        console.log('Canvas created, generating buffer...');

        // Generate PNG buffer (most reliable)
        let buffer: Buffer;
        try {
            buffer = canvas.toBuffer('image/png');
            console.log('PNG buffer generated, size:', buffer?.length);
        } catch (error) {
            console.error('Failed to generate PNG buffer:', error);
            throw new Error('Canvas toBuffer failed');
        }

        // Validate buffer
        if (!buffer || buffer.length === 0) {
            console.error('Buffer is empty or undefined');
            throw new Error('Generated buffer is empty');
        }

        // Save as PNG
        const filePath = path.resolve(process.cwd(), 'public', 'profile-pics', `${upi}.png`);
        
        // Ensure directory exists
        const dir = path.dirname(filePath);
        await fs.mkdir(dir, { recursive: true });
        
        console.log('Saving image to:', filePath);
        await fs.writeFile(filePath, buffer);
        console.log('Image saved successfully');

        // Generate ETag for generated image
        const contentHash = crypto.createHash('md5').update(buffer).digest('hex');
        const etag = `"generated-${contentHash}"`;
        const lastModified = new Date().toUTCString();

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'image/png',
                'ETag': etag,
                'Last-Modified': lastModified,
                'Cache-Control': 'private, max-age=1, must-revalidate', // 5 minutes
            },
        });

    } catch (error) {
        console.error('Error serving profile picture:', error);
        
        // Return a simple SVG fallback as last resort
        const { upi } = await context.params;
        const dbUser = await db.user.findUnique({ 
            where: { upi },
            select: { firstName: true, lastName: true }
        });
        
        const initials = dbUser 
            ? (dbUser.firstName[0] + (dbUser.lastName?.[0] || '')).toUpperCase()
            : upi.slice(0, 2).toUpperCase();

        const svgFallback = `
            <svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
                <rect width="256" height="256" fill="#002248"/>
                <text x="128" y="140" text-anchor="middle" fill="white" font-size="120" font-family="Arial, sans-serif" font-weight="bold">${initials}</text>
            </svg>
        `;

        // No caching for error fallback
        return new NextResponse(svgFallback, {
            status: 200,
            headers: {
                'Content-Type': 'image/svg+xml',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
        });
    }
}