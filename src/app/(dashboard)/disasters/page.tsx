"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Flame, Plus, Search, MapPin, Users, LifeBuoy, Clock } from "lucide-react";
import { Disaster } from "@/types";
import { getSeverityBadgeClass, getStatusBadgeClass, formatDate } from "@/lib/utils";

export default function DisastersPage() {
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedSeverity, setSelectedSeverity] = useState("ALL");

  useEffect(() => {
    async function loadDisasters() {
      try {
        const res = await fetch("/api/disasters");
        const json = await res.json();
        if (json.success) {
          setDisasters(json.data);
        }
      } catch (err) {
        console.error("Failed to load disasters", err);
      } finally {
        setLoading(false);
      }
    }
    loadDisasters();
  }, []);

  const filtered = disasters.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase()) ||
      (d.address && d.address.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = selectedStatus === "ALL" || d.status === selectedStatus;
    const matchesSeverity = selectedSeverity === "ALL" || d.severity === selectedSeverity;
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Disaster Incident Registry"
        subtitle="National Disaster Management Grid • Incident Classification, Radius Tracking & Response Oversight"
      />

      <main className="p-6 space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search disasters by name, location, or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="py-2 px-3 text-xs rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="CONTAINED">Contained</option>
              <option value="RESOLVED">Resolved</option>
            </select>

            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="py-2 px-3 text-xs rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MODERATE">Moderate</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <Link
            href="/disasters/new"
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition"
          >
            <Plus className="h-4 w-4" />
            <span>Declare Disaster</span>
          </Link>
        </div>

        {/* Disasters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((d) => (
            <div
              key={d.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-sky-500/50 transition flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {d.type}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getSeverityBadgeClass(d.severity)}`}>
                      {d.severity}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getStatusBadgeClass(d.status)}`}>
                      {d.status}
                    </span>
                  </div>
                </div>

                <Link href={`/disasters/${d.id}`} className="block group">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-sky-500 transition">
                    {d.title}
                  </h3>
                </Link>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {d.description}
                </p>

                <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                    <span className="truncate">{d.address || `${d.latitude}, ${d.longitude}`}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-500">Radius: <strong>{d.affectedRadiusKm} km</strong></span>
                    <span className="text-slate-500">SOS: <strong>{d.sosCount || 0}</strong></span>
                    <span className="text-slate-500">Teams: <strong>{d.activeTeamsCount || 0}</strong></span>
                  </div>
                </div>
              </div>

              <div className="px-5 py-3 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDate(d.startedAt)}
                </span>
                <Link
                  href={`/disasters/${d.id}`}
                  className="font-semibold text-sky-600 dark:text-sky-400 hover:underline"
                >
                  Manage Incident →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
