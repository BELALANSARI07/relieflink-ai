"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import {
  Users2,
  Phone,
  MapPin,
  CheckCircle2,
  Clock,
  Plus,
  Shield,
  Loader2,
} from "lucide-react";
import { RescueTeam } from "@/types";
import { getStatusBadgeClass } from "@/lib/utils";

export default function RescueTeamsPage() {
  const [teams, setTeams] = useState<RescueTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadTeams();
  }, []);

  async function loadTeams() {
    try {
      const res = await fetch("/api/rescue-teams");
      const json = await res.json();
      if (json.success) setTeams(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusToggle(id: string, newStatus: string) {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/rescue-teams/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setTeams((prev) => prev.map((t) => (t.id === id ? json.data : t)));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Rescue Squads & Emergency Field Teams"
        subtitle="National Disaster Management Grid • Specialized Amphibious, Urban Search & Medical Paramedic Units"
      />

      <main className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Tactical First Responder Units
            </h2>
            <p className="text-xs text-slate-500">
              Live deployment tracking, squad specialization, and equipment readiness.
            </p>
          </div>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {teams.map((t) => (
            <div
              key={t.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {t.name}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Leader: <strong>{t.leaderName || "Squad Commander"}</strong>
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ${getStatusBadgeClass(t.status)}`}>
                    {t.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800 text-[10px]">
                    {t.specialization}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    Capacity: <strong>{t.capacity} Personnel</strong>
                  </span>
                </div>

                {t.equipment && t.equipment.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Tactical Equipment
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {t.equipment.map((eq, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                        >
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {t.contactNumber && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono pt-1">
                    <Phone className="h-3.5 w-3.5 text-emerald-500" />
                    <span>{t.contactNumber}</span>
                  </div>
                )}
              </div>

              {/* Status Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <button
                  onClick={() => handleStatusToggle(t.id, "AVAILABLE")}
                  disabled={updatingId === t.id || t.status === "AVAILABLE"}
                  className="flex-1 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
                >
                  Mark Standby
                </button>
                <button
                  onClick={() => handleStatusToggle(t.id, "DEPLOYED")}
                  disabled={updatingId === t.id || t.status === "DEPLOYED"}
                  className="flex-1 py-1 rounded bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-sm transition"
                >
                  Mark Deployed
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
