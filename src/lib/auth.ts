import { SignJWT, jwtVerify } from 'jose';
import { AuthUser, UCLUser, UserRole } from '@/types/auth';
import { db } from './db';
import { getUserPermissions } from './rbac';

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
                    role: role,
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
        const { payload } = await jwtVerify(token, JWT_SECRET);

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
            is_staff: userRole === UserRole.STAFF || userRole === UserRole.ADMIN,
            upi: session.user.upi,
            role: userRole,
            permissions: permissions.map(p => `${p.resource}:${p.action}`)
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

function determineUserRole(uclUser: UCLUser): 'STUDENT' | 'STAFF' | 'ADMIN' {
    // Check for staff groups
    const staffGroups = ['csc.sg.allstaff', 'allstaff'];
    const hasStaffGroup = uclUser.ucl_groups?.some(group =>
        staffGroups.some(staffGroup => group.toLowerCase().includes(staffGroup.toLowerCase()))
    );

    if (hasStaffGroup) return 'STAFF';
    if (uclUser.is_student) return 'STUDENT';

    return 'STUDENT'; // Default fallback
}