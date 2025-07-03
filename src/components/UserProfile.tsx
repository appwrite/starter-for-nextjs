'use client';

import { useAuth } from './AuthProvider';
import { hasPermission, PERMISSIONS } from '@/lib/rbac';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function UserProfile() {
    const { user, logout } = useAuth();

    if (!user) return null;

    const canManageUsers = hasPermission(user.role, PERMISSIONS.ADMIN_READ);

    return (
        <Card className="max-w-lg mx-auto p-6">
            <CardContent className="p-0">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                            <AvatarImage src={undefined} alt={user.given_name} />
                            <AvatarFallback>{user.given_name?.[0] ?? '?'}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-xl font-semibold">{user.full_name}</h2>
                            <span className="text-xs text-gray-500">{user.email}</span>
                        </div>
                    </div>
                    <Button onClick={logout} variant="destructive" size="sm">Logout</Button>
                </div>
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Department</label>
                        <p className="text-sm text-gray-900">{user.department}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'STUDENT' ? 'bg-blue-100 text-blue-800' :
                            user.role === 'MENTOR' ? 'bg-green-100 text-green-800' :
                            user.role === 'SENIOR_MENTOR' ? 'bg-yellow-100 text-yellow-800' :
                            user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                            user.role === 'SUPERADMIN' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>{user.role}</span>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">UPI</label>
                        <p className="text-sm text-gray-900">{user.upi}</p>
                    </div>
                    {user.student_id && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Student ID</label>
                            <p className="text-sm text-gray-900">{user.student_id}</p>
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Account Type</label>
                        <div className="flex gap-2">
                            {user.is_student && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Student</span>
                            )}
                            {user.role === 'MENTOR' && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Mentor</span>
                            )}
                            {user.role === 'SENIOR_MENTOR' && (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Senior Mentor</span>
                            )}
                            {user.role === 'ADMIN' && (
                                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">Admin</span>
                            )}
                            {user.role === 'SUPERADMIN' && (
                                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Superadmin</span>
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Permissions</label>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {user.permissions && user.permissions.length > 0 ? (
                                user.permissions.map(permission => (
                                    <span
                                        key={permission}
                                        className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded"
                                    >
                                        {permission}
                                    </span>
                                ))
                            ) : (
                                <span className="text-sm text-gray-500">No permissions assigned</span>
                            )}
                        </div>
                    </div>
                    {canManageUsers && (
                        <div className="pt-4 border-t">
                            <h3 className="font-medium text-gray-900">Admin Actions</h3>
                            <p className="text-sm text-gray-600">You have administrative permissions</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}