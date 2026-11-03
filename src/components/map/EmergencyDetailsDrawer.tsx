"use client";

import { useState } from "react";
import Link from "next/link";
import {
  X,
  MapPin,
  LifeBuoy,
  Flame,
  Users2,
  Home,
  Hospital,
  AlertTriangle,
  Clock,
  Compass,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  UserCheck,
  Loader2,
} from "lucide-react";
import { getSeverityBadgeClass, getStatusBadgeClass, formatTimeAgo, formatDate } from "@/lib/utils";

interface EmergencyDetailsDrawerProps {
  entity: {
    type: "SOS" | "DISASTER" | "RESCUE_TEAM" | "SHELTER" | "HOSPITAL";
    data: any;
  } | null;
  allRescueTeams?: any[];
  onClose: () => void;
  onStatusUpdate?: (id: string, newStatus: string, assignedTeamId?: string) => Promise<void>;
  onFlyTo?: (lat: number, lng: number) => void;
}

export function EmergencyDetailsDrawer({
  entity,
  allRescueTeams = [],
  onClose,
  onStatusUpdate,
  onFlyTo,
}: EmergencyDetailsDrawerProps) {
  const [copied, setCopied] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  if (!entity) return null;

  const { type, data } = entity;

  function copyCoordinates() {
    if (data.latitude && data.longitude) {
      navigator.clipboard.writeText(`${data.latitude}, ${data.longitude}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function handleAssignSquad() {
    if (!selectedTeamId || !onStatusUpdate) return;
    setUpdating(true);
    try {
      await onStatusUpdate(data.id, data.status, selectedTeamId);
    } finally {
      setUpdating(false);
    }
  }

  async function handleUpdateStatus(newStatus: string) {
    if (!onStatusUpdate) return;
    setUpdating(true);
    try {
      await onStatusUpdate(data.id, newStatus);
    } finally {
      setUpdating(false);
    }
  }

  const gmapsUrl =
    data.latitude && data.longitude
      ? `https://www.google.com/maps/dir/?api=1&destination=${data.latitude},${data.longitude}`
      : null;

  const osmUrl =
    data.latitude && data.longitude
      ? `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=;${data.latitude},${data.longitude}`
      : null;

  return (
    <div className="absolute right-0 top-0 bottom-0 w-full sm:w-96 z-[1000] bg-slate-900/95 backdrop-blur-md border-l border-slate-800 shadow-2xl flex flex-col text-slate-100 overflow-hidden animate-in slide-in-from-right duration-200">
      {/* Top Banner Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {type === "SOS" && (
            <div className="h-8 w-8 rounded-lg bg-red-950 border border-red-800 text-red-400 flex items-center justify-center">
              <LifeBuoy className="h-4 w-4" />
            </div>
          )}
          {type === "DISASTER" && (
            <div className="h-8 w-8 rounded-lg bg-purple-950 border border-purple-800 text-purple-400 flex items-center justify-center">
              <Flame className="h-4 w-4" />
            </div>
          )}
          {type === "RESCUE_TEAM" && (
            <div className="h-8 w-8 rounded-lg bg-sky-950 border border-sky-800 text-sky-400 flex items-center justify-center">
              <Users2 className="h-4 w-4" />
            </div>
          )}
          {type === "SHELTER" && (
            <div className="h-8 w-8 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-400 flex items-center justify-center">
              <Home className="h-4 w-4" />
            </div>
          )}
          {type === "HOSPITAL" && (
            <div className="h-8 w-8 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center">
              <Hospital className="h-4 w-4" />
            </div>
          )}

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              {type.replace("_", " ")} RECORD
            </span>
            <h3 className="font-bold text-sm text-white truncate max-w-[200px]">
              {data.name || data.title || data.id}
            </h3>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Status & Severity Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {data.severity && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getSeverityBadgeClass(data.severity)}`}>
              {data.severity}
            </span>
          )}
          {data.status && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getStatusBadgeClass(data.status)}`}>
              {data.status}
            </span>
          )}
          {data.type && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
              {data.type}
            </span>
          )}
        </div>

        {/* Location & Coordinates Box */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-200">
                {data.address || "Sector Location"}
              </p>
              <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                {data.latitude?.toFixed(5)}, {data.longitude?.toFixed(5)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-slate-850">
            <button
              onClick={copyCoordinates}
              className="flex-1 py-1 px-2 rounded bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-[11px] flex items-center justify-center gap-1 transition"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              <span>{copied ? "Copied" : "Copy GPS"}</span>
            </button>

            {onFlyTo && data.latitude && data.longitude && (
              <button
                onClick={() => onFlyTo(data.latitude, data.longitude)}
                className="flex-1 py-1 px-2 rounded bg-sky-950 hover:bg-sky-900 border border-sky-800 text-sky-300 font-semibold text-[11px] flex items-center justify-center gap-1 transition"
              >
                <Compass className="h-3 w-3 text-sky-400" />
                <span>Focus Map</span>
              </button>
            )}
          </div>
        </div>

        {/* SOS Specific Details */}
        {type === "SOS" && (
          <>
            {/* Description */}
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 block">
                Distress Situation:
              </span>
              <p className="text-xs text-slate-200 bg-slate-950/50 p-3 rounded-lg border border-slate-800/80 leading-relaxed">
                {data.description || "No situation description provided."}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Persons Trapped</span>
                <span className="text-base font-black text-white">{data.peopleCount || 1}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Time Reported</span>
                <span className="text-xs font-semibold text-slate-300 mt-1 block">
                  {data.createdAt ? formatTimeAgo(data.createdAt) : "Recently"}
                </span>
              </div>
            </div>

            {/* Medical Needs */}
            {data.medicalNeeds && (
              <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-900/60 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 block mb-0.5">
                  Critical Medical Requirements:
                </span>
                <p className="text-slate-200">{data.medicalNeeds}</p>
              </div>
            )}

            {/* Tactical Squad Assignment */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-sky-400 flex items-center gap-1">
                  <UserCheck className="h-3.5 w-3.5" />
                  <span>Assigned Response Squad</span>
                </span>
                <span className="text-[10px] text-slate-400">
                  {data.assignedTeamName ? "Active" : "Unassigned"}
                </span>
              </div>

              {data.assignedTeamName ? (
                <div className="p-2 rounded bg-sky-950/40 border border-sky-800/60 text-xs text-sky-200 font-semibold">
                  🛡️ {data.assignedTeamName}
                </div>
              ) : (
                <p className="text-[11px] text-amber-400">⚠️ No tactical team assigned yet.</p>
              )}

              {/* Assign Squad Dropdown */}
              <div className="flex items-center gap-1.5 pt-1">
                <select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-slate-900 border border-slate-750 text-slate-200 text-xs focus:outline-none"
                >
                  <option value="">Select Response Team...</option>
                  {allRescueTeams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name} ({team.specialization})
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAssignSquad}
                  disabled={!selectedTeamId || updating}
                  className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-semibold text-xs transition"
                >
                  {updating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Assign"}
                </button>
              </div>
            </div>

            {/* Status Transition Buttons */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-400 block">
                Update Mission Status:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleUpdateStatus("PENDING")}
                  disabled={updating || data.status === "PENDING"}
                  className={`py-1.5 rounded-lg text-xs font-semibold border transition ${
                    data.status === "PENDING"
                      ? "bg-amber-950 border-amber-800 text-amber-300"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => handleUpdateStatus("IN_PROGRESS")}
                  disabled={updating || data.status === "IN_PROGRESS"}
                  className={`py-1.5 rounded-lg text-xs font-semibold border transition ${
                    data.status === "IN_PROGRESS"
                      ? "bg-sky-950 border-sky-800 text-sky-300"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => handleUpdateStatus("RESOLVED")}
                  disabled={updating || data.status === "RESOLVED"}
                  className={`py-1.5 rounded-lg text-xs font-semibold border transition ${
                    data.status === "RESOLVED"
                      ? "bg-emerald-950 border-emerald-800 text-emerald-300"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  Resolved
                </button>
              </div>
            </div>
          </>
        )}

        {/* Disaster Specific Details */}
        {type === "DISASTER" && (
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 block">Affected Geographical Radius</span>
              <p className="text-sm font-bold text-white">{data.affectedRadiusKm} km Perimeter</p>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-lg border border-slate-800">
              {data.description || "Active regional emergency advisory in effect."}
            </p>
            <Link
              href={`/disasters/${data.id}`}
              className="block w-full py-2 text-center rounded-xl bg-purple-950 hover:bg-purple-900 border border-purple-800 text-purple-300 font-semibold text-xs transition"
            >
              Open Incident Command Dashboard →
            </Link>
          </div>
        )}

        {/* Shelter Specific Details */}
        {type === "SHELTER" && (
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Occupancy:</span>
                <span className="font-bold text-white">
                  {data.currentOccupancy} / {data.totalCapacity} ({data.occupancyPercent}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full ${
                    data.occupancyPercent > 80 ? "bg-red-500" : "bg-indigo-500"
                  }`}
                  style={{ width: `${Math.min(100, data.occupancyPercent)}%` }}
                />
              </div>
            </div>
            <Link
              href="/shelters"
              className="block w-full py-2 text-center rounded-xl bg-indigo-950 hover:bg-indigo-900 border border-indigo-800 text-indigo-300 font-semibold text-xs transition"
            >
              Manage Shelter Capacity →
            </Link>
          </div>
        )}

        {/* Hospital Specific Details */}
        {type === "HOSPITAL" && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Available Beds</span>
                <span className="text-lg font-black text-emerald-400">{data.availableBeds}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Available ICU</span>
                <span className="text-lg font-black text-teal-400">{data.availableIcu}</span>
              </div>
            </div>
            <Link
              href="/hospitals"
              className="block w-full py-2 text-center rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 font-semibold text-xs transition"
            >
              Open Trauma Surge Grid →
            </Link>
          </div>
        )}

        {/* External Turn-by-Turn Navigation */}
        <div className="pt-2 border-t border-slate-850 space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 block">
            Emergency Route Navigation:
          </span>
          <div className="grid grid-cols-2 gap-2">
            {gmapsUrl && (
              <a
                href={gmapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-center font-semibold text-[11px] flex items-center justify-center gap-1.5 transition"
              >
                <span>Google Maps</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
            {osmUrl && (
              <a
                href={osmUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-center font-semibold text-[11px] flex items-center justify-center gap-1.5 transition"
              >
                <span>OpenStreetMap</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
