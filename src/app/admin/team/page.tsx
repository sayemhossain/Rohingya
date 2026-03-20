"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiX,
  HiCheck,
  HiRefresh,
  HiPhotograph,
} from "react-icons/hi";

interface TeamMemberData {
  _id: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
  order: number;
  createdAt: string;
}

const emptyForm = {
  name: "",
  role: "",
  bio: "",
  photo: "",
  order: 0,
};

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMemberData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function fetchMembers() {
    setLoading(true);
    try {
      const res = await fetch("/api/team");
      if (res.ok) {
        const json = await res.json();
        setMembers(json.data || []);
      }
    } catch {
      setError("Failed to load team members");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMembers();
  }, []);

  function openAddForm() {
    setEditingId(null);
    setFormData({ ...emptyForm, order: members.length });
    setShowForm(true);
  }

  function openEditForm(member: TeamMemberData) {
    setEditingId(member._id);
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio || "",
      photo: member.photo || "",
      order: member.order,
    });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => ({ ...prev, photo: data.url || data.secure_url || "" }));
      } else {
        setError("Failed to upload photo");
      }
    } catch {
      setError("Failed to upload photo");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const url = editingId ? `/api/team/${editingId}` : "/api/team";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Failed to save team member");
        return;
      }

      if (editingId) {
        setMembers((prev) =>
          prev.map((m) => (m._id === editingId ? json.data : m))
        );
        setSuccess("Team member updated successfully");
      } else {
        setMembers((prev) => [...prev, json.data]);
        setSuccess("Team member added successfully");
      }

      closeForm();
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Failed to save team member");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/team/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMembers((prev) => prev.filter((m) => m._id !== id));
        setSuccess("Team member deleted successfully");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const json = await res.json();
        setError(json.error || "Failed to delete team member");
      }
    } catch {
      setError("Failed to delete team member");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Team</h1>
          <p className="mt-1 text-sm text-gray-500">
            Add, edit, and manage team members displayed on the site.
          </p>
        </div>
        <button
          onClick={showForm ? closeForm : openAddForm}
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand/90"
        >
          {showForm ? (
            <>
              <HiX className="h-4 w-4" />
              Cancel
            </>
          ) : (
            <>
              <HiPlus className="h-4 w-4" />
              Add Member
            </>
          )}
        </button>
      </div>

      {/* Feedback */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
          <button
            onClick={() => setError("")}
            className="ml-2 font-medium underline"
          >
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

      {/* Add / Edit Form */}
      {showForm && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            {editingId ? "Edit Team Member" : "Add New Team Member"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
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
                  Role / Job Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  placeholder="e.g., Program Director"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                placeholder="Short biography..."
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Photo
                </label>
                <div className="flex items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50">
                    <HiPhotograph className="h-4 w-4" />
                    {uploading ? "Uploading..." : "Choose File"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  {formData.photo && (
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-gray-200">
                      <Image
                        src={formData.photo}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Display Order
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting || uploading}
                className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand/90 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <HiRefresh className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <HiCheck className="h-4 w-4" />
                    {editingId ? "Update Member" : "Add Member"}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Team Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
        </div>
      ) : members.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 py-12 text-center">
          <HiPhotograph className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-2 text-sm text-gray-500">
            No team members yet. Add your first member above.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <div
              key={member._id}
              className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Photo or gradient */}
              <div className="relative h-48 w-full overflow-hidden">
                {member.photo ? (
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand to-brand-accent">
                    <span className="text-5xl font-bold text-white/80">
                      {member.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                {/* Order badge */}
                <div className="absolute left-3 top-3 rounded-full bg-black/50 px-2 py-0.5 text-xs font-medium text-white">
                  #{member.order}
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="text-base font-semibold text-gray-900">
                  {member.name}
                </h3>
                <p className="mt-0.5 text-sm font-medium text-brand">
                  {member.role}
                </p>
                {member.bio && (
                  <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                    {member.bio}
                  </p>
                )}

                {/* Actions */}
                <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3">
                  <button
                    onClick={() => openEditForm(member)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-brand"
                  >
                    <HiPencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member._id, member.name)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                  >
                    <HiTrash className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
