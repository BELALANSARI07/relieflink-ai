"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Flame,
  LifeBuoy,
  Home,
  Bot,
  Clock,
} from "lucide-react";
import { NotificationItem } from "@/types";
import { formatTimeAgo } from "@/lib/utils";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      const res = await fetch("/api/notifications");
      const json = await res.json();
      if (json.success) setNotifications(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkAllRead() {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      const json = await res.json();
      if (json.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Emergency Notifications & Alert Center"
        subtitle="National Disaster Management Grid • Priority Broadcasts, Dispatch Alarms & Operational Status Updates"
      />

      <main className="p-6 max-w-4xl mx-auto w-full space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              System Alerts
            </h2>
            <p className="text-xs text-slate-500">
              {notifications.filter((n) => !n.isRead).length} unread priority notifications
            </p>
          </div>

          <button
            onClick={handleMarkAllRead}
            className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
          >
            Mark all as read
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.map((n) => {
            const isAlert = n.type === "DISASTER_ALERT" || n.type === "SOS_UPDATE";
            return (
              <div
                key={n.id}
                className={`p-4 rounded-xl border transition shadow-sm flex items-start gap-3.5 ${
                  !n.isRead
                    ? "bg-white dark:bg-slate-900 border-sky-500/40"
                    : "bg-slate-50/60 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800"
                }`}
              >
                <div
                  className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                    n.type === "SOS_UPDATE"
                      ? "bg-red-950 border border-red-800 text-red-400"
                      : n.type === "DISASTER_ALERT"
                      ? "bg-purple-950 border border-purple-800 text-purple-400"
                      : n.type === "AI_RECOMMENDATION"
                      ? "bg-sky-950 border border-sky-800 text-sky-400"
                      : "bg-slate-800 text-slate-300"
                  }`}
                >
                  {n.type === "SOS_UPDATE" ? (
                    <LifeBuoy className="h-4 w-4" />
                  ) : n.type === "DISASTER_ALERT" ? (
                    <Flame className="h-4 w-4" />
                  ) : n.type === "AI_RECOMMENDATION" ? (
                    <Bot className="h-4 w-4" />
                  ) : (
                    <Bell className="h-4 w-4" />
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xs text-slate-900 dark:text-white">
                      {n.title}
                    </h3>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="h-3 w-3" />
                      {formatTimeAgo(n.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {n.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
