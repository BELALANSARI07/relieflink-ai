"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import {
  Hospital,
  Bed,
  HeartPulse,
  Phone,
  MapPin,
  Plus,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Hospital as HospitalType } from "@/types";

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<HospitalType[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadHospitals();
  }, []);

  async function loadHospitals() {
    try {
      const res = await fetch("/api/hospitals");
      const json = await res.json();
      if (json.success) setHospitals(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdjustBeds(id: string, deltaBeds: number, deltaIcu: number) {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/hospitals/${id}/updates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bedsChange: deltaBeds, icuChange: deltaIcu }),
      });
      const json = await res.json();
      if (json.success) {
        setHospitals((prev) => prev.map((h) => (h.id === id ? json.data : h)));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Emergency Medical & Trauma Hospital Network"
        subtitle="National Disaster Management Grid • Real-Time Bed Availability, ICU Surges & Level-1 Trauma Readiness"
      />

      <main className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Medical Facilities & Triage Centers
            </h2>
            <p className="text-xs text-slate-500">
              Live casualty intake tracking and critical ICU ventilator availability.
            </p>
          </div>
        </div>

        {/* Hospitals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {hospitals.map((h) => {
            const hasAvailableBeds = h.availableBeds > 0;
            const hasIcu = h.availableIcu > 0;

            return (
              <div
                key={h.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {h.name}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase tracking-wider shrink-0">
                      TRAUMA READY
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                    <span>{h.address}</span>
                  </p>

                  {/* Bed & ICU Capacity Cards */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                        <Bed className="h-3.5 w-3.5 text-sky-500" />
                        <span>General Beds</span>
                      </div>
                      <p className="text-lg font-black text-slate-900 dark:text-white">
                        {h.availableBeds} <span className="text-xs text-slate-400 font-normal">/ {h.totalBeds}</span>
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                        <HeartPulse className="h-3.5 w-3.5 text-red-500" />
                        <span>ICU Ventilators</span>
                      </div>
                      <p className="text-lg font-black text-red-500">
                        {h.availableIcu} <span className="text-xs text-slate-400 font-normal">/ {h.icuBeds}</span>
                      </p>
                    </div>
                  </div>

                  {/* Specializations */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Clinical Capabilities
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {h.specializations.map((spec, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live Adjustment Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Adjust Intake Capacity
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAdjustBeds(h.id, -5, -1)}
                      disabled={updatingId === h.id || h.availableBeds < 5}
                      className="flex-1 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition"
                    >
                      Admit Casualties (-5)
                    </button>
                    <button
                      onClick={() => handleAdjustBeds(h.id, 5, 1)}
                      disabled={updatingId === h.id}
                      className="flex-1 py-1 rounded bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-800 text-xs font-semibold transition"
                    >
                      Discharge / Free (+5)
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
