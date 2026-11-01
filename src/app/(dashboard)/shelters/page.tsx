"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import {
  Home,
  Users2,
  MapPin,
  Phone,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Shelter } from "@/types";

export default function SheltersPage() {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    address: "",
    latitude: "19.0760",
    longitude: "72.8777",
    totalCapacity: 500,
    facilities: "Clean Water, Hot Kitchen, Medical Room",
    contactPhone: "",
  });

  useEffect(() => {
    loadShelters();
  }, []);

  async function loadShelters() {
    try {
      const res = await fetch("/api/shelters");
      const json = await res.json();
      if (json.success) setShelters(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdjustOccupancy(id: string, delta: number) {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/shelters/${id}/updates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ occupancyChange: delta }),
      });
      const json = await res.json();
      if (json.success) {
        setShelters((prev) => prev.map((s) => (s.id === id ? json.data : s)));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleCreateShelter(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/shelters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          facilities: form.facilities.split(",").map((f) => f.trim()),
        }),
      });
      const json = await res.json();
      if (json.success) {
        setShelters((prev) => [...prev, json.data]);
        setShowAddModal(false);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Evacuation Shelters & Relief Camps"
        subtitle="National Disaster Management Grid • Real-Time Headcount, Capacity Routing & Intake Coordination"
      />

      <main className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Emergency Shelters Network
            </h2>
            <p className="text-xs text-slate-500">
              Live capacity monitoring and intake routing for displaced communities.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-sm transition"
          >
            <Plus className="h-4 w-4" />
            <span>Register New Shelter</span>
          </button>
        </div>

        {/* Shelters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {shelters.map((s) => {
            const occupancyPct = Math.min(100, Math.round((s.currentOccupancy / s.totalCapacity) * 100));
            const isFull = occupancyPct >= 95;

            return (
              <div
                key={s.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {s.name}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                        isFull
                          ? "bg-red-950 text-red-400 border border-red-800"
                          : "bg-emerald-950 text-emerald-400 border border-emerald-800"
                      }`}
                    >
                      {isFull ? "FULL (NO INTAKE)" : "OPEN"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                    <span>{s.address}</span>
                  </p>

                  {/* Occupancy Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-500">Occupancy Level</span>
                      <span className={isFull ? "text-red-500 font-bold" : "text-slate-900 dark:text-white"}>
                        {s.currentOccupancy} / {s.totalCapacity} ({occupancyPct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          occupancyPct > 90 ? "bg-red-500" : occupancyPct > 70 ? "bg-amber-500" : "bg-emerald-500"
                        }`}
                        style={{ width: `${occupancyPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Facilities */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Available Facilities
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {s.facilities.map((fac, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                        >
                          {fac}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Adjust Occupancy Quick Buttons */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Update Evacuee Influx
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAdjustOccupancy(s.id, 25)}
                      disabled={updatingId === s.id}
                      className="flex-1 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition"
                    >
                      +25
                    </button>
                    <button
                      onClick={() => handleAdjustOccupancy(s.id, 50)}
                      disabled={updatingId === s.id}
                      className="flex-1 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition"
                    >
                      +50
                    </button>
                    <button
                      onClick={() => handleAdjustOccupancy(s.id, -25)}
                      disabled={updatingId === s.id || s.currentOccupancy <= 0}
                      className="flex-1 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition"
                    >
                      -25
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Register Shelter Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Register Shelter / Relief Camp
                </h3>
                <button onClick={() => setShowAddModal(false)} className="text-xs text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateShelter} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Center / Building Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. City Central Sports Complex"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Address / Landmark *</label>
                  <input
                    type="text"
                    required
                    placeholder="Sector 4, Near Metro Station"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Total Capacity (Beds) *</label>
                    <input
                      type="number"
                      required
                      min="10"
                      value={form.totalCapacity}
                      onChange={(e) => setForm({ ...form, totalCapacity: parseInt(e.target.value, 10) || 100 })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Emergency Phone</label>
                    <input
                      type="tel"
                      placeholder="+91-22-2400000"
                      value={form.contactPhone}
                      onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Facilities (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="Clean Water, Community Kitchen, Medical Post, Solar Lights"
                    value={form.facilities}
                    onChange={(e) => setForm({ ...form, facilities: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold transition"
                  >
                    Register Center
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
