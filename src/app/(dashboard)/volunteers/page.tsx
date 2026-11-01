"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import {
  HandHeart,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Plus,
  Phone,
  Mail,
  Award,
} from "lucide-react";
import { Volunteer } from "@/types";

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    skills: "First Aid CPR, Off-Road Driving, Translation",
    address: "",
  });

  useEffect(() => {
    loadVolunteers();
  }, []);

  async function loadVolunteers() {
    try {
      const res = await fetch("/api/volunteers");
      const json = await res.json();
      if (json.success) setVolunteers(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/volunteers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          skills: form.skills.split(",").map((s) => s.trim()),
        }),
      });
      const json = await res.json();
      if (json.success) {
        setVolunteers((prev) => [...prev, json.data]);
        setShowRegisterModal(false);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Disaster Volunteer Coordination Network"
        subtitle="National Disaster Management Grid • Community Responders, Certified Specialists & Skill Matching"
      />

      <main className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Registered Community Volunteers
            </h2>
            <p className="text-xs text-slate-500">
              Mobilizing certified first-aiders, ham radio operators, and field coordinators.
            </p>
          </div>

          <button
            onClick={() => setShowRegisterModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-sm transition"
          >
            <Plus className="h-4 w-4" />
            <span>Join as Volunteer</span>
          </button>
        </div>

        {/* Volunteer Directory */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {volunteers.map((v) => (
            <div
              key={v.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {v.fullName}
                    </h3>
                    <p className="text-xs text-slate-500">{v.address || "Volunteer Field Specialist"}</p>
                  </div>
                  {v.verified && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1 shrink-0">
                      <ShieldCheck className="h-3 w-3" />
                      <span>Certified</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      v.availabilityStatus === "AVAILABLE"
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                        : "bg-purple-950 text-purple-400 border border-purple-800"
                    }`}
                  >
                    {v.availabilityStatus}
                  </span>
                  <span className="text-slate-400 text-[11px] flex items-center gap-1">
                    <Award className="h-3.5 w-3.5 text-amber-500" />
                    <span>{v.hoursContributed} Hours Contributed</span>
                  </span>
                </div>

                {/* Skills */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Verified Skills
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {v.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 pt-1">
                  {v.phone && (
                    <p className="flex items-center gap-1.5 font-mono text-[11px]">
                      <Phone className="h-3 w-3 text-emerald-500" />
                      <span>{v.phone}</span>
                    </p>
                  )}
                  {v.email && (
                    <p className="flex items-center gap-1.5 text-[11px]">
                      <Mail className="h-3 w-3 text-sky-500" />
                      <span>{v.email}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Register Modal */}
        {showRegisterModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Volunteer Registration
                </h3>
                <button onClick={() => setShowRegisterModal(false)} className="text-xs text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="priya@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+91-98765-43210"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Skills (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="CPR First Aid, Medical Paramedic, Off-Road Driving, Translation"
                    value={form.skills}
                    onChange={(e) => setForm({ ...form, skills: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(false)}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold transition"
                  >
                    Enroll Volunteer
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
