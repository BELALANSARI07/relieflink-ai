"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import {
  Flame,
  LifeBuoy,
  Users2,
  Building2,
  Home,
  Hospital,
  AlertTriangle,
  ArrowUpRight,
  Bot,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { getSeverityBadgeClass, getStatusBadgeClass, formatTimeAgo } from "@/lib/utils";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch("/api/analytics/overview");
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const metrics = data?.metrics || {
    activeDisasters: 3,
    pendingSos: 4,
    deployedTeams: 2,
    activeNgos: 3,
    currentShelterOccupancy: 2170,
    totalShelterCapacity: 3800,
    shelterOccupancyRate: 57,
    availableHospitalBeds: 422,
    criticalSos: 3,
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Emergency Operations Command Center"
        subtitle="National Disaster Management Grid • Coordinated Multi-Agency Real-Time Response"
      />

      <main className="p-6 space-y-6">
        {/* Urgent Alert Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/60 via-red-900/30 to-amber-950/40 border border-red-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-600/30 border border-red-500/50 flex items-center justify-center text-red-400">
              <AlertTriangle className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-600 text-white">
                  Critical Alert
                </span>
                <span className="text-xs text-red-300 font-semibold">Cyclone Varuna (Category 4)</span>
              </div>
              <p className="text-sm font-medium text-slate-200 mt-0.5">
                Gale winds exceeding 175 km/h. Sea water ingress in Mahim & Bandra coastal sectors. 3 SOS triage teams deployed.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link
              href="/map"
              className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <MapPin className="h-3.5 w-3.5 text-sky-400" />
              <span>View Map</span>
            </Link>
            <Link
              href="/sos"
              className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <LifeBuoy className="h-3.5 w-3.5" />
              <span>Review SOS ({metrics.pendingSos})</span>
            </Link>
          </div>
        </div>

        {/* 6 Core Operational Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Disasters</span>
              <Flame className="h-4 w-4 text-orange-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
              {metrics.activeDisasters}
            </p>
            <p className="text-[11px] text-orange-600 dark:text-orange-400 font-medium mt-1">
              2 Red, 1 Amber Zone
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Pending SOS</span>
              <LifeBuoy className="h-4 w-4 text-red-500" />
            </div>
            <p className="text-2xl font-black text-red-600 dark:text-red-400 mt-2">
              {metrics.pendingSos}
            </p>
            <p className="text-[11px] text-red-600 dark:text-red-400 font-medium mt-1">
              {metrics.criticalSos} Marked Critical
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Rescue Teams</span>
              <Users2 className="h-4 w-4 text-sky-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
              {metrics.deployedTeams} / 3
            </p>
            <p className="text-[11px] text-sky-600 dark:text-sky-400 font-medium mt-1">
              Units Deployed / En Route
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Active NGOs</span>
              <Building2 className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
              {metrics.activeNgos}
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
              9 Active Relief Sectors
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Shelter Beds</span>
              <Home className="h-4 w-4 text-indigo-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
              {metrics.shelterOccupancyRate}%
            </p>
            <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-1">
              {metrics.currentShelterOccupancy} / {metrics.totalShelterCapacity} Capacity
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Available Beds</span>
              <Hospital className="h-4 w-4 text-teal-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
              {metrics.availableHospitalBeds}
            </p>
            <p className="text-[11px] text-teal-600 dark:text-teal-400 font-medium mt-1">
              49 ICU Trauma Units Ready
            </p>
          </div>
        </div>

        {/* Two-Column Operations Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Live Triage Feed (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Urgent SOS Feed */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />
                  <h2 className="font-bold text-slate-900 dark:text-white text-sm">
                    Priority Citizen SOS Triage Feed
                  </h2>
                </div>
                <Link
                  href="/sos"
                  className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                >
                  <span>View All SOS</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                <div className="p-4 hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">SOS-101</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-900/30 text-red-400 border border-red-800">
                        CRITICAL • EVACUATION
                      </span>
                      <span className="text-[10px] text-slate-400">Mahim Creek</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Water level rose to ground floor ceiling. 4 family members trapped on terrace.
                    </p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Assigned to NDRF Bravo Unit • In Progress</span>
                    </p>
                  </div>
                  <Link
                    href="/sos"
                    className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold text-center whitespace-nowrap"
                  >
                    Track Rescue
                  </Link>
                </div>

                <div className="p-4 hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">SOS-102</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-900/30 text-red-400 border border-red-800">
                        CRITICAL • MEDICAL
                      </span>
                      <span className="text-[10px] text-slate-400">Bandra West Junction</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Fallen tree collapsed onto structure. 2 persons with severe limb fractures.
                    </p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Assigned to SDRF Rapid Trauma Squad</span>
                    </p>
                  </div>
                  <Link
                    href="/sos"
                    className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold text-center whitespace-nowrap"
                  >
                    Track Rescue
                  </Link>
                </div>

                <div className="p-4 hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">SOS-103</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-900/30 text-amber-400 border border-amber-800">
                        HIGH • FOOD & WATER
                      </span>
                      <span className="text-[10px] text-slate-400">Danapur Diara Sector</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      45 villagers cut off by knee-deep mud in community hall. No potable water for 18h.
                    </p>
                    <p className="text-[11px] text-amber-500 font-semibold flex items-center gap-1">
                      <span>⚠️ Unassigned • AI matches Oxfam Foundation</span>
                    </p>
                  </div>
                  <Link
                    href="/sos"
                    className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold text-center whitespace-nowrap"
                  >
                    Assign Squad
                  </Link>
                </div>
              </div>
            </div>

            {/* Active Disaster Overview */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-slate-900 dark:text-white text-sm">
                  Active Disaster Zones
                </h2>
                <Link
                  href="/disasters/new"
                  className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
                >
                  + Declare New Disaster
                </Link>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">Cyclone Varuna</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-900/30 text-purple-400 border border-purple-800">
                        HURRICANE
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-900/30 text-red-400 border border-red-800">
                        CRITICAL
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Coastal Belt, Mumbai • 35 km Radius • 14 SOS Requests • 5 Rescue Units Deployed
                    </p>
                  </div>
                  <Link
                    href="/disasters/dis-001"
                    className="text-xs text-sky-500 font-semibold hover:underline whitespace-nowrap"
                  >
                    Details →
                  </Link>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">North Basin River Flash Flood</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-900/30 text-blue-400 border border-blue-800">
                        FLOOD
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-orange-900/30 text-orange-400 border border-orange-800">
                        HIGH
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Patna Rural Sector • 22 km Radius • 21 SOS Requests • 7 Active Teams
                    </p>
                  </div>
                  <Link
                    href="/disasters/dis-002"
                    className="text-xs text-sky-500 font-semibold hover:underline whitespace-nowrap"
                  >
                    Details →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: AI Decision Support & Operations Hub (1 col) */}
          <div className="space-y-6">
            {/* AI Decision Support Panel */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-xl border border-sky-900/40 p-4 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sky-400">
                  <Bot className="h-5 w-5" />
                  <h3 className="font-bold text-sm text-white">AI Decision Support</h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-950 border border-sky-800 text-sky-300">
                  Active
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/80 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400 font-semibold text-[11px]">
                    <span className="text-amber-400 font-bold">Relief Sector Gap</span>
                    <span>Confidence: 94%</span>
                  </div>
                  <p className="text-slate-200 font-medium">
                    Recommend assigning <strong>Oxfam India</strong> to Danapur Diara Sector.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Oxfam has 3,200 ration packets within 4.2 km and eliminates 18h food deprivation.
                  </p>
                  <div className="pt-1 flex gap-2">
                    <button className="px-2 py-1 bg-sky-600 hover:bg-sky-500 rounded text-[11px] font-semibold text-white transition">
                      Approve Assignment
                    </button>
                    <button className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-[11px] font-semibold text-slate-300 transition">
                      Dismiss
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/80 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400 font-semibold text-[11px]">
                    <span className="text-emerald-400 font-bold">Shelter Supply Forecast</span>
                    <span>Confidence: 89%</span>
                  </div>
                  <p className="text-slate-200 font-medium">
                    Dispatch 300 potable water cartons from Kurla SDMA to Dharavi Sports Complex.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Current water supply will deplete in 5.5 hours at present influx rate.
                  </p>
                </div>
              </div>

              <Link
                href="/ai"
                className="block text-center w-full py-2 rounded-lg bg-sky-950 hover:bg-sky-900 border border-sky-800 text-sky-300 text-xs font-semibold transition"
              >
                Open Full AI Decision Center →
              </Link>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Operational Shortcuts
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Link
                  href="/sos/new"
                  className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900 font-semibold text-center hover:bg-red-100 transition"
                >
                  🚨 Broadcast SOS
                </Link>
                <Link
                  href="/disasters/new"
                  className="p-2.5 rounded-lg bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-900 font-semibold text-center hover:bg-orange-100 transition"
                >
                  ⚡ Declare Disaster
                </Link>
                <Link
                  href="/resources"
                  className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900 font-semibold text-center hover:bg-blue-100 transition"
                >
                  📦 Allocate Stock
                </Link>
                <Link
                  href="/map"
                  className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 font-semibold text-center hover:bg-emerald-100 transition"
                >
                  🗺️ Geospatial Map
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
