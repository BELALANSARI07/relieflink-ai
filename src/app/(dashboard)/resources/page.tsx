"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import {
  Boxes,
  Plus,
  Search,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { ResourceItem } from "@/types";
import { getStatusBadgeClass } from "@/lib/utils";

export default function ResourcesPage() {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState("ALL");

  const [form, setForm] = useState({
    name: "",
    categoryName: "Potable Water",
    quantity: 500,
    unit: "cartons",
    address: "",
    ownerName: "State Disaster Authority",
    ownerType: "GOVERNMENT",
  });

  useEffect(() => {
    loadResources();
  }, []);

  async function loadResources() {
    try {
      const res = await fetch("/api/resources");
      const json = await res.json();
      if (json.success) setResources(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddResource(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.success) {
        setResources((prev) => [json.data, ...prev]);
        setShowAddModal(false);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const filtered = resources.filter((r) => {
    if (filterCategory === "ALL") return true;
    return r.categoryName.toLowerCase().includes(filterCategory.toLowerCase());
  });

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Emergency Relief Supplies & Logistics"
        subtitle="National Disaster Management Grid • Multi-Agency Stockpiles, Inventory Distribution & Shortage Alerts"
      />

      <main className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="py-2 px-3 text-xs rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="water">Potable Water</option>
              <option value="med">Medical Kits</option>
              <option value="food">Food & Rations</option>
              <option value="rescue">Rescue Equipment</option>
            </select>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-sm transition"
          >
            <Plus className="h-4 w-4" />
            <span>Add Stockpile Batch</span>
          </button>
        </div>

        {/* Inventory Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {r.categoryName}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${getStatusBadgeClass(r.status)}`}>
                    {r.status}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {r.name}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {r.description || "Emergency relief supplies cataloged in forward logistics center."}
                </p>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Stock Level:</span>
                  <span className="text-base font-black text-slate-900 dark:text-white">
                    {r.quantity.toLocaleString()} <span className="text-xs font-normal text-slate-500">{r.unit}</span>
                  </span>
                </div>

                <div className="text-xs text-slate-400 space-y-1 pt-1">
                  <p className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-sky-500" />
                    <span className="truncate">{r.address}</span>
                  </p>
                  <p className="text-[11px]">Custodian: <strong>{r.ownerName}</strong> ({r.ownerType})</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Add Stockpile Batch
                </h3>
                <button onClick={() => setShowAddModal(false)} className="text-xs text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddResource} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Item / Batch Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 500W Mobile LED Lighting Tower"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Category *</label>
                    <select
                      value={form.categoryName}
                      onChange={(e) => setForm({ ...form, categoryName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                    >
                      <option value="Potable Water">Potable Water</option>
                      <option value="Medical Kits">Medical Kits</option>
                      <option value="Food & Rations">Food & Rations</option>
                      <option value="Rescue Equipment">Rescue Equipment</option>
                      <option value="Clothing & Blankets">Clothing & Blankets</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Quantity *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value, 10) || 1 })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Unit of Measure</label>
                    <input
                      type="text"
                      placeholder="cartons, units, kits, kg"
                      value={form.unit}
                      onChange={(e) => setForm({ ...form, unit: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Custodian Agency</label>
                    <input
                      type="text"
                      value={form.ownerName}
                      onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Depot / Warehouse Address</label>
                  <input
                    type="text"
                    placeholder="Forward Relief Depot, Sector 3"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
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
                    Save Stock
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
