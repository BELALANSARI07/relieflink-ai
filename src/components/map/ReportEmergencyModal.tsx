"use client";

import { useState, useEffect } from "react";
import {
  LifeBuoy,
  X,
  MapPin,
  AlertTriangle,
  Users,
  HeartPulse,
  Phone,
  User,
  CheckCircle2,
  Loader2,
} from "lucide-react";

interface ReportEmergencyModalProps {
  coordinates: { lat: number; lng: number } | null;
  onClose: () => void;
  onSuccess: (newSos: any) => void;
}

export function ReportEmergencyModal({
  coordinates,
  onClose,
  onSuccess,
}: ReportEmergencyModalProps) {
  const [lat, setLat] = useState<string>("");
  const [lng, setLng] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [type, setType] = useState<string>("EVACUATION");
  const [severity, setSeverity] = useState<string>("CRITICAL");
  const [peopleCount, setPeopleCount] = useState<number>(1);
  const [description, setDescription] = useState<string>("");
  const [medicalNeeds, setMedicalNeeds] = useState<string>("");
  const [citizenName, setCitizenName] = useState<string>("");
  const [contactPhone, setContactPhone] = useState<string>("");

  const [loadingAddress, setLoadingAddress] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (coordinates) {
      setLat(coordinates.lat.toFixed(6));
      setLng(coordinates.lng.toFixed(6));
      setAddress(`Sector coordinates [${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}]`);

      // Attempt reverse geocoding via OpenStreetMap Nominatim
      async function reverseGeocode() {
        setLoadingAddress(true);
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 3500);

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates?.lat}&lon=${coordinates?.lng}`,
            {
              headers: { "Accept-Language": "en" },
              signal: controller.signal,
            }
          );
          clearTimeout(timeout);

          if (res.ok) {
            const data = await res.json();
            if (data && data.display_name) {
              setAddress(data.display_name);
            }
          }
        } catch {
          // If offline or timeout, keep coordinates fallback
        } finally {
          setLoadingAddress(false);
        }
      }
      reverseGeocode();
    }
  }, [coordinates]);

  if (!coordinates) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);

    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      setError("Please enter valid geographical coordinates.");
      return;
    }

    if (parsedLat < -90 || parsedLat > 90 || parsedLng < -180 || parsedLng > 180) {
      setError("Coordinates out of valid planetary bounds (-90 to 90 lat, -180 to 180 lng).");
      return;
    }

    if (!description.trim()) {
      setError("Please describe the emergency situation so rescue teams can prepare.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/sos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          severity,
          latitude: parsedLat,
          longitude: parsedLng,
          address,
          description,
          peopleCount,
          medicalNeeds: medicalNeeds.trim() || undefined,
          citizenName: citizenName.trim() || "Field Dispatcher",
          contactPhone: contactPhone.trim() || "+91-98765-00000",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to register emergency");
      }

      onSuccess(json.data.sos);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to submit emergency report");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-150 my-6">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-red-950/80 to-slate-900 border-b border-red-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-red-600/30 border border-red-500/50 flex items-center justify-center text-red-400">
              <LifeBuoy className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                Report Emergency at Pin Location
              </h2>
              <p className="text-[11px] text-red-300">
                Lat: {lat} • Lng: {lng}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-lg bg-red-950/80 border border-red-800 text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Location & Reverse Geocoded Address */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <label className="font-semibold flex items-center gap-1 text-[11px]">
                <MapPin className="h-3.5 w-3.5 text-sky-400" />
                <span>Verified Location / Address</span>
              </label>
              {loadingAddress && (
                <span className="text-[10px] text-sky-400 flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Reverse Geocoding...</span>
                </span>
              )}
            </div>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 text-xs"
              placeholder="Retrieving street/locality name..."
            />
          </div>

          {/* Manual Coordinates Override */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Latitude</label>
              <input
                type="text"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Longitude</label>
              <input
                type="text"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Category & Severity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Emergency Category
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 text-xs"
              >
                <option value="EVACUATION">Evacuation Needed</option>
                <option value="MEDICAL">Medical Trauma</option>
                <option value="FOOD_WATER">Food & Clean Water</option>
                <option value="RESCUE">Structural Search & Rescue</option>
                <option value="SHELTER_NEEDED">Emergency Shelter</option>
                <option value="OTHER">Other Distress</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Triage Severity
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 text-xs font-semibold"
              >
                <option value="CRITICAL">🔴 Critical (Life Threat)</option>
                <option value="HIGH">🟠 High Priority</option>
                <option value="MODERATE">🟡 Moderate Needs</option>
                <option value="LOW">🟢 Low Severity</option>
              </select>
            </div>
          </div>

          {/* People Count & Medical Needs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1 flex items-center gap-1">
                <Users className="h-3 w-3 text-sky-400" />
                <span>People Affected</span>
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={peopleCount}
                  onChange={(e) => setPeopleCount(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <button
                  type="button"
                  onClick={() => setPeopleCount(peopleCount + 1)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1 flex items-center gap-1">
                <HeartPulse className="h-3 w-3 text-red-400" />
                <span>Medical / Special Needs</span>
              </label>
              <input
                type="text"
                placeholder="Insulin, fractures, elderly, infants..."
                value={medicalNeeds}
                onChange={(e) => setMedicalNeeds(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Situation Description */}
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Distress Details / Situation
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe exact conditions: rising water levels, collapsed structure, cut off from road..."
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 text-xs resize-none"
            />
          </div>

          {/* Reporter Contact Info */}
          <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-800/80">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1 flex items-center gap-1">
                <User className="h-3 w-3 text-slate-400" />
                <span>Reporter Name</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Field Officer / Priya"
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1 flex items-center gap-1">
                <Phone className="h-3 w-3 text-slate-400" />
                <span>Contact Phone</span>
              </label>
              <input
                type="text"
                placeholder="+91-98765-43210"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition flex items-center gap-1.5"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Dispatching to Grid...</span>
                </>
              ) : (
                <>
                  <LifeBuoy className="h-4 w-4" />
                  <span>Pin & Dispatch Emergency</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
