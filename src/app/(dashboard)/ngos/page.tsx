"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Plus,
  Phone,
  Mail,
  ExternalLink,
  MapPin,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Ngo } from "@/types";

export default function NgoCoordinationPage() {
  const [ngos, setNgos] = useState<Ngo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [form, setForm] = useState({
    name: "",
    registrationNumber: "",
    description: "",
    capabilities: "Food Distribution, Potable Water (WASH), Blankets",
    contactEmail: "",
    contactPhone: "",
    address: "",
    website: "",
  });

  useEffect(() => {
    loadNgos();
  }, []);

  async function loadNgos() {
    try {
      const res = await fetch("/api/ngos");
      const json = await res.json();
      if (json.success) setNgos(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(id: string, verified: boolean) {
    try {
      const res = await fetch(`/api/ngos/${id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified }),
      });
      const json = await res.json();
      if (json.success) {
        setNgos((prev) => prev.map((n) => (n.id === id ? { ...n, verified, operationalStatus: verified ? "ACTIVE" : "PENDING_VERIFICATION" } : n)));
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setRegistering(true);
    try {
      const res = await fetch("/api/ngos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          capabilities: form.capabilities.split(",").map((c) => c.trim()),
        }),
      });
      const json = await res.json();
      if (json.success) {
        setNgos((prev) => [...prev, json.data]);
        setShowRegisterModal(false);
        setForm({
          name: "",
          registrationNumber: "",
          description: "",
          capabilities: "",
          contactEmail: "",
          contactPhone: "",
          address: "",
          website: "",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRegistering(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="NGO & Civil Society Relief Coordination"
        subtitle="National Disaster Management Grid • Verified Partner Verification, Task Allocations & Coverage Gap Elimination"
      />

      <main className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Registered Humanitarian Relief Organizations
            </h2>
            <p className="text-xs text-slate-500">
              Coordinated relief network preventing duplicate supplies and filling regional assistance voids.
            </p>
          </div>

          <button
            onClick={() => setShowRegisterModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-sm transition"
          >
            <Plus className="h-4 w-4" />
            <span>Register New NGO</span>
          </button>
        </div>

        {/* NGOs Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ngos.map((ngo) => (
            <div
              key={ngo.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {ngo.name}
                    </h3>
                    <p className="text-[11px] font-mono text-slate-400">
                      Reg: {ngo.registrationNumber}
                    </p>
                  </div>

                  {ngo.verified ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1 shrink-0">
                      <ShieldCheck className="h-3 w-3" />
                      <span>Verified</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 flex items-center gap-1 shrink-0">
                      <Clock className="h-3 w-3" />
                      <span>Pending</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {ngo.description || "Humanitarian relief organization operating in partnership with disaster authorities."}
                </p>

                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Operational Capabilities
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {ngo.capabilities.map((cap, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {ngo.contactPhone && (
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      <Phone className="h-3 w-3 text-emerald-500" />
                      <span>{ngo.contactPhone}</span>
                    </div>
                  )}
                  {ngo.contactEmail && (
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Mail className="h-3 w-3 text-sky-500" />
                      <span>{ngo.contactEmail}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">
                  Active Tasks: <strong>{ngo.activeTasksCount || 0}</strong>
                </span>

                <button
                  onClick={() => handleVerify(ngo.id, !ngo.verified)}
                  className={`px-3 py-1 rounded text-[11px] font-bold transition ${
                    ngo.verified
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                  }`}
                >
                  {ngo.verified ? "Revoke Verification" : "Verify NGO"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* NGO Registration Modal */}
        {showRegisterModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Register Humanitarian NGO
                </h3>
                <button onClick={() => setShowRegisterModal(false)} className="text-xs text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Organization Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Doctors Across Borders Disaster Auxiliary"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Registration # *</label>
                    <input
                      type="text"
                      required
                      placeholder="NGO-DL-2022-XXXX"
                      value={form.registrationNumber}
                      onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Official Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="relief@organization.org"
                      value={form.contactEmail}
                      onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Capabilities (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="WASH, Mobile Clinics, Dry Rations, Blankets, Child Care"
                    value={form.capabilities}
                    onChange={(e) => setForm({ ...form, capabilities: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Brief Description</label>
                  <textarea
                    rows={2}
                    placeholder="Specialization, active warehouse locations, volunteer count..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
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
                    disabled={registering}
                    className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold transition flex items-center gap-1.5"
                  >
                    {registering && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    <span>Submit for Verification</span>
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
