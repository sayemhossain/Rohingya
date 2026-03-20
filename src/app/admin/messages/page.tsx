"use client";

import { useState, useEffect } from "react";
import {
  HiMail,
  HiMailOpen,
  HiTrash,
  HiEye,
  HiEyeOff,
  HiChevronDown,
  HiChevronUp,
} from "react-icons/hi";

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

type FilterTab = "all" | "unread" | "read";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/admin/messages");
      const data = await res.json();
      if (Array.isArray(data)) {
        setMessages(data);
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const unreadCount = messages.filter((m) => !m.read).length;

  const filteredMessages = messages.filter((m) => {
    if (activeTab === "unread") return !m.read;
    if (activeTab === "read") return m.read;
    return true;
  });

  const toggleExpand = async (msg: Message) => {
    if (expandedId === msg._id) {
      setExpandedId(null);
      return;
    }

    setExpandedId(msg._id);

    // Auto-mark as read when expanding an unread message
    if (!msg.read) {
      await toggleRead(msg, true);
    }
  };

  const toggleRead = async (msg: Message, forceRead?: boolean) => {
    const newRead = forceRead !== undefined ? forceRead : !msg.read;

    try {
      const res = await fetch(`/api/admin/messages/${msg._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: newRead }),
      });
      const data = await res.json();
      if (data._id) {
        setMessages((prev) =>
          prev.map((m) => (m._id === msg._id ? { ...m, read: newRead } : m))
        );
      }
    } catch (err) {
      console.error("Failed to update message:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.message) {
        setMessages((prev) => prev.filter((m) => m._id !== id));
        if (expandedId === id) setExpandedId(null);
      }
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
          <p className="text-sm text-gray-500">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900 font-heading">
            Contact Messages
          </h1>
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center rounded-full bg-brand px-2.5 py-0.5 text-xs font-bold text-white">
              {unreadCount} unread
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500">
          {messages.length} message{messages.length !== 1 ? "s" : ""} total
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1">
        {(["all", "unread", "read"] as FilterTab[]).map((tab) => {
          const count =
            tab === "all"
              ? messages.length
              : tab === "unread"
              ? unreadCount
              : messages.length - unreadCount;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
              <span className="ml-1.5 text-xs text-gray-400">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Messages Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <HiMail className="mb-3 h-12 w-12 text-gray-300" />
            <h3 className="text-sm font-medium text-gray-900">
              {activeTab === "all"
                ? "No messages yet"
                : activeTab === "unread"
                ? "No unread messages"
                : "No read messages"}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeTab === "all"
                ? "Messages from the contact form will appear here."
                : "Try switching to a different filter."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredMessages.map((msg) => {
              const isExpanded = expandedId === msg._id;

              return (
                <div key={msg._id} className="transition-colors">
                  {/* Row */}
                  <div
                    onClick={() => toggleExpand(msg)}
                    className={`flex cursor-pointer items-center gap-4 px-6 py-4 transition-colors hover:bg-gray-50 ${
                      !msg.read ? "bg-brand/[0.02]" : ""
                    }`}
                  >
                    {/* Unread indicator */}
                    <div className="flex-shrink-0">
                      {!msg.read ? (
                        <div className="h-2.5 w-2.5 rounded-full bg-brand" />
                      ) : (
                        <div className="h-2.5 w-2.5 rounded-full bg-transparent" />
                      )}
                    </div>

                    {/* Icon */}
                    <div
                      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${
                        !msg.read
                          ? "bg-brand/10 text-brand"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {msg.read ? (
                        <HiMailOpen className="h-5 w-5" />
                      ) : (
                        <HiMail className="h-5 w-5" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p
                          className={`truncate text-sm ${
                            !msg.read
                              ? "font-semibold text-gray-900"
                              : "font-medium text-gray-700"
                          }`}
                        >
                          {msg.name}
                        </p>
                        <span className="hidden text-xs text-gray-400 sm:inline">
                          &lt;{msg.email}&gt;
                        </span>
                      </div>
                      <p
                        className={`truncate text-sm ${
                          !msg.read ? "text-gray-700" : "text-gray-500"
                        }`}
                      >
                        {msg.subject}
                      </p>
                    </div>

                    {/* Date */}
                    <div className="hidden flex-shrink-0 text-xs text-gray-400 sm:block">
                      {new Date(msg.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-shrink-0 items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRead(msg);
                        }}
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-brand"
                        title={msg.read ? "Mark as unread" : "Mark as read"}
                      >
                        {msg.read ? (
                          <HiEyeOff className="h-4 w-4" />
                        ) : (
                          <HiEye className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(msg._id);
                        }}
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        title="Delete"
                      >
                        <HiTrash className="h-4 w-4" />
                      </button>
                      <div className="ml-1 text-gray-300">
                        {isExpanded ? (
                          <HiChevronUp className="h-4 w-4" />
                        ) : (
                          <HiChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded message content */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50 px-6 py-5">
                      <div className="ml-[4.25rem] space-y-3">
                        <div className="grid gap-2 text-sm sm:grid-cols-2">
                          <div>
                            <span className="font-medium text-gray-500">
                              From:{" "}
                            </span>
                            <span className="text-gray-900">{msg.name}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">
                              Email:{" "}
                            </span>
                            <a
                              href={`mailto:${msg.email}`}
                              className="text-brand hover:underline"
                            >
                              {msg.email}
                            </a>
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">
                              Subject:{" "}
                            </span>
                            <span className="text-gray-900">{msg.subject}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">
                              Date:{" "}
                            </span>
                            <span className="text-gray-900">
                              {new Date(msg.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="rounded-lg border border-gray-200 bg-white p-4">
                          <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                            {msg.message}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <a
                            href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand/90"
                          >
                            Reply via Email
                          </a>
                          <button
                            onClick={() => toggleRead(msg)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                          >
                            {msg.read ? (
                              <>
                                <HiEyeOff className="h-3.5 w-3.5" />
                                Mark Unread
                              </>
                            ) : (
                              <>
                                <HiEye className="h-3.5 w-3.5" />
                                Mark Read
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
