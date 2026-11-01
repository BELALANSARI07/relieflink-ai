"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Flame, Bot, MapPin, ArrowLeft, Loader2, Sparkles, AlertCircle } from "lucide-react";

export default function NewDisasterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "FLOOD",
    severity: "HIGH",
    latitude: "19.0760",
    longitude: "72.8777",
    address: "",
    affectedRadiusKm: "15",
  });

  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // AI Classification Trigger
  async function runAiClassification() {
    if (!form.description || form.description.length < 10) {
      setError("Please enter a detailed description first for AI triage.");
      return;
    }
    setError(null);
    setAiAnalyzing(true);
    try {
      const res = await fetch("/api/ai/classify-disaster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: form.description }),
      });
      const json = await res.json();
      if (json.success) {
        setAiResult(json.data);
        setForm((prev) => ({
          ...prev,
          type: json.data.type || prev.type,
          severity: json.data.severity || prev.severity,
          affectedRadiusKm: json.data.recommendedRadiusKm?.toString() || prev.affectedRadiusKm,
        }));
      }
    } catch (err: any) {
      console.error(err);
      setError("AI analysis service unavailable.");
    } finally {
      setAiAnalyzing(false);
    }
  }

  // Use Current Geolocation
  function captureGeolocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setForm((prev) => ({
            ...prev,
            latitude: pos.coords.latitude.toFixed(4),
            longitude: pos.coords.longitude.toFixed(4),
          }));
        },
        () => {
          setError("Could not retrieve GPS coordinates.");
        }
      );
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/disasters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();
      if (json.success) {
        router.push(`/disasters/${json.data.id}`);
      } else {
        setError(json.error?.message || "Failed to declare disaster");
      }
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Declare Disaster Incident"
        subtitle="National Disaster Management Grid • Official Emergency Declaration & Multi-Agency Dispatch"
      />

      <main className="p-6 max-w-4xl mx-auto w-full space-y-6">
        <div className="flex items-center gap-2">
          <Link
            href="/disasters"
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Disasters</span>
          </Link>
        </div>

        {error && (
          <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Incident Description & AI Auto-Triage */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  1. Incident Details & Early Triage
                </h3>
                <p className="text-xs text-slate-500">Provide official bulletin text or field report.</p>
              </div>
              <button
                type="button"
                onClick={runAiClassification}
                disabled={aiAnalyzing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-950 hover:bg-sky-900 border border-sky-800 text-sky-300 text-xs font-semibold transition"
              >
                {aiAnalyzing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                <span>Auto-Classify with AI</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Incident Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Cyclone Varuna — Coastal Inundation & Gale Warning"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Field Situation Description *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe current severity, observed inundation, wind velocity, damaged bridges, or infrastructure disruption..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {aiResult && (
              <div className="p-3.5 rounded-lg bg-sky-950/30 border border-sky-800/60 text-xs space-y-1">
                <div className="flex items-center justify-between text-sky-400 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Bot className="h-4 w-4" />
                    <span>AI Classification: {aiResult.type} ({aiResult.severity})</span>
                  </span>
                  <span>Confidence: {Math.round(aiResult.confidence * 100)}%</span>
                </div>
                <p className="text-slate-300 text-[11px]">{aiResult.explanation}</p>
              </div>
            )}
          </div>

          {/* Section 2: Severity, Type & Scope */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              2. Classification & Scope
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Disaster Type *
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="FLOOD">Flood</option>
                  <option value="HURRICANE">Cyclone / Hurricane</option>
                  <option value="EARTHQUAKE">Earthquake</option>
                  <option value="TSUNAMI">Tsunami</option>
                  <option value="WILDFIRE">Wildfire</option>
                  <option value="LANDSLIDE">Landslide</option>
                  <option value="INDUSTRIAL_ACCIDENT">Industrial Accident</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Severity Level *
                </label>
                <select
                  value={form.severity}
                  onChange={(e) => setForm({ ...form, severity: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="CATASTROPHIC">Catastrophic</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH">High</option>
                  <option value="MODERATE">Moderate</option>
                  <option value="LOW">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Affected Radius (km) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="500"
                  value={form.affectedRadiusKm}
                  onChange={(e) => setForm({ ...form, affectedRadiusKm: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Geographic Coordinates */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                3. Incident Location & Epicenter
              </h3>
              <button
                type="button"
                onClick={captureGeolocation}
                className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
              >
                <MapPin className="h-3.5 w-3.5" />
                <span>Use My Location</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Latitude *
                </label>
                <input
                  type="text"
                  required
                  value={form.latitude}
                  onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Longitude *
                </label>
                <input
                  type="text"
                  required
                  value={form.longitude}
                  onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Regional Address / Sector Description
              </label>
              <input
                type="text"
                placeholder="e.g. Mahim Estuary, Bandra Reclamation Coastal Corridor, Mumbai"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Link
              href="/disasters"
              className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-300 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition"
            >
              {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Publish Official Declaration</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
