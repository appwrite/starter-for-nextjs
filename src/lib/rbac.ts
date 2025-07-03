import { UserRole } from '@/types/auth';

export interface Permission {
    resource: string;
    action: string;
}

export const PERMISSIONS = {
    // User permissions
    USER_READ: { resource: 'user', action: 'read' },
    USER_UPDATE: { resource: 'user', action: 'update' },
    USER_DELETE: { resource: 'user', action: 'delete' },

    // Admin permissions
    ADMIN_READ: { resource: 'admin', action: 'read' },
    ADMIN_WRITE: { resource: 'admin', action: 'write' },

    // Timetable permissions
    TIMETABLE_READ: { resource: 'timetable', action: 'read' },
    TIMETABLE_WRITE: { resource: 'timetable', action: 'write' },
} as const;

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    [UserRole.STUDENT]: [
        PERMISSIONS.USER_READ,
        PERMISSIONS.USER_UPDATE,
        PERMISSIONS.TIMETABLE_READ,
    ],
    [UserRole.MENTOR]: [
        PERMISSIONS.USER_READ,
        PERMISSIONS.USER_UPDATE,
        PERMISSIONS.TIMETABLE_READ,
        PERMISSIONS.TIMETABLE_WRITE,
    ],
    [UserRole.SENIOR_MENTOR]: [
        PERMISSIONS.USER_READ,
        PERMISSIONS.USER_UPDATE,
        PERMISSIONS.TIMETABLE_READ,
        PERMISSIONS.TIMETABLE_WRITE,
        // Add more senior mentor permissions here if needed
    ],
    [UserRole.ADMIN]: [
        PERMISSIONS.USER_READ,
        PERMISSIONS.USER_UPDATE,
        PERMISSIONS.USER_DELETE,
        PERMISSIONS.ADMIN_READ,
        PERMISSIONS.ADMIN_WRITE,
        PERMISSIONS.TIMETABLE_READ,
        PERMISSIONS.TIMETABLE_WRITE,
    ],
    [UserRole.SUPERADMIN]: [
        PERMISSIONS.USER_READ,
        PERMISSIONS.USER_UPDATE,
        PERMISSIONS.USER_DELETE,
        PERMISSIONS.ADMIN_READ,
        PERMISSIONS.ADMIN_WRITE,
        PERMISSIONS.TIMETABLE_READ,
        PERMISSIONS.TIMETABLE_WRITE,
        // Add more superadmin permissions here if needed
    ],
};

export function hasPermission(userRole: UserRole, permission: Permission): boolean {
    const rolePermissions = ROLE_PERMISSIONS[userRole];
    if (!rolePermissions || !Array.isArray(rolePermissions)) {
        return false;
    }

    return rolePermissions.some(
        p => p.resource === permission.resource && p.action === permission.action
    );
}

export function getUserPermissions(role: UserRole): Permission[] {
    return ROLE_PERMISSIONS[role] || [];
}