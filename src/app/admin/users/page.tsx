"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiX,
  HiCheck,
  HiRefresh,
} from "react-icons/hi";

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "superadmin";
  createdAt: string;
}

export default function UsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin" as "admin" | "superadmin",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingRole, setEditingRole] = useState<string | null>(null);

  const currentUserId = (session?.user as { id?: string })?.id;
  const userRole = (session?.user as { role?: string })?.role;

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (userRole === "superadmin") {
      fetchUsers();
    }
  }, [userRole]);

  // Access check
  if (userRole !== "superadmin") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-lg bg-red-50 border border-red-200 p-8 text-center max-w-md">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <HiX className="h-7 w-7 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-red-800 mb-2">Access Denied</h2>
          <p className="text-red-600">
            You do not have permission to access this page. Only superadmins can
            manage users.
          </p>
        </div>
      </div>
    );
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create user");
        return;
      }

      setUsers((prev) => [data, ...prev]);
      setFormData({ name: "", email: "", password: "", role: "admin" });
      setShowForm(false);
      setSuccess("User created successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Failed to create user");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRoleChange(userId: string, newRole: "admin" | "superadmin") {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? updatedUser : u))
        );
        setEditingRole(null);
        setSuccess("Role updated successfully");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update role");
      }
    } catch {
      setError("Failed to update role");
    }
  }

  async function handleDelete(userId: string, userName: string) {
    if (!confirm(`Are you sure you want to delete user "${userName}"?`)) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
        setSuccess("User deleted successfully");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to delete user");
      }
    } catch {
      setError("Failed to delete user");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
          <p className="mt-1 text-sm text-gray-500">
            Add, edit roles, and remove admin users.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand/90"
        >
          {showForm ? <HiX className="h-4 w-4" /> : <HiPlus className="h-4 w-4" />}
          {showForm ? "Cancel" : "Add User"}
        </button>
      </div>

      {/* Feedback */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
          <button onClick={() => setError("")} className="ml-2 font-medium underline">
            Dismiss
          </button>
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          <HiCheck className="mr-1 inline h-4 w-4" />
          {success}
        </div>
      )}

      {/* Add User Form */}
      {showForm && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Add New User
          </h2>
          <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                placeholder="user@example.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                placeholder="Min 6 characters"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value as "admin" | "superadmin",
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand/90 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <HiRefresh className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <HiPlus className="h-4 w-4" />
                    Create User
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
          </div>
        ) : users.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-500">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 font-medium text-gray-500">Name</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Email</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Role</th>
                  <th className="px-6 py-3 font-medium text-gray-500">
                    Created
                  </th>
                  <th className="px-6 py-3 font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => {
                  const isSelf = user._id === currentUserId;
                  return (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-accent text-xs font-bold text-white">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span>
                            {user.name}
                            {isSelf && (
                              <span className="ml-2 text-xs text-gray-400">
                                (you)
                              </span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                        {user.email}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {editingRole === user._id ? (
                          <select
                            defaultValue={user.role}
                            onChange={(e) =>
                              handleRoleChange(
                                user._id,
                                e.target.value as "admin" | "superadmin"
                              )
                            }
                            onBlur={() => setEditingRole(null)}
                            autoFocus
                            className="rounded border border-gray-300 px-2 py-1 text-xs focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                          >
                            <option value="admin">Admin</option>
                            <option value="superadmin">Superadmin</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-flex cursor-pointer rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              user.role === "superadmin"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                            onClick={() => setEditingRole(user._id)}
                            title="Click to change role"
                          >
                            {user.role}
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingRole(user._id)}
                            className="rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-brand"
                            title="Edit role"
                          >
                            <HiPencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user._id, user.name)}
                            disabled={isSelf}
                            className={`rounded p-1.5 transition-colors ${
                              isSelf
                                ? "cursor-not-allowed text-gray-200"
                                : "text-gray-400 hover:bg-red-50 hover:text-red-600"
                            }`}
                            title={
                              isSelf
                                ? "Cannot delete your own account"
                                : "Delete user"
                            }
                          >
                            <HiTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
