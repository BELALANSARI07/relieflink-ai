"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  LifeBuoy,
} from "lucide-react";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/analytics/overview");
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const metrics = data?.metrics || {
    activeDisasters: 3,
    pendingSos: 4,
    deployedTeams: 2,
    activeNgos: 3,
    shelterOccupancyRate: 57,
  };

  const severityCounts = data?.severityCounts || {
    CRITICAL: 3,
    HIGH: 1,
    MEDIUM: 0,
    LOW: 0,
  };

  const emergencyTypeCounts = data?.emergencyTypeCounts || {
    EVACUATION: 1,
    MEDICAL: 1,
    FOOD_WATER: 1,
    RESCUE: 1,
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Disaster Intelligence & Analytics"
        subtitle="National Disaster Management Grid • Response Latency, Resource Consumption & After-Action Metrics"
      />

      <main className="p-6 space-y-6">
        {/* Top KPI Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Triage Latency</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">4.2 min</p>
            <p className="text-[11px] text-emerald-500 font-medium mt-1">↓ 35% faster than baseline target</p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Duplicate SOS Blocked</span>
            <p className="text-2xl font-black text-amber-500 mt-1">12 Calls</p>
            <p className="text-[11px] text-slate-400 mt-1">Saved ~180 squad hours</p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Relief Kits Dispatched</span>
            <p className="text-2xl font-black text-sky-500 mt-1">4,850 Pkgs</p>
            <p className="text-[11px] text-slate-400 mt-1">Across 3 active disaster sectors</p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Evacuees Sheltered</span>
            <p className="text-2xl font-black text-indigo-500 mt-1">2,170 Citizens</p>
            <p className="text-[11px] text-slate-400 mt-1">57% network capacity in use</p>
          </div>
        </div>

        {/* Charts & Distribution Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Emergency Type Breakdown */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Incident Breakdown by Emergency Type
            </h3>

            <div className="space-y-3 text-xs">
              {Object.entries(emergencyTypeCounts).map(([type, count]: [string, any]) => {
                const total = Object.values(emergencyTypeCounts).reduce((a: any, b: any) => a + b, 0) as number;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;

                return (
                  <div key={type} className="space-y-1">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-700 dark:text-slate-300">{type}</span>
                      <span className="text-slate-500">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div className="bg-sky-500 h-2 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Severity Breakdown */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Emergency Severity Classification
            </h3>

            <div className="space-y-3 text-xs">
              {Object.entries(severityCounts).map(([sev, count]: [string, any]) => {
                const total = Object.values(severityCounts).reduce((a: any, b: any) => a + b, 0) as number;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                const color =
                  sev === "CRITICAL"
                    ? "bg-red-500"
                    : sev === "HIGH"
                    ? "bg-orange-500"
                    : "bg-emerald-500";

                return (
                  <div key={sev} className="space-y-1">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-700 dark:text-slate-300">{sev}</span>
                      <span className="text-slate-500">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div className={`${color} h-2 rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
