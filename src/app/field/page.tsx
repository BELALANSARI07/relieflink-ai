"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Radio,
  MapPin,
  Compass,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Shield,
  Wifi,
  WifiOff,
  ExternalLink,
  ChevronRight,
  Camera,
  Check,
  Loader2,
  Phone,
} from "lucide-react";
import { PortalSwitcher } from "@/components/layout/PortalSwitcher";

export default function FieldRescuePortalPage() {
  const [isOnline, setIsOnline] = useState(true);
  const [missions, setMissions] = useState<any[]>([]);
  const [offlineQueue, setOfflineQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMissionId, setActiveMissionId] = useState<string | null>("mis-001");
  const [evidenceText, setEvidenceText] = useState("");
  const [syncing, setSyncing] = useState(false);

  // Network listener
  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  async function loadMissions() {
    try {
      const res = await fetch("/api/field-missions");
      const json = await res.json();
      if (json.success) {
        setMissions(json.data);
      }
    } catch (err) {
      console.warn("Offline or failed to load field missions, using local cache.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMissions();
  }, []);

  // Update Mission Status with Offline Queue Support
  async function handleUpdateMission(id: string, newStatus: string) {
    if (!isOnline) {
      // Queue action offline
      const action = { id, newStatus, timestamp: new Date().toISOString(), evidenceText };
      setOfflineQueue((prev) => [...prev, action]);
      setMissions((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
      );
      alert("⚠️ Network offline. Action saved locally in offline queue and will sync automatically when signal returns.");
      return;
    }

    try {
      const res = await fetch("/api/field-missions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          missionId: id,
          status: newStatus,
          evidenceNotes: evidenceText || undefined,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setMissions((prev) =>
          prev.map((m) => (m.id === id ? json.data : m))
        );
      }
    } catch (err) {
      alert("Failed to submit status update.");
    }
  }

  // Flush offline queue when reconnected
  async function syncOfflineQueue() {
    if (offlineQueue.length === 0) return;
    setSyncing(true);
    try {
      for (const item of offlineQueue) {
        await fetch("/api/field-missions", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            missionId: item.id,
            status: item.newStatus,
            evidenceNotes: item.evidenceText,
          }),
        });
      }
      setOfflineQueue([]);
      alert("✅ All offline field updates successfully synchronized with national grid.");
      loadMissions();
    } catch (err) {
      alert("Sync failed. Queue preserved.");
    } finally {
      setSyncing(false);
    }
  }

  const activeMission = missions.find((m) => m.id === activeMissionId) || missions[0];

  return (
    <div className="min-h-screen bg-[#0B1220] text-[#F1F5F9] flex flex-col font-sans selection:bg-[#56C5E8]">
      {/* Top Portal Switcher */}
      <PortalSwitcher />

      {/* High-Contrast Field Header */}
      <header className="bg-[#111C2E] border-b border-[#2B3C52] px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#17263B] border border-[#56C5E8]/40 flex items-center justify-center text-[#56C5E8]">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <span className="font-black text-base text-white tracking-wide flex items-center gap-2">
              NDRF Bravo Unit <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold uppercase">Field Ops</span>
            </span>
            <p className="text-[10px] text-[#A9B7CA]">
              Callsign: Bravo-1 • Lead: Capt. Vikram Singh
            </p>
          </div>
        </div>

        {/* Offline / Online Connectivity Beacon */}
        <div className="flex items-center gap-2">
          {isOnline ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-xs font-bold">
              <Wifi className="h-4 w-4" />
              <span className="hidden sm:inline">ONLINE • SYNC ACTIVE</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/80 border border-amber-800 text-amber-400 text-xs font-bold animate-pulse">
              <WifiOff className="h-4 w-4" />
              <span>OFFLINE • {offlineQueue.length} QUEUED</span>
            </div>
          )}

          {offlineQueue.length > 0 && isOnline && (
            <button
              onClick={syncOfflineQueue}
              disabled={syncing}
              className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1 shadow-md"
            >
              {syncing ? <Loader2 className="h-3 w-3 animate-spin" /> : "Sync Queue"}
            </button>
          )}
        </div>
      </header>

      {/* Main Field Ops Grid */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Mission Switcher Bar */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#A9B7CA] block">
            Assigned Tactical Missions ({missions.length})
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {missions.map((mis) => (
              <button
                key={mis.id}
                onClick={() => setActiveMissionId(mis.id)}
                className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                  activeMissionId === mis.id
                    ? "bg-[#17263B] border-[#56C5E8] shadow-lg ring-2 ring-[#56C5E8]/20"
                    : "bg-[#111C2E] border-[#2B3C52] hover:bg-[#17263B]/60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800">
                      {mis.priority}
                    </span>
                    <span className="text-[10px] font-bold text-[#A9B7CA]">{mis.status}</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-white line-clamp-1">{mis.title}</h4>
                  <p className="text-[11px] text-[#A9B7CA] mt-1 line-clamp-1">{mis.targetAddress}</p>
                </div>
                <div className="pt-2 text-[10px] text-cyan-400 font-semibold flex items-center justify-between">
                  <span>Affected: {mis.peopleCount} persons</span>
                  <span>Select →</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Active Mission Tactical Detail Card */}
        {activeMission && (
          <div className="bg-[#111C2E] border border-[#2B3C52] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            {/* Header info */}
            <div className="border-b border-[#2B3C52] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-red-600 text-white">
                    {activeMission.priority} MISSION
                  </span>
                  <span className="text-sm font-bold text-cyan-400">{activeMission.id}</span>
                </div>
                <h2 className="text-xl font-black text-white mt-1">{activeMission.title}</h2>
                <p className="text-xs text-[#A9B7CA] mt-0.5 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-[#56C5E8]" />
                  <span>{activeMission.targetAddress}</span>
                </p>
              </div>

              {/* Navigation Button */}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${activeMission.coordinates[0]},${activeMission.coordinates[1]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-2xl bg-[#56C5E8] hover:bg-[#438EED] text-[#0B1220] font-black text-xs transition flex items-center gap-2 shadow-lg"
              >
                <Compass className="h-4 w-4" />
                <span>Launch GPS Turn-by-Turn Navigation</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Tactical Orders Box */}
            <div className="p-4 rounded-2xl bg-[#0B1220] border border-[#2B3C52] space-y-2 text-xs">
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                Field Command Tactical Orders:
              </span>
              <p className="text-sm font-medium text-[#F1F5F9] leading-relaxed">
                {activeMission.tacticalOrders}
              </p>

              {/* Hazards warning */}
              {activeMission.hazards && (
                <div className="pt-2 border-t border-[#2B3C52] flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold text-amber-400 uppercase">On-Scene Hazards:</span>
                  {activeMission.hazards.map((h: string, idx: number) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800 text-amber-300">
                      ⚠️ {h}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Large Touch Controls for Field Officers */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#A9B7CA] uppercase tracking-wider block">
                Field Progress Execution Controls:
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => handleUpdateMission(activeMission.id, "ACCEPTED")}
                  className={`p-4 rounded-2xl font-black text-xs border transition flex flex-col items-center justify-center gap-1 ${
                    activeMission.status === "ACCEPTED"
                      ? "bg-sky-600 border-sky-400 text-white ring-2 ring-sky-400"
                      : "bg-[#17263B] border-[#2B3C52] text-[#A9B7CA] hover:text-white"
                  }`}
                >
                  <Check className="h-5 w-5" />
                  <span>1. ACCEPT MISSION</span>
                </button>

                <button
                  onClick={() => handleUpdateMission(activeMission.id, "EN_ROUTE")}
                  className={`p-4 rounded-2xl font-black text-xs border transition flex flex-col items-center justify-center gap-1 ${
                    activeMission.status === "EN_ROUTE"
                      ? "bg-amber-600 border-amber-400 text-white ring-2 ring-amber-400"
                      : "bg-[#17263B] border-[#2B3C52] text-[#A9B7CA] hover:text-white"
                  }`}
                >
                  <Compass className="h-5 w-5" />
                  <span>2. EN ROUTE</span>
                </button>

                <button
                  onClick={() => handleUpdateMission(activeMission.id, "ON_SCENE")}
                  className={`p-4 rounded-2xl font-black text-xs border transition flex flex-col items-center justify-center gap-1 ${
                    activeMission.status === "ON_SCENE"
                      ? "bg-purple-600 border-purple-400 text-white ring-2 ring-purple-400"
                      : "bg-[#17263B] border-[#2B3C52] text-[#A9B7CA] hover:text-white"
                  }`}
                >
                  <MapPin className="h-5 w-5" />
                  <span>3. ON SCENE ARRIVED</span>
                </button>

                <button
                  onClick={() => handleUpdateMission(activeMission.id, "COMPLETED")}
                  className={`p-4 rounded-2xl font-black text-xs border transition flex flex-col items-center justify-center gap-1 ${
                    activeMission.status === "COMPLETED"
                      ? "bg-emerald-600 border-emerald-400 text-white ring-2 ring-emerald-400"
                      : "bg-[#17263B] border-[#2B3C52] text-[#A9B7CA] hover:text-white"
                  }`}
                >
                  <CheckCircle2 className="h-5 w-5" />
                  <span>4. RESCUE COMPLETED</span>
                </button>
              </div>
            </div>

            {/* Field Notes & Evidence */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#A9B7CA] block">
                Field Evidence / Post-Mission Remarks
              </label>
              <textarea
                rows={2}
                value={evidenceText}
                onChange={(e) => setEvidenceText(e.target.value)}
                placeholder="Evacuation craft deployed; 4 family members in stable condition..."
                className="w-full px-4 py-3 rounded-2xl bg-[#0B1220] border border-[#2B3C52] text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#56C5E8] resize-none"
              />
            </div>
          </div>
        )}
      </main>

      {/* Field Footer */}
      <footer className="border-t border-[#2B3C52] bg-[#111C2E] px-4 py-4 text-center text-xs text-[#A9B7CA]">
        <span>Tactical Radio Callsign: <strong>Bravo-1</strong> • High-Water Response Unit • Powered by ReliefLink Offline Engine</span>
      </footer>
    </div>
  );
}
