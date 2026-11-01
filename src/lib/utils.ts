import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "N/A";
  const d = new Date(date);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTimeAgo(date: string | Date | null | undefined): string {
  if (!date) return "N/A";
  const d = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

export function getSeverityBadgeClass(severity: string): string {
  switch (severity?.toUpperCase()) {
    case "CATASTROPHIC":
      return "bg-purple-900/30 text-purple-400 border border-purple-800";
    case "CRITICAL":
      return "bg-red-900/30 text-red-400 border border-red-800";
    case "HIGH":
      return "bg-orange-900/30 text-orange-400 border border-orange-800";
    case "MODERATE":
    case "MEDIUM":
      return "bg-amber-900/30 text-amber-400 border border-amber-800";
    case "LOW":
      return "bg-emerald-900/30 text-emerald-400 border border-emerald-800";
    default:
      return "bg-slate-800 text-slate-300 border border-slate-700";
  }
}

export function getStatusBadgeClass(status: string): string {
  switch (status?.toUpperCase()) {
    case "ACTIVE":
    case "IN_PROGRESS":
    case "DEPLOYED":
      return "bg-blue-900/30 text-blue-400 border border-blue-800";
    case "RESOLVED":
    case "COMPLETED":
    case "AVAILABLE":
      return "bg-emerald-900/30 text-emerald-400 border border-emerald-800";
    case "PENDING":
    case "REPORTED":
      return "bg-amber-900/30 text-amber-400 border border-amber-800";
    case "ASSIGNED":
    case "EN_ROUTE":
      return "bg-purple-900/30 text-purple-400 border border-purple-800";
    case "CANCELLED":
    case "CLOSED":
    case "OFF_DUTY":
      return "bg-slate-800 text-slate-400 border border-slate-700";
    default:
      return "bg-slate-800 text-slate-300 border border-slate-700";
  }
}
