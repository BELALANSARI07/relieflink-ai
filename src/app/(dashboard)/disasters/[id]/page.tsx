"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import {
  Flame,
  MapPin,
  Clock,
  LifeBuoy,
  Users2,
  Building2,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Plus,
  Send,
} from "lucide-react";
import { getSeverityBadgeClass, getStatusBadgeClass, formatDate } from "@/lib/utils";

export default function DisasterDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [disaster, setDisaster] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"SOS" | "TASKS" | "UPDATES">("SOS");
  const [newUpdate, setNewUpdate] = useState("");
  const [postingUpdate, setPostingUpdate] = useState(false);

  useEffect(() => {
    async function loadDisaster() {
      try {
        const res = await fetch(`/api/disasters/${id}`);
        const json = await res.json();
        if (json.success) {
          setDisaster(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadDisaster();
  }, [id]);

  async function handleStatusChange(newStatus: string) {
    try {
      const res = await fetch(`/api/disasters/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setDisaster((prev: any) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handlePostUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!newUpdate.trim()) return;
    setPostingUpdate(true);
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `Update on ${disaster?.title}`,
          message: newUpdate,
          type: "DISASTER_ALERT",
        }),
      });
      setNewUpdate("");
    } catch (err) {
      console.error(err);
    } finally {
      setPostingUpdate(false);
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex flex-col">
        <Header title="Disaster Incident Center" />
        <div className="p-8 text-center text-xs text-slate-500">Loading incident data...</div>
      </div>
    );
  }

  if (!disaster) {
    return (
      <div className="flex-1 flex flex-col">
        <Header title="Incident Not Found" />
        <div className="p-8 text-center text-xs text-slate-500">
          The requested disaster incident could not be found.
          <div className="mt-4">
            <Link href="/disasters" className="text-sky-500 hover:underline">
              Return to Disasters List
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title={disaster.title}
        subtitle={`${disaster.type} • Declared by ${disaster.reportedByName || "Authority"} • ${disaster.address || "Coordinated Zone"}`}
      />

      <main className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/disasters"
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to All Disasters</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Status:</span>
            <select
              value={disaster.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="py-1 px-2.5 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="CONTAINED">CONTAINED</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>
        </div>

        {/* Hero Card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2.5 py-1 rounded ${getSeverityBadgeClass(disaster.severity)}`}>
                {disaster.severity} SEVERITY
              </span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded ${getStatusBadgeClass(disaster.status)}`}>
                {disaster.status}
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {disaster.type}
              </span>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>Started: {formatDate(disaster.startedAt)}</span>
            </div>
          </div>

          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {disaster.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <p className="text-slate-400">Epicenter Location</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                {disaster.latitude.toFixed(4)}, {disaster.longitude.toFixed(4)}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Impact Radius</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                {disaster.affectedRadiusKm} km coverage
              </p>
            </div>
            <div>
              <p className="text-slate-400">Linked Citizen SOS</p>
              <p className="font-semibold text-red-600 dark:text-red-400 mt-0.5">
                {disaster.sosRequests?.length || disaster.sosCount || 0} In Queue
              </p>
            </div>
            <div>
              <p className="text-slate-400">Active Relief Tasks</p>
              <p className="font-semibold text-sky-600 dark:text-sky-400 mt-0.5">
                {disaster.reliefTasks?.length || 0} Assigned
              </p>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab("SOS")}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition ${
              activeTab === "SOS"
                ? "border-red-600 text-red-600 dark:text-red-400"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Emergency Citizen SOS ({disaster.sosRequests?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("TASKS")}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition ${
              activeTab === "TASKS"
                ? "border-sky-600 text-sky-600 dark:text-sky-400"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            NGO Relief Tasks ({disaster.reliefTasks?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("UPDATES")}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition ${
              activeTab === "UPDATES"
                ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Bulletins & Updates
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "SOS" && (
          <div className="space-y-3">
            {(!disaster.sosRequests || disaster.sosRequests.length === 0) ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                No active SOS requests for this specific zone yet.
              </div>
            ) : (
              disaster.sosRequests.map((s: any) => (
                <div
                  key={s.id}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{s.id}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-900/30 text-red-400 border border-red-800">
                        {s.type} • {s.severity}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {s.peopleCount} person(s) • {s.address}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300">{s.description}</p>
                    <p className="text-[11px] text-slate-400">
                      Assigned: {s.assignedTeamName || "Unassigned"} • Status: <strong>{s.status}</strong>
                    </p>
                  </div>
                  <Link
                    href={`/sos`}
                    className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold whitespace-nowrap text-center"
                  >
                    Open Triage Console
                  </Link>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "TASKS" && (
          <div className="space-y-3">
            {(!disaster.reliefTasks || disaster.reliefTasks.length === 0) ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                No NGO relief tasks assigned yet.
              </div>
            ) : (
              disaster.reliefTasks.map((t: any) => (
                <div
                  key={t.id}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{t.title}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-900/30 text-sky-400 border border-sky-800">
                        {t.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{t.description}</p>
                    <p className="text-[11px] text-slate-400">
                      Partner NGO: <strong>{t.ngoName || "Unassigned"}</strong> • Sector: {t.areaName}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded self-start sm:self-center ${getStatusBadgeClass(t.status)}`}>
                    {t.status}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "UPDATES" && (
          <div className="space-y-4">
            <form onSubmit={handlePostUpdate} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <label className="block text-xs font-bold text-slate-900 dark:text-white">
                Broadcast Official Field Bulletin / Warning
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="e.g. Flood water receded 40cm in Sector 2. Evacuation route B cleared for emergency vehicles."
                  value={newUpdate}
                  onChange={(e) => setNewUpdate(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={postingUpdate}
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Broadcast</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
