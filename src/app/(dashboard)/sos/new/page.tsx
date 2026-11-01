"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import {
  LifeBuoy,
  MapPin,
  Phone,
  AlertTriangle,
  Users2,
  CheckCircle2,
  Loader2,
  HeartPulse,
  Flame,
  ArrowLeft,
} from "lucide-react";

export default function SubmitSosPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    type: "EVACUATION",
    description: "",
    latitude: "19.0760",
    longitude: "72.8777",
    address: "",
    contactPhone: "",
    peopleCount: 1,
    medicalNeeds: "",
    citizenName: "",
  });

  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedSos, setSubmittedSos] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Auto-acquire GPS on mount
  useEffect(() => {
    captureLocation();
  }, []);

  function captureLocation() {
    if ("geolocation" in navigator) {
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setForm((prev) => ({
            ...prev,
            latitude: pos.coords.latitude.toFixed(4),
            longitude: pos.coords.longitude.toFixed(4),
          }));
          setLocating(false);
        },
        () => {
          setLocating(false);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.description.trim()) {
      setError("Please briefly describe your emergency situation.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/sos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();
      if (json.success) {
        setSubmittedSos(json.data.sos);
      } else {
        setError(json.error?.message || "Failed to submit SOS");
      }
    } catch (err: any) {
      setError(err.message || "Network error. Please call 112 directly.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Citizen Emergency Distress Beacon (SOS)"
        subtitle="Priority Live Broadcast to National & Regional Rescue Response Squads"
      />

      <main className="p-6 max-w-2xl mx-auto w-full space-y-6">
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {submittedSos ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-emerald-500/50 p-6 text-center space-y-4 shadow-lg">
            <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-500 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Emergency SOS Broadcast Dispatched
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Tracking Incident Reference ID: <strong className="font-mono text-sky-500">{submittedSos.id}</strong>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-left text-xs space-y-2">
              <p className="flex justify-between">
                <span className="text-slate-500">Triage Priority:</span>
                <span className="font-bold text-red-500">{submittedSos.severity}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-500">GPS Coordinates:</span>
                <span className="font-mono font-semibold">{submittedSos.latitude}, {submittedSos.longitude}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-sky-500">{submittedSos.status}</span>
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-900/50 text-xs text-amber-300 text-left space-y-1">
              <p className="font-bold">Immediate Safety Guidelines:</p>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                <li>Stay in place if structurally safe; do not walk into rushing water.</li>
                <li>Conserve mobile phone battery (switch on battery saver mode).</li>
                <li>If water is rising rapidly, wave a bright cloth or whistle to alert rescue boats.</li>
              </ul>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                href="/sos"
                className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold text-center transition"
              >
                Track Rescue Status
              </Link>
              <button
                onClick={() => setSubmittedSos(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200"
              >
                Submit Another Request
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Emergency Type Selector */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3 shadow-sm">
              <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Select Nature of Emergency *
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { id: "EVACUATION", label: "Evacuation / Trapped", icon: "🌊" },
                  { id: "MEDICAL", label: "Severe Medical Aid", icon: "🚑" },
                  { id: "FOOD_WATER", label: "Food & Water Needed", icon: "🍞" },
                  { id: "RESCUE", label: "Structural Collapse", icon: "🏗️" },
                  { id: "SHELTER", label: "Urgent Shelter", icon: "⛺" },
                  { id: "OTHER", label: "Other Crisis", icon: "⚠️" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setForm({ ...form, type: item.id })}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      form.type === item.id
                        ? "border-red-600 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 font-bold"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span className="text-xl mb-1">{item.icon}</span>
                    <span className="text-xs">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description & People Affected */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  What is happening right now? *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Water is up to chest level. 4 people on roof including a senior citizen. No drinking water."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Number of People Affected
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={form.peopleCount}
                    onChange={(e) => setForm({ ...form, peopleCount: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Callback Mobile Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91-98765-43210"
                    value={form.contactPhone}
                    onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Urgent Medical Needs (if any)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Diabetics requiring insulin, broken arm, infant needing formula"
                  value={form.medicalNeeds}
                  onChange={(e) => setForm({ ...form, medicalNeeds: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            {/* GPS Location Capture */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  GPS Incident Location
                </span>
                <button
                  type="button"
                  onClick={captureLocation}
                  disabled={locating}
                  className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                >
                  {locating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MapPin className="h-3.5 w-3.5" />}
                  <span>{locating ? "Acquiring GPS..." : "Re-detect GPS"}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Latitude</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{form.latitude}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Longitude</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{form.longitude}</span>
                </div>
              </div>

              <input
                type="text"
                placeholder="Street address / landmark nearby (e.g. Behind Water Tank, Main Bazaar Road)"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-sm tracking-wide shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>DISPATCHING SOS...</span>
                </>
              ) : (
                <>
                  <LifeBuoy className="h-5 w-5" />
                  <span>TRANSMIT EMERGENCY SOS NOW</span>
                </>
              )}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
