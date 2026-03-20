"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  HiNewspaper,
  HiDocument,
  HiPhotograph,
  HiMail,
  HiUsers,
  HiViewGrid,
  HiPlus,
  HiUpload,
  HiEye,
} from "react-icons/hi";

interface DashboardStats {
  news: number;
  resources: number;
  gallery: number;
  messages: number;
  unreadMessages: number;
  users: number;
  sectors: number;
  [key: string]: number;
}

interface Message {
  _id: string;
  name: string;
  subject: string;
  createdAt: string;
  read: boolean;
}

const statCards = [
  {
    key: "news" as const,
    label: "News Articles",
    icon: HiNewspaper,
    color: "bg-blue-500",
    lightColor: "bg-blue-100 text-blue-600",
  },
  {
    key: "resources" as const,
    label: "Resources",
    icon: HiDocument,
    color: "bg-green-500",
    lightColor: "bg-green-100 text-green-600",
  },
  {
    key: "gallery" as const,
    label: "Gallery Items",
    icon: HiPhotograph,
    color: "bg-purple-500",
    lightColor: "bg-purple-100 text-purple-600",
  },
  {
    key: "messages" as const,
    label: "Messages",
    icon: HiMail,
    color: "bg-orange-500",
    lightColor: "bg-orange-100 text-orange-600",
    badgeKey: "unreadMessages" as const,
  },
  {
    key: "users" as const,
    label: "Users",
    icon: HiUsers,
    color: "bg-teal-500",
    lightColor: "bg-teal-100 text-teal-600",
  },
  {
    key: "sectors" as const,
    label: "Sectors",
    icon: HiViewGrid,
    color: "bg-red-500",
    lightColor: "bg-red-100 text-red-600",
  },
];

function StatCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <div className="h-4 w-20 rounded bg-gray-200" />
          <div className="h-8 w-12 rounded bg-gray-200" />
        </div>
        <div className="h-12 w-12 rounded-full bg-gray-200" />
      </div>
    </div>
  );
}

function MessageSkeleton() {
  return (
    <div className="animate-pulse flex items-center gap-4 border-b border-gray-100 px-4 py-3 last:border-0">
      <div className="h-2.5 w-2.5 rounded-full bg-gray-200" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-32 rounded bg-gray-200" />
        <div className="h-3 w-48 rounded bg-gray-200" />
      </div>
      <div className="h-3 w-20 rounded bg-gray-200" />
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/dashboard", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      } finally {
        setLoadingStats(false);
      }
    }

    async function fetchMessages() {
      try {
        const res = await fetch("/api/admin/messages", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : data.messages ?? [];
          setMessages(list.slice(0, 5));
        }
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      } finally {
        setLoadingMessages(false);
      }
    }

    fetchStats();
    fetchMessages();
  }, []);

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your site content and activity.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loadingStats
          ? Array.from({ length: 6 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))
          : statCards.map((card) => {
              const Icon = card.icon;
              const value = stats?.[card.key] ?? 0;
              const badge =
                "badgeKey" in card && card.badgeKey
                  ? stats?.[card.badgeKey] ?? 0
                  : 0;

              return (
                <div
                  key={card.key}
                  className="relative rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {card.label}
                      </p>
                      <p className="mt-1 text-3xl font-bold text-gray-900">
                        {value}
                      </p>
                    </div>
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full ${card.lightColor}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>

                  {/* Unread badge for messages */}
                  {badge > 0 && (
                    <span className="absolute right-4 top-4 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-orange-500 px-1.5 text-[10px] font-bold text-white">
                      {badge}
                    </span>
                  )}
                </div>
              );
            })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 font-heading text-lg font-semibold text-gray-900">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/news/new"
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand/90"
          >
            <HiPlus className="h-4 w-4" />
            Add News
          </Link>
          <Link
            href="/admin/gallery"
            className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-purple-700"
          >
            <HiUpload className="h-4 w-4" />
            Upload Photo
          </Link>
          <Link
            href="/admin/messages"
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-orange-600"
          >
            <HiEye className="h-4 w-4" />
            View Messages
          </Link>
        </div>
      </div>

      {/* Recent Messages */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-gray-900">
            Recent Messages
          </h2>
          <Link
            href="/admin/messages"
            className="text-sm font-medium text-brand hover:text-brand/80 transition-colors"
          >
            View all
          </Link>
        </div>
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          {loadingMessages ? (
            Array.from({ length: 5 }).map((_, i) => (
              <MessageSkeleton key={i} />
            ))
          ) : messages.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-400">
              No messages yet.
            </div>
          ) : (
            <ul>
              {messages.map((msg) => (
                <li
                  key={msg._id}
                  className="flex items-center gap-4 border-b border-gray-100 px-4 py-3 last:border-0 hover:bg-gray-50 transition-colors"
                >
                  {/* Read status dot */}
                  <span
                    className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${
                      msg.read ? "bg-gray-300" : "bg-brand-accent"
                    }`}
                    title={msg.read ? "Read" : "Unread"}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {msg.name}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {msg.subject}
                    </p>
                  </div>
                  <time className="flex-shrink-0 text-xs text-gray-400">
                    {new Date(msg.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
