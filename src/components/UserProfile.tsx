'use client';

import { useAuth } from './AuthProvider';
import { hasPermission, PERMISSIONS } from '@/lib/rbac';

export function UserProfile() {
    const { user, logout } = useAuth();

    if (!user) return null;

    const canManageUsers = hasPermission(user.role, PERMISSIONS.ADMIN_READ);

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">User Profile</h2>
                <button
                    onClick={logout}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>

            <div className="space-y-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="text-sm text-gray-900">{user.full_name}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{user.email}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <p className="text-sm text-gray-900">{user.department}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'STUDENT' ? 'bg-blue-100 text-blue-800' :
                            user.role === 'STAFF' ? 'bg-green-100 text-green-800' :
                                'bg-purple-100 text-purple-800'
                    }`}>
            {user.role}
          </span>
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
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                Student
              </span>
                        )}
                        {user.is_staff && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                Staff
              </span>
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
        </div>
    );
}