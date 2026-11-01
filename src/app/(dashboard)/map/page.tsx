"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import {
  MapPin,
  Layers,
  Flame,
  LifeBuoy,
  Users2,
  Home,
  Hospital,
  AlertTriangle,
  Info,
  CheckCircle2,
  Filter,
} from "lucide-react";
import { getSeverityBadgeClass, getStatusBadgeClass } from "@/lib/utils";

export default function InteractiveMapPage() {
  const [layersData, setLayersData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeLayers, setActiveLayers] = useState({
    disasters: true,
    sos: true,
    rescue: true,
    shelters: true,
    hospitals: true,
  });

  const [selectedEntity, setSelectedEntity] = useState<any>(null);

  useEffect(() => {
    async function loadMapData() {
      try {
        const res = await fetch("/api/map/layers");
        const json = await res.json();
        if (json.success) {
          setLayersData(json.data);
          // Default select first critical disaster
          if (json.data.disasters?.length > 0) {
            setSelectedEntity({ type: "DISASTER", data: json.data.disasters[0] });
          }
        }
      } catch (err) {
        console.error("Map layer fetch failed", err);
      } finally {
        setLoading(false);
      }
    }
    loadMapData();
  }, []);

  function toggleLayer(key: keyof typeof activeLayers) {
    setActiveLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="flex-1 flex flex-col h-screen">
      <Header
        title="Interactive Geospatial Incident Map"
        subtitle="Multi-Agency Geographical Visualization • Live SOS Distress Clusters, Rescue Units & Capacity Grid"
      />

      <div className="flex-1 flex overflow-hidden relative">
        {/* Map Canvas / Grid Representation */}
        <div className="flex-1 bg-slate-950 relative overflow-hidden flex flex-col justify-between p-6">
          {/* Subtle Geospatial Grid Texture */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* Map Header Controls */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 backdrop-blur border border-slate-800 p-3 rounded-xl shadow-lg">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-sky-400" />
              <span className="text-xs font-bold text-white">Layer Visibility:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button
                onClick={() => toggleLayer("disasters")}
                className={`px-2.5 py-1 rounded-lg border font-semibold flex items-center gap-1.5 transition ${
                  activeLayers.disasters
                    ? "bg-purple-950 text-purple-300 border-purple-800"
                    : "bg-slate-800 text-slate-500 border-slate-700"
                }`}
              >
                <Flame className="h-3.5 w-3.5" />
                <span>Disaster Zones ({layersData?.disasters?.length || 0})</span>
              </button>

              <button
                onClick={() => toggleLayer("sos")}
                className={`px-2.5 py-1 rounded-lg border font-semibold flex items-center gap-1.5 transition ${
                  activeLayers.sos
                    ? "bg-red-950 text-red-300 border-red-800"
                    : "bg-slate-800 text-slate-500 border-slate-700"
                }`}
              >
                <LifeBuoy className="h-3.5 w-3.5" />
                <span>Citizen SOS ({layersData?.sos?.length || 0})</span>
              </button>

              <button
                onClick={() => toggleLayer("rescue")}
                className={`px-2.5 py-1 rounded-lg border font-semibold flex items-center gap-1.5 transition ${
                  activeLayers.rescue
                    ? "bg-sky-950 text-sky-300 border-sky-800"
                    : "bg-slate-800 text-slate-500 border-slate-700"
                }`}
              >
                <Users2 className="h-3.5 w-3.5" />
                <span>Rescue Squads ({layersData?.rescueTeams?.length || 0})</span>
              </button>

              <button
                onClick={() => toggleLayer("shelters")}
                className={`px-2.5 py-1 rounded-lg border font-semibold flex items-center gap-1.5 transition ${
                  activeLayers.shelters
                    ? "bg-indigo-950 text-indigo-300 border-indigo-800"
                    : "bg-slate-800 text-slate-500 border-slate-700"
                }`}
              >
                <Home className="h-3.5 w-3.5" />
                <span>Shelters ({layersData?.shelters?.length || 0})</span>
              </button>

              <button
                onClick={() => toggleLayer("hospitals")}
                className={`px-2.5 py-1 rounded-lg border font-semibold flex items-center gap-1.5 transition ${
                  activeLayers.hospitals
                    ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                    : "bg-slate-800 text-slate-500 border-slate-700"
                }`}
              >
                <Hospital className="h-3.5 w-3.5" />
                <span>Hospitals ({layersData?.hospitals?.length || 0})</span>
              </button>
            </div>
          </div>

          {/* Interactive Geospatial Markers Cluster Canvas */}
          <div className="relative z-10 flex-1 my-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 overflow-y-auto">
            <div className="text-[11px] font-mono text-slate-400 mb-4 flex items-center justify-between">
              <span>ACTIVE SECTOR: Western Coastal Estuary (Lat 19.0760, Lng 72.8777)</span>
              <span>DATUM: WGS84 • PROJECTION: Spherical Mercator</span>
            </div>

            {/* Simulated Geospatial Grid Nodes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeLayers.disasters &&
                layersData?.disasters?.map((d: any) => (
                  <div
                    key={d.id}
                    onClick={() => setSelectedEntity({ type: "DISASTER", data: d })}
                    className={`p-3.5 rounded-xl border cursor-pointer transition ${
                      selectedEntity?.data?.id === d.id
                        ? "bg-purple-950/80 border-purple-500 shadow-md"
                        : "bg-slate-900/80 border-purple-900/50 hover:border-purple-600"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-purple-300 flex items-center gap-1.5">
                        <Flame className="h-4 w-4 text-purple-400" />
                        <span>{d.title}</span>
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-900 text-purple-200">
                        {d.severity}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{d.address}</p>
                    <p className="text-[10px] text-purple-400 font-mono mt-2">
                      Radius: {d.affectedRadiusKm} km • Status: {d.status}
                    </p>
                  </div>
                ))}

              {activeLayers.sos &&
                layersData?.sos?.map((s: any) => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedEntity({ type: "SOS", data: s })}
                    className={`p-3.5 rounded-xl border cursor-pointer transition ${
                      selectedEntity?.data?.id === s.id
                        ? "bg-red-950/80 border-red-500 shadow-md"
                        : "bg-slate-900/80 border-red-900/50 hover:border-red-600"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-red-300 flex items-center gap-1.5">
                        <LifeBuoy className="h-4 w-4 text-red-400" />
                        <span>{s.id}: {s.type}</span>
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-900 text-red-200">
                        {s.severity}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{s.address}</p>
                    <p className="text-[10px] text-red-400 font-mono mt-2">
                      Status: {s.status} • {s.peopleCount} Affected
                    </p>
                  </div>
                ))}

              {activeLayers.rescue &&
                layersData?.rescueTeams?.map((t: any) => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedEntity({ type: "RESCUE_TEAM", data: t })}
                    className={`p-3.5 rounded-xl border cursor-pointer transition ${
                      selectedEntity?.data?.id === t.id
                        ? "bg-sky-950/80 border-sky-500 shadow-md"
                        : "bg-slate-900/80 border-sky-900/50 hover:border-sky-600"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-sky-300 flex items-center gap-1.5">
                        <Users2 className="h-4 w-4 text-sky-400" />
                        <span>{t.name}</span>
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-900 text-sky-200">
                        {t.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Specialization: {t.specialization}</p>
                    <p className="text-[10px] text-sky-400 font-mono mt-2">
                      Capacity: {t.capacity} Personnel
                    </p>
                  </div>
                ))}

              {activeLayers.shelters &&
                layersData?.shelters?.map((sh: any) => (
                  <div
                    key={sh.id}
                    onClick={() => setSelectedEntity({ type: "SHELTER", data: sh })}
                    className={`p-3.5 rounded-xl border cursor-pointer transition ${
                      selectedEntity?.data?.id === sh.id
                        ? "bg-indigo-950/80 border-indigo-500 shadow-md"
                        : "bg-slate-900/80 border-indigo-900/50 hover:border-indigo-600"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                        <Home className="h-4 w-4 text-indigo-400" />
                        <span>{sh.name}</span>
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-900 text-indigo-200">
                        {sh.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{sh.currentOccupancy} / {sh.totalCapacity} beds filled</p>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                      <div
                        className="bg-indigo-500 h-1.5 rounded-full"
                        style={{ width: `${sh.occupancyPercent}%` }}
                      />
                    </div>
                  </div>
                ))}

              {activeLayers.hospitals &&
                layersData?.hospitals?.map((h: any) => (
                  <div
                    key={h.id}
                    onClick={() => setSelectedEntity({ type: "HOSPITAL", data: h })}
                    className={`p-3.5 rounded-xl border cursor-pointer transition ${
                      selectedEntity?.data?.id === h.id
                        ? "bg-emerald-950/80 border-emerald-500 shadow-md"
                        : "bg-slate-900/80 border-emerald-900/50 hover:border-emerald-600"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                        <Hospital className="h-4 w-4 text-emerald-400" />
                        <span>{h.name}</span>
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-900 text-emerald-200">
                        {h.availableBeds} Beds Ready
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">ICU Ready: {h.availableIcu} / {h.icuBeds} units</p>
                    <p className="text-[10px] text-emerald-400 font-mono mt-2">
                      Level-1 Trauma Emergency
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Selected Entity Inspector Panel (Right Drawer) */}
        {selectedEntity && (
          <aside className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-5 overflow-y-auto space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {selectedEntity.type} INSPECTOR
              </span>
              <button
                onClick={() => setSelectedEntity(null)}
                className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                ✕ Close
              </button>
            </div>

            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {selectedEntity.data.title || selectedEntity.data.name || selectedEntity.data.id}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {selectedEntity.data.address || `${selectedEntity.data.latitude}, ${selectedEntity.data.longitude}`}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
              {Object.entries(selectedEntity.data).map(([key, val]) => {
                if (typeof val === "object" || key === "title" || key === "name" || key === "address") return null;
                return (
                  <div key={key} className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400 uppercase tracking-wide">{key}</span>
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{String(val)}</span>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              {selectedEntity.type === "DISASTER" && (
                <a
                  href={`/disasters/${selectedEntity.data.id}`}
                  className="block text-center w-full py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition"
                >
                  Open Incident Command View →
                </a>
              )}
              {selectedEntity.type === "SOS" && (
                <a
                  href={`/sos`}
                  className="block text-center w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition"
                >
                  Dispatch Rescue Squad →
                </a>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
