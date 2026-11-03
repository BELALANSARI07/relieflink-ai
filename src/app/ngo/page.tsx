"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Boxes,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Share2,
  Plus,
  ShieldCheck,
  MapPin,
  Calendar,
  ExternalLink,
  ChevronRight,
  Loader2,
  ArrowRight,
  HandHeart,
} from "lucide-react";
import { PortalSwitcher } from "@/components/layout/PortalSwitcher";

export default function NgoPortalPage() {
  const [activeTab, setActiveTab] = useState<"deliveries" | "inventory" | "surplus">("deliveries");
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [surplusItems, setSurplusItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // New Surplus Form
  const [showSurplusModal, setShowSurplusModal] = useState(false);
  const [surplusItem, setSurplusItem] = useState("");
  const [surplusQty, setSurplusQty] = useState(500);
  const [surplusUnit, setSurplusUnit] = useState("cartons");
  const [surplusWarehouse, setSurplusWarehouse] = useState("Kurla SDMA Central Logistics Hub");

  async function loadNgoData() {
    try {
      const [delRes, surRes] = await Promise.all([
        fetch("/api/deliveries"),
        fetch("/api/ngo/surplus"),
      ]);
      const delJson = await delRes.json();
      const surJson = await surRes.json();
      if (delJson.success) setDeliveries(delJson.data);
      if (surJson.success) setSurplusItems(surJson.data);
    } catch (err) {
      console.error("Failed to load NGO data", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNgoData();
  }, []);

  async function handleUpdateDeliveryStatus(id: string, newStatus: string) {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/deliveries/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setDeliveries((prev) =>
          prev.map((d) => (d.id === id ? json.data : d))
        );
      }
    } catch (err) {
      alert("Status update failed");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleClaimSurplus(surplusId: string) {
    try {
      const res = await fetch("/api/ngo/surplus", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ surplusId, claimingNgoName: "Oxfam Relief Foundation India" }),
      });
      const json = await res.json();
      if (json.success) {
        setSurplusItems((prev) =>
          prev.map((s) => (s.id === surplusId ? json.data : s))
        );
      }
    } catch (err) {
      alert("Failed to claim surplus");
    }
  }

  async function handlePostSurplus(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/ngo/surplus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ngoId: "ngo-001",
          ngoName: "Oxfam Relief Foundation India",
          item: surplusItem,
          quantity: surplusQty,
          unit: surplusUnit,
          storageWarehouse: surplusWarehouse,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSurplusItems((prev) => [json.data, ...prev]);
        setShowSurplusModal(false);
        setSurplusItem("");
      }
    } catch (err) {
      alert("Failed to post surplus");
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF7F2] text-[#352823] flex flex-col font-sans selection:bg-[#F2A789]">
      {/* Top Portal Switcher */}
      <PortalSwitcher />

      {/* Header */}
      <header className="bg-white border-b border-[#F1DED4] px-6 lg:px-12 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#FFE3D5] border border-[#F2A789] flex items-center justify-center text-[#DB8064]">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-wide text-[#352823] flex items-center gap-1.5">
              ReliefLink <span className="text-xs px-2 py-0.5 rounded-full bg-[#FFE3D5] text-[#DB8064] font-bold">NGO Operations Portal</span>
            </span>
            <p className="text-[10px] text-[#79665F] font-medium uppercase tracking-wider">
              Oxfam Relief Foundation India (Verified Humanitarian Partner #MH-8821)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Govt Verified • Active Status</span>
          </span>
          <button
            onClick={() => setShowSurplusModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[#DB8064] hover:bg-[#c97358] text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Share Surplus Aid</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* NGO Operations KPI Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white border border-[#F1DED4] shadow-xs">
            <span className="text-[#79665F] font-medium block">Active Missions</span>
            <p className="text-2xl font-black text-[#352823] mt-1">{deliveries.length}</p>
            <span className="text-[11px] text-[#DB8064] font-semibold">2 En Route</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#F1DED4] shadow-xs">
            <span className="text-[#79665F] font-medium block">Confirmed Deliveries</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              {deliveries.filter((d) => d.status === "CONFIRMED").length}
            </p>
            <span className="text-[11px] text-emerald-700 font-semibold">100% Handover Audited</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#F1DED4] shadow-xs">
            <span className="text-[#79665F] font-medium block">Warehouse Stock (MREs)</span>
            <p className="text-2xl font-black text-[#DB8064] mt-1">3,200</p>
            <span className="text-[11px] text-[#79665F]">Kurla Depot • 480 Reserved</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#F1DED4] shadow-xs">
            <span className="text-[#79665F] font-medium block">Logistics Vehicles</span>
            <p className="text-2xl font-black text-[#352823] mt-1">4 Active</p>
            <span className="text-[11px] text-[#79665F]">2 Amphibious • 2 Trucks</span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 border-b border-[#F1DED4] pb-2">
          <button
            onClick={() => setActiveTab("deliveries")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "deliveries"
                ? "bg-[#FFE3D5] text-[#DB8064] border border-[#F2A789]"
                : "text-[#79665F] hover:bg-white"
            }`}
          >
            <Truck className="h-4 w-4" />
            <span>Relief Delivery Workflow ({deliveries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "inventory"
                ? "bg-[#FFE3D5] text-[#DB8064] border border-[#F2A789]"
                : "text-[#79665F] hover:bg-white"
            }`}
          >
            <Boxes className="h-4 w-4" />
            <span>Warehouse Inventory & Reserves</span>
          </button>

          <button
            onClick={() => setActiveTab("surplus")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "surplus"
                ? "bg-[#FFE3D5] text-[#DB8064] border border-[#F2A789]"
                : "text-[#79665F] hover:bg-white"
            }`}
          >
            <Share2 className="h-4 w-4" />
            <span>NGO-to-NGO Surplus Pool ({surplusItems.length})</span>
          </button>
        </div>

        {/* TAB 1: DELIVERY WORKFLOW STATE MACHINE */}
        {activeTab === "deliveries" && (
          <div className="space-y-4">
            <div className="p-3 bg-[#FFF0E8] border border-[#F1DED4] rounded-2xl flex items-center justify-between text-xs text-[#79665F]">
              <span className="font-semibold">
                Traceable 7-Stage Delivery State Machine:
                <strong className="text-[#352823]"> REQUESTED → VERIFIED → ASSIGNED → ACCEPTED → DISPATCHED → DELIVERED → CONFIRMED</strong>
              </span>
              <span className="text-[11px] text-[#DB8064]">Idempotent Transaction Enforced</span>
            </div>

            <div className="space-y-3">
              {deliveries.map((del) => (
                <div
                  key={del.id}
                  className="bg-white border border-[#F1DED4] rounded-2xl p-5 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#F1DED4] pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-[#352823]">{del.id}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFE3D5] text-[#DB8064] border border-[#F2A789]">
                          {del.status}
                        </span>
                        <span className="text-[10px] text-[#79665F]">Linked to {del.sosId}</span>
                      </div>
                      <p className="text-xs text-[#79665F] mt-1 flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-[#DB8064]" />
                        <span>{del.recipientAddress}</span>
                      </p>
                    </div>

                    {/* Action Controls for Workflow Step */}
                    <div className="flex items-center gap-2">
                      {del.status === "REQUESTED" && (
                        <button
                          onClick={() => handleUpdateDeliveryStatus(del.id, "ACCEPTED")}
                          disabled={updatingId === del.id}
                          className="px-3.5 py-1.5 rounded-xl bg-[#DB8064] hover:bg-[#c97358] text-white font-bold text-xs"
                        >
                          Accept Assignment
                        </button>
                      )}

                      {del.status === "ACCEPTED" && (
                        <button
                          onClick={() => handleUpdateDeliveryStatus(del.id, "DISPATCHED")}
                          disabled={updatingId === del.id}
                          className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs"
                        >
                          Dispatch Vehicle
                        </button>
                      )}

                      {del.status === "DISPATCHED" && (
                        <button
                          onClick={() => handleUpdateDeliveryStatus(del.id, "DELIVERED")}
                          disabled={updatingId === del.id}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
                        >
                          Confirm Handover on Scene
                        </button>
                      )}

                      {del.status === "DELIVERED" && (
                        <button
                          onClick={() => handleUpdateDeliveryStatus(del.id, "CONFIRMED")}
                          disabled={updatingId === del.id}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                        >
                          Finalize Verification
                        </button>
                      )}

                      {del.status === "CONFIRMED" && (
                        <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Delivery Verified</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Supply Item List */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#FFF7F2] border border-[#F1DED4]">
                      <span className="text-[10px] text-[#79665F] uppercase font-bold block mb-1">
                        Dispatched Supplies:
                      </span>
                      <ul className="space-y-1">
                        {del.supplies?.map((s: any, idx: number) => (
                          <li key={idx} className="font-semibold text-[#352823]">
                            • {s.quantity} {s.unit} {s.item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-xl bg-[#FFF7F2] border border-[#F1DED4]">
                      <span className="text-[10px] text-[#79665F] uppercase font-bold block mb-1">
                        Logistics Officer:
                      </span>
                      <p className="font-semibold text-[#352823]">{del.responsiblePersonnel}</p>
                      <p className="text-[11px] text-[#79665F] mt-0.5">Vehicle: {del.vehicleRegistration || "Amphibious Craft"}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#FFF7F2] border border-[#F1DED4]">
                      <span className="text-[10px] text-[#79665F] uppercase font-bold block mb-1">
                        Timeline Timestamps:
                      </span>
                      <p className="text-[11px] text-[#79665F]">
                        Created: {new Date(del.createdAt).toLocaleTimeString()}
                      </p>
                      {del.confirmedAt && (
                        <p className="text-[11px] text-emerald-700 font-bold mt-0.5">
                          Confirmed: {new Date(del.confirmedAt).toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: INVENTORY & STOCK */}
        {activeTab === "inventory" && (
          <div className="bg-white border border-[#F1DED4] rounded-3xl p-6 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#F1DED4] pb-3">
              <div>
                <h3 className="text-base font-extrabold text-[#352823]">Warehouse Emergency Stock</h3>
                <p className="text-xs text-[#79665F]">Real-time tracking of relief rations, water packs, medical gear, and temporary shelter kits.</p>
              </div>
              <button
                onClick={() => alert("Warehouse replenishment scan active.")}
                className="px-3 py-1.5 rounded-xl bg-[#FFE3D5] text-[#DB8064] font-bold border border-[#F2A789]"
              >
                + Inward Batch
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#F1DED4] text-[#79665F] text-[11px] uppercase">
                    <th className="py-2.5">Item Name</th>
                    <th>Category</th>
                    <th>Available Quantity</th>
                    <th>Reserved Stock</th>
                    <th>Warehouse Location</th>
                    <th>Expiry Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1DED4]">
                  <tr>
                    <td className="py-3 font-bold text-[#352823]">Ready-to-Eat Emergency Meal Pouches (MREs)</td>
                    <td><span className="px-2 py-0.5 rounded bg-[#FFE3D5] text-[#DB8064] font-semibold text-[10px]">Food</span></td>
                    <td className="font-bold text-emerald-700">2,720 pkts</td>
                    <td className="text-amber-700 font-medium">480 pkts</td>
                    <td className="text-[#79665F]">Kurla SDMA Hub</td>
                    <td className="text-[#79665F]">2027-08-31</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-[#352823]">Potable Drinking Water Cartons (20L)</td>
                    <td><span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold text-[10px]">Water</span></td>
                    <td className="font-bold text-emerald-700">1,450 cartons</td>
                    <td className="text-amber-700 font-medium">300 cartons</td>
                    <td className="text-[#79665F]">Kurla SDMA Hub</td>
                    <td className="text-[#79665F]">2026-12-15</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-[#352823]">Emergency Trauma Dressing & Burn Kits</td>
                    <td><span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-semibold text-[10px]">Medical</span></td>
                    <td className="font-bold text-emerald-700">380 kits</td>
                    <td className="text-amber-700 font-medium">50 kits</td>
                    <td className="text-[#79665F]">Bandra Field Depot</td>
                    <td className="text-[#79665F]">2028-02-28</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-[#352823]">Heavy Duty Weatherproof Tarpaulins (24x18ft)</td>
                    <td><span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-semibold text-[10px]">Shelter</span></td>
                    <td className="font-bold text-emerald-700">620 sheets</td>
                    <td className="text-amber-700 font-medium">100 sheets</td>
                    <td className="text-[#79665F]">Dharavi Storage Depo</td>
                    <td className="text-[#79665F]">N/A</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: NGO-TO-NGO SURPLUS SHARING */}
        {activeTab === "surplus" && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-white border border-[#F1DED4] rounded-2xl flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-[#352823]">Inter-Agency Mutual Aid Surplus Board</h3>
                <p className="text-[11px] text-[#79665F]">Share excess inventory with peer humanitarian organizations to prevent expiration and close relief voids.</p>
              </div>
              <button
                onClick={() => setShowSurplusModal(true)}
                className="px-4 py-2 rounded-xl bg-[#DB8064] text-white font-bold"
              >
                + Offer Surplus
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {surplusItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-[#F1DED4] rounded-2xl p-4 shadow-xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FFE3D5] text-[#DB8064]">
                        {item.category}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        item.status === "CLAIMED" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm text-[#352823]">{item.item}</h4>
                    <p className="text-base font-black text-[#DB8064]">
                      {item.quantity} <span className="text-xs font-normal text-[#79665F]">{item.unit}</span>
                    </p>

                    <div className="text-[11px] text-[#79665F] space-y-0.5 pt-2 border-t border-[#F1DED4]">
                      <p>Donor: <strong className="text-[#352823]">{item.ngoName}</strong></p>
                      <p>Location: {item.storageWarehouse}</p>
                      <p>Contact: {item.contactPerson} ({item.contactPhone})</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    {item.status === "OFFERED" ? (
                      <button
                        onClick={() => handleClaimSurplus(item.id)}
                        className="w-full py-2 rounded-xl bg-[#FFE3D5] hover:bg-[#F2A789] text-[#DB8064] hover:text-white font-bold text-xs transition"
                      >
                        Claim for Sector Mission →
                      </button>
                    ) : (
                      <span className="block text-center py-1.5 text-[11px] font-semibold text-amber-800 bg-amber-50 rounded-lg">
                        Claimed by Relief Sector Squad
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Post Surplus Modal */}
      {showSurplusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white border border-[#F1DED4] rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-extrabold text-[#352823]">Offer Surplus Humanitarian Inventory</h3>
            <p className="text-xs text-[#79665F]">Share available extra supplies with other registered disaster NGOs.</p>

            <form onSubmit={handlePostSurplus} className="space-y-3">
              <div>
                <label className="font-bold text-[#352823] block mb-1">Item Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5,000 ORS Rehydration Sachets"
                  value={surplusItem}
                  onChange={(e) => setSurplusItem(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF7F2] border border-[#F1DED4] text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#352823] block mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={surplusQty}
                    onChange={(e) => setSurplusQty(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF7F2] border border-[#F1DED4] text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#352823] block mb-1">Unit</label>
                  <input
                    type="text"
                    value={surplusUnit}
                    onChange={(e) => setSurplusUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF7F2] border border-[#F1DED4] text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#352823] block mb-1">Warehouse Storage Location</label>
                <input
                  type="text"
                  value={surplusWarehouse}
                  onChange={(e) => setSurplusWarehouse(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF7F2] border border-[#F1DED4] text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSurplusModal(false)}
                  className="px-4 py-2 rounded-xl text-[#79665F] hover:bg-[#FFF0E8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#DB8064] text-white font-bold"
                >
                  Post to Mutual Aid Pool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
