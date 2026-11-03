"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { Header } from "@/components/layout/header";
import {
  Layers,
  Flame,
  LifeBuoy,
  Users2,
  Home,
  Hospital,
  AlertTriangle,
  MapPin,
  RefreshCw,
  Crosshair,
  Activity,
  CheckCircle2,
  Filter,
  Radio,
  Loader2,
} from "lucide-react";
import { MapLegend } from "@/components/map/MapLegend";
import { ReportEmergencyModal } from "@/components/map/ReportEmergencyModal";
import { EmergencyDetailsDrawer } from "@/components/map/EmergencyDetailsDrawer";

// Dynamically import Leaflet Map Component with SSR disabled
const EmergencyMap = dynamic(
  () => import("@/components/map/EmergencyMap").then((mod) => mod.EmergencyMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[500px] bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
        <span className="text-xs font-semibold tracking-wider">
          Initializing Geospatial Tactical Engine...
        </span>
      </div>
    ),
  }
);

export default function InteractiveMapPage() {
  const [layersData, setLayersData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());

  // Filter States
  const [activeLayers, setActiveLayers] = useState({
    disasters: true,
    sos: true,
    rescue: true,
    shelters: true,
    hospitals: true,
  });

  const [filterSeverity, setFilterSeverity] = useState("ALL");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ACTIVE");
  const [filterUnassignedOnly, setFilterUnassignedOnly] = useState(false);
  const [isHeatmapMode, setIsHeatmapMode] = useState(false);
  const [isReportingMode, setIsReportingMode] = useState(false);

  // Modals & Drawers
  const [selectedEntity, setSelectedEntity] = useState<{
    type: "SOS" | "DISASTER" | "RESCUE_TEAM" | "SHELTER" | "HOSPITAL";
    data: any;
  } | null>(null);

  const [reportingCoords, setReportingCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Load Data
  const loadMapData = useCallback(async (isSilent = false) => {
    if (!isSilent) setSyncing(true);
    try {
      const res = await fetch("/api/map/layers");
      const json = await res.json();
      if (json.success) {
        setLayersData(json.data);
        setLastSyncTime(new Date());
      }
    } catch (err) {
      console.error("Map layer sync failed", err);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, []);

  // Initial Fetch & Real-time Auto-Sync Heartbeat (Every 8 seconds)
  useEffect(() => {
    loadMapData();
    const interval = setInterval(() => {
      loadMapData(true);
    }, 8000);
    return () => clearInterval(interval);
  }, [loadMapData]);

  // Layer toggle helper
  function toggleLayer(key: keyof typeof activeLayers) {
    setActiveLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  // Handle reporting click on map
  function handleMapReportClick(coords: { lat: number; lng: number }) {
    setReportingCoords(coords);
    setIsReportingMode(false);
  }

  // Handle status & squad update from drawer
  async function handleStatusUpdate(id: string, newStatus: string, assignedTeamId?: string) {
    try {
      const res = await fetch(`/api/sos/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, assignedTeamId }),
      });
      const json = await res.json();
      if (json.success) {
        // Optimistically update selected entity
        setSelectedEntity((prev) => (prev ? { ...prev, data: json.data } : null));
        // Refresh layers
        loadMapData(true);
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  }

  // Computed Operational KPIs
  const totalSos = layersData?.sos?.length || 0;
  const criticalSos = layersData?.sos?.filter((s: any) => s.severity === "CRITICAL" && s.status !== "RESOLVED")?.length || 0;
  const highSos = layersData?.sos?.filter((s: any) => s.severity === "HIGH" && s.status !== "RESOLVED")?.length || 0;
  const medicalSos = layersData?.sos?.filter((s: any) => s.type === "MEDICAL" && s.status !== "RESOLVED")?.length || 0;
  const resolvedSos = layersData?.sos?.filter((s: any) => s.status === "RESOLVED")?.length || 0;
  const deployedSquads = layersData?.rescueTeams?.filter((t: any) => t.status === "DEPLOYED")?.length || 0;

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-950 text-slate-100">
      <Header
        title="Interactive Emergency Operations Map"
        subtitle="National Disaster Management Grid • High-Precision Geospatial Tracking, Live SOS Clusters & Squad Dispatch"
      />

      {/* Top Operations & Tactical Filter Strip */}
      <div className="bg-slate-900 border-b border-slate-800 p-3 space-y-2.5 z-20 shrink-0">
        {/* KPI Summary Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Distress Calls:</span>
              <span className="font-extrabold text-white text-sm">{totalSos}</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-950/60 border border-red-800 text-red-300">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
              <span className="text-[10px] uppercase font-semibold">Critical:</span>
              <span className="font-black text-red-400 text-sm">{criticalSos}</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-950/40 border border-orange-800 text-orange-300">
              <span className="text-[10px] uppercase font-semibold">High Priority:</span>
              <span className="font-bold text-orange-400 text-sm">{highSos}</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-950/40 border border-blue-800 text-blue-300">
              <span className="text-[10px] uppercase font-semibold">Medical:</span>
              <span className="font-bold text-blue-400 text-sm">{medicalSos}</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-800 text-emerald-300">
              <span className="text-[10px] uppercase font-semibold">Resolved:</span>
              <span className="font-bold text-emerald-400 text-sm">{resolvedSos}</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/40 border border-cyan-800 text-cyan-300">
              <span className="text-[10px] uppercase font-semibold">Squads Deployed:</span>
              <span className="font-bold text-cyan-400 text-sm">
                {deployedSquads} / {layersData?.rescueTeams?.length || 0}
              </span>
            </div>
          </div>

          {/* Live Sync Heartbeat & Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsReportingMode(!isReportingMode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-md ${
                isReportingMode
                  ? "bg-red-600 text-white ring-2 ring-red-400 animate-pulse"
                  : "bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700"
              }`}
            >
              <Crosshair className="h-4 w-4" />
              <span>{isReportingMode ? "Cancel Pinning" : "📍 Report on Map"}</span>
            </button>

            <button
              onClick={() => setIsHeatmapMode(!isHeatmapMode)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition border ${
                isHeatmapMode
                  ? "bg-purple-950 text-purple-300 border-purple-700"
                  : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
              }`}
            >
              <Activity className="h-3.5 w-3.5 inline mr-1" />
              <span>{isHeatmapMode ? "Heatmap Active" : "Heatmap"}</span>
            </button>

            <button
              onClick={() => loadMapData()}
              disabled={syncing}
              title={`Last synchronized: ${lastSyncTime.toLocaleTimeString()}`}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition"
            >
              <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin text-sky-400" : ""}`} />
            </button>
          </div>
        </div>

        {/* Detailed Filters & Layer Visibility Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <Filter className="h-3.5 w-3.5 text-sky-400" />
              <span>Filter:</span>
            </span>

            {/* Severity Filter */}
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="py-1 px-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">🔴 Critical Only</option>
              <option value="HIGH">🟠 High Priority</option>
              <option value="MODERATE">🟡 Moderate</option>
              <option value="LOW">🟢 Low Severity</option>
            </select>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="py-1 px-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="EVACUATION">Evacuation</option>
              <option value="MEDICAL">Medical Trauma</option>
              <option value="FOOD_WATER">Food & Water</option>
              <option value="RESCUE">Search & Rescue</option>
              <option value="SHELTER_NEEDED">Shelter Needed</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="py-1 px-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none"
            >
              <option value="ACTIVE">Active Incidents Only</option>
              <option value="ALL">All Statuses</option>
              <option value="RESOLVED">Resolved Only</option>
            </select>

            {/* Unassigned Only */}
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-950 border border-slate-800 select-none">
              <input
                type="checkbox"
                checked={filterUnassignedOnly}
                onChange={(e) => setFilterUnassignedOnly(e.target.checked)}
                className="rounded border-slate-700 text-sky-500 focus:ring-0"
              />
              <span className="text-[11px]">Unassigned Only</span>
            </label>
          </div>

          {/* Layer Visibility Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => toggleLayer("disasters")}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition flex items-center gap-1 ${
                activeLayers.disasters
                  ? "bg-purple-950/80 text-purple-300 border-purple-800"
                  : "bg-slate-950 text-slate-500 border-slate-800"
              }`}
            >
              <Flame className="h-3 w-3" />
              <span>Disasters ({layersData?.disasters?.length || 0})</span>
            </button>

            <button
              onClick={() => toggleLayer("sos")}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition flex items-center gap-1 ${
                activeLayers.sos
                  ? "bg-red-950/80 text-red-300 border-red-800"
                  : "bg-slate-950 text-slate-500 border-slate-800"
              }`}
            >
              <LifeBuoy className="h-3 w-3" />
              <span>SOS ({layersData?.sos?.length || 0})</span>
            </button>

            <button
              onClick={() => toggleLayer("rescue")}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition flex items-center gap-1 ${
                activeLayers.rescue
                  ? "bg-cyan-950/80 text-cyan-300 border-cyan-800"
                  : "bg-slate-950 text-slate-500 border-slate-800"
              }`}
            >
              <Users2 className="h-3 w-3" />
              <span>Squads ({layersData?.rescueTeams?.length || 0})</span>
            </button>

            <button
              onClick={() => toggleLayer("shelters")}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition flex items-center gap-1 ${
                activeLayers.shelters
                  ? "bg-indigo-950/80 text-indigo-300 border-indigo-800"
                  : "bg-slate-950 text-slate-500 border-slate-800"
              }`}
            >
              <Home className="h-3 w-3" />
              <span>Shelters ({layersData?.shelters?.length || 0})</span>
            </button>

            <button
              onClick={() => toggleLayer("hospitals")}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition flex items-center gap-1 ${
                activeLayers.hospitals
                  ? "bg-emerald-950/80 text-emerald-300 border-emerald-800"
                  : "bg-slate-950 text-slate-500 border-slate-800"
              }`}
            >
              <Hospital className="h-3 w-3" />
              <span>Hospitals ({layersData?.hospitals?.length || 0})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div className="flex-1 relative overflow-hidden flex">
        <div className="flex-1 h-full w-full relative">
          <EmergencyMap
            layersData={layersData}
            activeLayers={activeLayers}
            filterSeverity={filterSeverity}
            filterCategory={filterCategory}
            filterStatus={filterStatus}
            filterUnassignedOnly={filterUnassignedOnly}
            isHeatmapMode={isHeatmapMode}
            isReportingMode={isReportingMode}
            onSelectEntity={(entity) => setSelectedEntity(entity)}
            onReportClick={handleMapReportClick}
          />

          {/* Floating On-Map Legend */}
          <MapLegend />
        </div>

        {/* Sliding Details Drawer */}
        <EmergencyDetailsDrawer
          entity={selectedEntity}
          allRescueTeams={layersData?.allRescueTeams || layersData?.rescueTeams || []}
          onClose={() => setSelectedEntity(null)}
          onStatusUpdate={handleStatusUpdate}
        />

        {/* Modal for reporting an emergency at pin location */}
        {reportingCoords && (
          <ReportEmergencyModal
            coordinates={reportingCoords}
            onClose={() => setReportingCoords(null)}
            onSuccess={(newSos) => {
              loadMapData(true);
              setSelectedEntity({ type: "SOS", data: newSos });
            }}
          />
        )}
      </div>
    </div>
  );
}
