"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import {
  LifeBuoy,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  AlertTriangle,
  Users2,
  Plus,
  Loader2,
} from "lucide-react";
import { SosRequest, RescueTeam } from "@/types";
import { getSeverityBadgeClass, getStatusBadgeClass, formatTimeAgo } from "@/lib/utils";

export default function SosTriagePage() {
  const [sosList, setSosList] = useState<SosRequest[]>([]);
  const [teams, setTeams] = useState<RescueTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [assigningId, setAssigningId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [sosRes, teamRes] = await Promise.all([
          fetch("/api/sos"),
          fetch("/api/rescue-teams"),
        ]);
        const [sosJson, teamJson] = await Promise.all([sosRes.json(), teamRes.json()]);
        if (sosJson.success) setSosList(sosJson.data);
        if (teamJson.success) setTeams(teamJson.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  async function handleAssignTeam(sosId: string, teamId: string) {
    try {
      const res = await fetch(`/api/sos/${sosId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedTeamId: teamId }),
      });
      const json = await res.json();
      if (json.success) {
        setSosList((prev) =>
          prev.map((s) => (s.id === sosId ? { ...s, assignedTeamId: teamId, assignedTeamName: json.data.assignedTeamName, status: "ASSIGNED" } : s))
        );
        setAssigningId(null);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleUpdateStatus(sosId: string, status: string) {
    try {
      const res = await fetch(`/api/sos/${sosId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (json.success) {
        setSosList((prev) =>
          prev.map((s) => (s.id === sosId ? { ...s, status: status as any } : s))
        );
      }
    } catch (err) {
      console.error(err);
    }
  }

  const filtered = sosList.filter((s) => {
    const matchesSev = filterSeverity === "ALL" || s.severity === filterSeverity;
    const matchesStat = filterStatus === "ALL" || s.status === filterStatus;
    return matchesSev && matchesStat;
  });

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Emergency SOS Triage Command"
        subtitle="Live Citizen Distress Feed • Prioritization, Duplicate Flagging & Rescue Squad Dispatch"
      />

      <main className="p-6 space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="py-2 px-3 text-xs rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical Priority</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="py-2 px-3 text-xs rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Triage</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          <Link
            href="/sos/new"
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition"
          >
            <Plus className="h-4 w-4" />
            <span>Submit Citizen SOS</span>
          </Link>
        </div>

        {/* SOS Feed List */}
        <div className="space-y-4">
          {filtered.map((s) => (
            <div
              key={s.id}
              className={`p-5 rounded-xl bg-white dark:bg-slate-900 border transition shadow-sm ${
                s.severity === "CRITICAL"
                  ? "border-red-500/60 dark:border-red-900/80"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                      {s.id}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getSeverityBadgeClass(s.severity)}`}>
                      {s.severity}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-900/30 text-sky-400 border border-sky-800">
                      {s.type}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getStatusBadgeClass(s.status)}`}>
                      {s.status}
                    </span>
                    {s.isDuplicate && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        <span>AI Duplicate Flag</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    {s.description}
                  </h3>

                  {s.medicalNeeds && (
                    <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-900/40 text-xs text-red-300">
                      <strong>Medical Needs:</strong> {s.medicalNeeds}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-sky-500" />
                      <span>{s.address} ({s.latitude.toFixed(4)}, {s.longitude.toFixed(4)})</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Users2 className="h-3.5 w-3.5 text-slate-400" />
                      <span>{s.peopleCount} Affected</span>
                    </span>
                    {s.contactPhone && (
                      <span className="flex items-center gap-1 font-mono">
                        <Phone className="h-3.5 w-3.5 text-emerald-500" />
                        <span>{s.contactPhone}</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span>{formatTimeAgo(s.createdAt)}</span>
                    </span>
                  </div>
                </div>

                {/* Assignment & Status Controls */}
                <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 md:min-w-[200px]">
                  {s.assignedTeamName ? (
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                      <p className="text-[11px] text-slate-400">Assigned Unit:</p>
                      <p className="font-bold text-sky-500 mt-0.5">{s.assignedTeamName}</p>
                    </div>
                  ) : (
                    <div>
                      {assigningId === s.id ? (
                        <div className="space-y-2">
                          <select
                            onChange={(e) => {
                              if (e.target.value) handleAssignTeam(s.id, e.target.value);
                            }}
                            className="w-full py-1.5 px-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          >
                            <option value="">Select Rescue Squad...</option>
                            {teams.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.name} ({t.specialization})
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => setAssigningId(null)}
                            className="text-[11px] text-slate-400 hover:underline block"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAssigningId(s.id)}
                          className="w-full px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-sm transition"
                        >
                          Dispatch Squad
                        </button>
                      )}
                    </div>
                  )}

                  <div className="flex gap-1.5">
                    {s.status !== "IN_PROGRESS" && s.status !== "RESOLVED" && (
                      <button
                        onClick={() => handleUpdateStatus(s.id, "IN_PROGRESS")}
                        className="flex-1 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium"
                      >
                        In Progress
                      </button>
                    )}
                    {s.status !== "RESOLVED" && (
                      <button
                        onClick={() => handleUpdateStatus(s.id, "RESOLVED")}
                        className="flex-1 px-2.5 py-1 rounded bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-800 text-xs font-semibold"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
