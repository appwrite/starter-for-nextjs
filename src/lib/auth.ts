// import { SignJWT, jwtVerify } from 'jose';
import { SignJWT } from 'jose';
import { AuthUser, UCLUser, UserRole } from '@/types/auth';
import { db } from './db';
import { getUserPermissions } from './rbac';
import { Role as PrismaRole } from '@prisma/client';

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);

export async function createSession(uclUser: UCLUser): Promise<string> {
    try {
        // Check if user exists in database
        let dbUser = await db.user.findUnique({
            where: { email: uclUser.email }
        });

        // Create user if doesn't exist
        if (!dbUser) {
            const role = determineUserRole(uclUser);
            dbUser = await db.user.create({
                data: {
                    email: uclUser.email,
                    firstName: uclUser.given_name,
                    lastName: uclUser.sn || uclUser.full_name.split(' ').pop() || 'Unknown',
                    upi: uclUser.upi,
                    studentId: uclUser.student_id,
                    staffId: uclUser.staff_id,
                    department: uclUser.department,
                    role: role as PrismaRole,
                }
            });
        }

        // Create JWT token
        const token = await new SignJWT({
            userId: dbUser.id,
            email: dbUser.email,
            role: dbUser.role,
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('24h')
            .sign(JWT_SECRET);

        // Store session in database
        await db.session.create({
            data: {
                userId: dbUser.id,
                token,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            }
        });

        return token;
    } catch (error) {
        console.error('Database operation failed:', error);

        // If database fails, try to disconnect and reconnect
        if (error instanceof Error && error.message.includes('prepared statement')) {
            console.log('Attempting database reconnection...');
            await db.$disconnect();
            await db.$connect();

            // Retry the operation once
            return createSession(uclUser);
        }

        throw error;
    }
}

export async function verifySession(token: string): Promise<AuthUser | null> {
    try {
        // const { payload } = await jwtVerify(token, JWT_SECRET);

        const session = await db.session.findUnique({
            where: { token },
            include: { user: true }
        });

        if (!session || session.expiresAt < new Date()) {
            return null;
        }

        const userRole = session.user.role as UserRole;
        const permissions = getUserPermissions(userRole);

        return {
            id: session.user.id,
            email: session.user.email,
            given_name: session.user.firstName,
            family_name: session.user.lastName,
            sn: session.user.lastName,
            full_name: `${session.user.firstName} ${session.user.lastName}`,
            cn: session.user.firstName,
            department: session.user.department,
            student_id: session.user.studentId || undefined,
            staff_id: session.user.staffId || undefined,
            is_student: userRole === UserRole.STUDENT,
            is_staff: userRole === UserRole.MENTOR || userRole === UserRole.SENIOR_MENTOR || userRole === UserRole.ADMIN || userRole === UserRole.SUPERADMIN,
            upi: session.user.upi,
            role: userRole,
            permissions: permissions.map(p => `${p.resource}:${p.action}`),
        };
    } catch (error) {
        console.error('Session verification failed:', error);
        return null;
    }
}

export async function deleteSession(token: string): Promise<void> {
    try {
        await db.session.delete({
            where: { token }
        });
    } catch (error) {
        console.error('Session deletion failed:', error);
        // Don't throw error for session deletion failures
    }
}

function determineUserRole(uclUser: UCLUser): UserRole {
    // TODO: Implement advanced logic for Senior Mentor, Admin, Superadmin
    const mentorGroups = ['programmingtutors2425'];
    const seniorMentorGroups = ['SPT2425'];


    const isMentor = uclUser.ucl_groups?.some(group =>
        mentorGroups.some(mentorGroup => group.toLowerCase().includes(mentorGroup.toLowerCase()))
    );

    const isSeniorMentor = uclUser.ucl_groups?.some(group =>
        seniorMentorGroups.some(seniorMentorGroup => group.toLowerCase().includes(seniorMentorGroup.toLowerCase()))
    );

    if (isSeniorMentor) return UserRole.SENIOR_MENTOR;
    if (isMentor) return UserRole.MENTOR;
    if (uclUser.is_student) return UserRole.STUDENT;
    return UserRole.STUDENT; // Default fallback
}

// Utility to log denied access attempts
export function logDeniedAccess({ user, route, reason }: { user: AuthUser | null, route: string, reason: string }) {
    const userInfo = user ? `User ${user.email} (ID: ${user.id}, Role: ${user.role})` : 'Unauthenticated user';
    console.warn(`[SECURITY] Access denied on route '${route}': ${reason}. ${userInfo}`);
}