"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, Edit, Save, Trash2, Plus, Shield, X } from "lucide-react";
import SidebarLayout from "@/components/SidebarLayout";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/components/AuthProvider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';

interface User {
  id: string;
  upi: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface Group {
  id: number;
  groupNumber: number;
  info: string;
  mentorId?: string;
  mentor?: User;
  mentees: User[];
}

export default function GroupAdminPage() {
  const { user, loading: userLoading } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const [menteeSearch, setMenteeSearch] = useState<{ [groupId: number]: string }>({});
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);

  const isAdmin = user && ["ADMIN", "SENIOR_MENTOR", "SUPERADMIN"].includes(user.role);

  useEffect(() => {
    if (!userLoading && isAdmin) {
      fetch("/api/admin/users")
        .then((res) => res.json())
        .then((data) => setAllUsers(data.users || []));
    }
  }, [user, userLoading, isAdmin]);

  useEffect(() => {
    if (!userLoading && isAdmin) {
      setLoading(true);
      fetch("/api/admin/groups")
        .then((res) => res.json())
        .then((data) => {
          setGroups(data.groups || []);
          setError(null);
        })
        .catch(() => setError("Failed to load group info."))
        .finally(() => setLoading(false));
    }
  }, [user, userLoading, isAdmin]);

  if (!isAdmin && !userLoading) {
    return (
      <SidebarLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Shield className="w-12 h-12 mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
            <p className="text-gray-600">You do not have permission to view this page.</p>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  if (userLoading || loading) {
    return (
      <SidebarLayout>
        <div className="min-h-screen flex flex-col">
          <main className="flex-1 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col items-center justify-center flex-1">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002248] mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading groups...</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </SidebarLayout>
    );
  }

  if (error) {
    return (
      <SidebarLayout>
        <div className="min-h-screen flex flex-col">
          <main className="flex-1 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col items-center justify-center flex-1">
                <div className="p-8 max-w-lg w-full text-center shadow-xl bg-white rounded-2xl">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-4 text-[#002248]">Error Loading Groups</h2>
                  <p className="mb-6 text-gray-700">{error}</p>
                  <Button onClick={() => window.location.reload()} className="bg-[#002248] hover:bg-[#003366]">Try Again</Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </SidebarLayout>
    );
  }

  const mentors = allUsers.filter((u) => u.role === "MENTOR");
  const students = allUsers.filter((u) => u.role === "STUDENT");

  const handleMentorChange = (groupId: number, mentorId: string) => {
    setGroups((groups) => groups.map((g) => (g.id === groupId ? { ...g, mentorId } : g)));
  };
  const handleMenteesChange = (groupId: number, menteeIds: string[]) => {
    setGroups((groups) => groups.map((g) => (g.id === groupId ? { ...g, mentees: students.filter((s: User) => menteeIds.includes(s.id)) } : g)));
  };
  const handleInfoChange = (groupId: number, info: string) => {
    setGroups((groups) => groups.map((g) => (g.id === groupId ? { ...g, info } : g)));
  };
  const handleSave = async (group: Group) => {
    setSaving(group.id);
    await fetch("/api/admin/groups", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: group.id,
        mentorId: group.mentorId || null,
        menteeIds: group.mentees.map((m: User) => m.id),
        info: group.info || "",
      }),
    });
    setSaving(null);
    setLoading(true);
    fetch("/api/admin/groups")
      .then((res) => res.json())
      .then((data) => setGroups(data.groups || []))
      .finally(() => setLoading(false));
  };
  const handleCreate = async () => {
    setCreating(true);
    await fetch("/api/admin/groups", { method: "POST" });
    setCreating(false);
    setLoading(true);
    fetch("/api/admin/groups")
      .then((res) => res.json())
      .then((data) => setGroups(data.groups || []))
      .finally(() => setLoading(false));
  };
  const handleDelete = async (groupId: number) => {
    if (!window.confirm("Are you sure you want to delete this group? This action cannot be undone.")) return;
    setDeleting(groupId);
    await fetch("/api/admin/groups", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: groupId }),
    });
    setDeleting(null);
    setLoading(true);
    fetch("/api/admin/groups")
      .then((res) => res.json())
      .then((data) => setGroups(data.groups || []))
      .finally(() => setLoading(false));
  };

  // Find the group being edited
  const editingGroup = groups.find(g => g.id === editingGroupId);

  return (
    <SidebarLayout>
      <PageHeader icon={<Shield className="w-10 h-10" />} title="Group Administration" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Header Actions */}
        <div className="flex justify-end items-center mb-8">
          <Button
            onClick={handleCreate}
            disabled={creating}
            className="bg-[#002248] hover:bg-[#003366] flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {creating ? "Creating..." : "Create New Group"}
          </Button>
        </div>

        {/* Groups List/Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mentor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mentees</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {groups.map(group => (
                <tr key={group.id} className="hover:bg-blue-50 cursor-pointer" onClick={() => setEditingGroupId(group.id)}>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-[#002248]">{group.groupNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {group.mentor ? (
                      <span>{group.mentor.firstName} {group.mentor.lastName}</span>
                    ) : (
                      <span className="text-gray-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{group.mentees?.length || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button size="sm" variant="outline" onClick={e => { e.stopPropagation(); setEditingGroupId(group.id); }}>Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sheet for editing group */}
        <Sheet open={!!editingGroupId} onOpenChange={open => setEditingGroupId(open ? editingGroupId : null)}>
          <SheetContent side="right" className="max-w-lg w-full">
            <SheetHeader>
              <SheetTitle>Edit Group {editingGroup?.groupNumber}</SheetTitle>
            </SheetHeader>
            {editingGroup && (
              <div className="space-y-6 p-2">
                {/* Mentor Assignment */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <UserCheck className="w-4 h-4" />
                    Mentor Assignment
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-[#002248] focus:border-transparent transition-all"
                    value={editingGroup.mentorId || editingGroup.mentor?.id || ""}
                    onChange={e => handleMentorChange(editingGroup.id, e.target.value)}
                  >
                    <option value="">Select a mentor...</option>
                    {mentors.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.firstName} {m.lastName} ({m.email})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mentees Assignment - revamped UI */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Users className="w-4 h-4" />
                    Mentees ({editingGroup.mentees?.length || 0} selected)
                  </label>
                  {/* Selected mentees as chips */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(editingGroup.mentees || []).map((mentee: User) => (
                      <span key={mentee.id} className="flex items-center bg-[#002248] text-white rounded-full px-3 py-1 text-xs font-medium">
                        {mentee.firstName} {mentee.lastName}
                        <button
                          aria-label={`Remove ${mentee.firstName} ${mentee.lastName}`}
                          className="ml-2 hover:text-red-300"
                          onClick={() => {
                            const newIds = editingGroup.mentees.filter((m: User) => m.id !== mentee.id).map((m: User) => m.id);
                            handleMenteesChange(editingGroup.id, newIds);
                          }}
                          type="button"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {(!editingGroup.mentees || editingGroup.mentees.length === 0) && (
                      <span className="text-xs text-gray-400">No mentees selected</span>
                    )}
                  </div>
                  {/* Search box */}
                  <input
                    type="text"
                    placeholder="Search students..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 text-sm"
                    value={menteeSearch[editingGroup.id] || ""}
                    onChange={e => setMenteeSearch(s => ({ ...s, [editingGroup.id]: e.target.value }))}
                  />
                  {/* Select All / Clear All */}
                  <div className="flex gap-2 mb-2">
                    <button
                      type="button"
                      className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 border border-gray-200"
                      onClick={() => handleMenteesChange(editingGroup.id, students.map(s => s.id))}
                      disabled={editingGroup.mentees?.length === students.length && students.length > 0}
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 border border-gray-200"
                      onClick={() => handleMenteesChange(editingGroup.id, [])}
                      disabled={!editingGroup.mentees || editingGroup.mentees.length === 0}
                    >
                      Clear All
                    </button>
                  </div>
                  {/* Scrollable list of checkboxes */}
                  <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto bg-white">
                    {students.filter(s =>
                      s.firstName.toLowerCase().includes((menteeSearch[editingGroup.id] || "").toLowerCase()) ||
                      s.lastName.toLowerCase().includes((menteeSearch[editingGroup.id] || "").toLowerCase()) ||
                      s.email.toLowerCase().includes((menteeSearch[editingGroup.id] || "").toLowerCase())
                    ).length === 0 && (
                      <div className="text-xs text-gray-400 p-3">No students found</div>
                    )}
                    {students.filter(s =>
                      s.firstName.toLowerCase().includes((menteeSearch[editingGroup.id] || "").toLowerCase()) ||
                      s.lastName.toLowerCase().includes((menteeSearch[editingGroup.id] || "").toLowerCase()) ||
                      s.email.toLowerCase().includes((menteeSearch[editingGroup.id] || "").toLowerCase())
                    ).map(s => (
                      <label key={s.id} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm">
                        <input
                          type="checkbox"
                          checked={!!editingGroup.mentees?.some((m: User) => m.id === s.id)}
                          onChange={e => {
                            let newIds;
                            if (e.target.checked) {
                              newIds = [...(editingGroup.mentees || []).map((m: User) => m.id), s.id];
                            } else {
                              newIds = (editingGroup.mentees || []).filter((m: User) => m.id !== s.id).map((m: User) => m.id);
                            }
                            handleMenteesChange(editingGroup.id, Array.from(new Set(newIds)));
                          }}
                        />
                        {s.firstName} {s.lastName} <span className="text-gray-400">({s.email})</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Group Info */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Edit className="w-4 h-4" />
                    Group Information
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-[#002248] focus:border-transparent transition-all resize-none"
                    rows={3}
                    placeholder="Add group information, meeting times, etc..."
                    value={editingGroup.info || ""}
                    onChange={e => handleInfoChange(editingGroup.id, e.target.value)}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button
                    onClick={() => handleSave(editingGroup)}
                    disabled={saving === editingGroup.id}
                    className="flex-1 bg-[#002248] hover:bg-[#003366] flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {saving === editingGroup.id ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(editingGroup.id)}
                    disabled={deleting === editingGroup.id}
                    className="flex items-center justify-center gap-2 px-4"
                  >
                    <Trash2 className="w-4 h-4" />
                    {deleting === editingGroup.id ? "Deleting..." : "Delete"}
                  </Button>
                  <SheetClose asChild>
                    <Button variant="outline">Close</Button>
                  </SheetClose>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>

        {groups.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Groups Yet</h3>
            <p className="text-gray-600 mb-4">Create your first mentor group to get started.</p>
            <Button onClick={handleCreate} disabled={creating} className="bg-[#002248] hover:bg-[#003366]">
              <Plus className="w-4 h-4 mr-2" />
              Create First Group
            </Button>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
} 