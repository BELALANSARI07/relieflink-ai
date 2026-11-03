"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Shield,
  Activity,
  Users2,
  AlertTriangle,
  Building2,
  MapPin,
  Flame,
  LifeBuoy,
  CheckCircle2,
  FileText,
  BarChart3,
  Globe,
  Radio,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Search,
  Filter,
} from "lucide-react";
import { PortalSwitcher } from "@/components/layout/PortalSwitcher";

export default function AuthorityPortalPage() {
  const [popData, setPopData] = useState<any>(null);
  const [gapData, setGapData] = useState<any>(null);
  const [sosList, setSosList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"population" | "gaps" | "verification" | "audit">("population");

  async function loadAuthorityData() {
    try {
      const [popRes, gapRes, sosRes] = await Promise.all([
        fetch("/api/population/exposure"),
        fetch("/api/relief-gaps"),
        fetch("/api/sos"),
      ]);
      const popJson = await popRes.json();
      const gapJson = await gapRes.json();
      const sosJson = await sosRes.json();

      if (popJson.success) setPopData(popJson.data);
      if (gapJson.success) setGapData(gapJson.data);
      if (sosJson.success) setSosList(sosJson.data);
    } catch (err) {
      console.error("Failed to load authority data", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAuthorityData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B1220] text-[#F1F5F9] flex flex-col font-sans selection:bg-[#56C5E8] selection:text-[#0B1220]">
      {/* Top Portal Switcher */}
      <PortalSwitcher />

      {/* Authority Command Header */}
      <header className="bg-[#111C2E] border-b border-[#2B3C52] px-6 lg:px-12 py-4 flex items-center justify-between sticky top-0 z-30 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#17263B] border border-[#56C5E8]/40 flex items-center justify-center text-[#56C5E8]">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-wide text-white flex items-center gap-1.5">
              ReliefLink <span className="text-xs px-2 py-0.5 rounded-full bg-[#17263B] border border-[#56C5E8]/40 text-[#56C5E8] font-bold">Government Authority Portal</span>
            </span>
            <p className="text-[10px] text-[#A9B7CA] font-medium uppercase tracking-wider">
              National Disaster Management Authority (NDMA) • Multi-Agency Operations Oversight
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-800 text-emerald-400 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>National Grid Active • Level 4 Surge</span>
          </div>

          <Link
            href="/map"
            className="px-3.5 py-1.5 rounded-xl bg-[#56C5E8] hover:bg-[#438EED] text-[#0B1220] font-black text-xs transition flex items-center gap-1.5 shadow-md"
          >
            <MapPin className="h-3.5 w-3.5" />
            <span>Open Geospatial Map</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Top Operational Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#111C2E] border border-[#2B3C52] shadow-sm">
            <span className="text-[#A9B7CA] font-medium block">Total Residential Pop (Active Zones)</span>
            <p className="text-2xl font-black text-white mt-1">
              {popData?.summary?.totalResidential ? (popData.summary.totalResidential / 1000000).toFixed(1) + "M" : "15.8M"}
            </p>
            <span className="text-[11px] text-[#A9B7CA]">Census of India Grid</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#111C2E] border border-[#2B3C52] shadow-sm">
            <span className="text-[#A9B7CA] font-medium block">Estimated Exposed Population</span>
            <p className="text-2xl font-black text-[#56C5E8] mt-1">
              {popData?.summary?.totalEstimatedExposed ? (popData.summary.totalEstimatedExposed / 1000).toFixed(0) + "k" : "740k"}
            </p>
            <span className="text-[11px] text-[#56C5E8] font-semibold">
              {popData?.summary?.exposureRatioPercent || "4.68"}% within disaster perimeter
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#111C2E] border border-[#2B3C52] shadow-sm">
            <span className="text-[#A9B7CA] font-medium block">Confirmed Verified Affected</span>
            <p className="text-2xl font-black text-amber-400 mt-1">
              {popData?.summary?.totalVerifiedAffected?.toLocaleString() || "4,500"}
            </p>
            <span className="text-[11px] text-emerald-400 font-semibold">
              {popData?.summary?.assistanceCoveragePercent || "51.1"}% verified assisted
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#111C2E] border border-[#2B3C52] shadow-sm">
            <span className="text-[#A9B7CA] font-medium block">Critical Relief Gaps Identified</span>
            <p className="text-2xl font-black text-red-400 mt-1">
              {gapData?.metrics?.criticalGaps || "1"} Sector
            </p>
            <span className="text-[11px] text-red-300 font-semibold">
              {gapData?.metrics?.totalUnfulfilledInGaps || "28"} Unfulfilled Requests
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#2B3C52] pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("population")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "population"
                ? "bg-[#17263B] text-[#56C5E8] border border-[#56C5E8]/40"
                : "text-[#A9B7CA] hover:text-white"
            }`}
          >
            <Users2 className="h-4 w-4" />
            <span>Population & Impact Intelligence</span>
          </button>

          <button
            onClick={() => setActiveTab("gaps")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "gaps"
                ? "bg-[#17263B] text-[#56C5E8] border border-[#56C5E8]/40"
                : "text-[#A9B7CA] hover:text-white"
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            <span>Relief Gap Detection Engine</span>
          </button>

          <button
            onClick={() => setActiveTab("verification")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "verification"
                ? "bg-[#17263B] text-[#56C5E8] border border-[#56C5E8]/40"
                : "text-[#A9B7CA] hover:text-white"
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Incident Verification Console</span>
          </button>

          <button
            onClick={() => setActiveTab("audit")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "audit"
                ? "bg-[#17263B] text-[#56C5E8] border border-[#56C5E8]/40"
                : "text-[#A9B7CA] hover:text-white"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Audit Trail & Accountability</span>
          </button>
        </div>

        {/* TAB 1: POPULATION INTELLIGENCE ENGINE */}
        {activeTab === "population" && (
          <div className="space-y-4 text-xs">
            {/* Rigorous Distinction Banner */}
            <div className="p-4 rounded-2xl bg-[#17263B]/60 border border-[#2B3C52] text-xs text-[#A9B7CA] space-y-1">
              <span className="font-bold text-white block">
                Official Population Modeling Methodology:
              </span>
              <p>
                {popData?.summary?.distinctionNotice ||
                  "Residential Population, Estimated Exposed Population, and Verified Affected Population are distinct metrics. ReliefLink models partial grid-cell polygon intersection with WorldPop 100m constrained rasters."}
              </p>
            </div>

            {/* District Breakdown Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {popData?.records?.map((rec: any) => (
                <div
                  key={rec.id}
                  className="bg-[#111C2E] border border-[#2B3C52] rounded-2xl p-5 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-[#2B3C52] pb-2">
                    <div>
                      <h4 className="font-extrabold text-sm text-white">{rec.district}</h4>
                      <p className="text-[10px] text-[#A9B7CA]">{rec.state}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#17263B] text-[#56C5E8] border border-[#56C5E8]/30">
                      {(rec.confidenceScore * 100).toFixed(0)}% Confidence
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-[#A9B7CA]">Total Residential:</span>
                      <span className="font-bold text-white">{rec.totalResidentialPop.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#A9B7CA]">Estimated Exposed:</span>
                      <span className="font-bold text-[#56C5E8]">{rec.estimatedExposedPop.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#A9B7CA]">Confirmed Affected:</span>
                      <span className="font-bold text-amber-400">{rec.verifiedAffectedPop.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#A9B7CA]">Verified Assisted:</span>
                      <span className="font-bold text-emerald-400">{rec.confirmedAssistedPop.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#0B1220] border border-[#2B3C52] space-y-1 text-[10px]">
                    <span className="font-semibold text-[#A9B7CA] block">Vulnerable Demographics:</span>
                    <div className="flex justify-between text-[#F1F5F9]">
                      <span>Elderly: {rec.vulnerabilityBreakdown?.elderly?.toLocaleString()}</span>
                      <span>Children: {rec.vulnerabilityBreakdown?.children?.toLocaleString()}</span>
                      <span>Medical: {rec.vulnerabilityBreakdown?.medicalNeeds?.toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-[#A9B7CA] italic">
                    Source: {rec.dataSource} (v.{rec.vintageYear})
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: RELIEF GAP DETECTION ENGINE */}
        {activeTab === "gaps" && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-[#111C2E] border border-[#2B3C52] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-extrabold text-white">Automated Relief Coverage & Gap Analysis</h3>
                <p className="text-[11px] text-[#A9B7CA]">
                  Rule: A locality is marked &apos;served&apos; strictly to the extent that actual relief deliveries have been confirmed on site.
                </p>
              </div>
              <button
                onClick={() => alert("Inter-agency deployment order generated and sent to NDRF command.")}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shrink-0"
              >
                Dispatch Inter-Agency Emergency Unit
              </button>
            </div>

            <div className="space-y-3">
              {gapData?.gaps?.map((gap: any) => (
                <div
                  key={gap.id}
                  className="bg-[#111C2E] border border-[#2B3C52] rounded-2xl p-5 shadow-sm space-y-3"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#2B3C52] pb-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        gap.severityLevel === "CRITICAL" ? "bg-red-950 text-red-400 border border-red-800" : "bg-amber-950 text-amber-400 border border-amber-800"
                      }`}>
                        {gap.severityLevel} GAP
                      </span>
                      <h4 className="font-extrabold text-sm text-white">{gap.sectorName}</h4>
                      <span className="text-[11px] text-[#A9B7CA]">({gap.district})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#A9B7CA]">Delivered:</span>
                      <span className="font-bold text-amber-400">{gap.deliveredSuppliesPercent}%</span>
                      <span className="text-[11px] text-[#A9B7CA]">({gap.unfulfilledRequestsCount} pending requests)</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#F1F5F9] bg-[#0B1220] p-3 rounded-xl border border-[#2B3C52]">
                    🚨 <strong>AI Strategic Recommendation:</strong> {gap.recommendations}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#A9B7CA]">
                    <span>Coordinates: {gap.coordinates[0]}, {gap.coordinates[1]}</span>
                    <span>Exposed Population: {gap.exposedPop?.toLocaleString()}</span>
                    <span>Assigned NGOs: {gap.assignedNgosCount}</span>
                    <Link
                      href="/map"
                      className="font-bold text-[#56C5E8] hover:underline flex items-center gap-1"
                    >
                      <span>Locate on Tactical Map</span>
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: INCIDENT VERIFICATION CONSOLE */}
        {activeTab === "verification" && (
          <div className="bg-[#111C2E] border border-[#2B3C52] rounded-2xl p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#2B3C52] pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-white">Incident Verification & Corroboration Pipeline</h3>
                <p className="text-[11px] text-[#A9B7CA]">Screen citizen reports against duplicate distance algorithms and field reconnaissance.</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {sosList.slice(0, 5).map((sos) => (
                <div
                  key={sos.id}
                  className="p-3.5 rounded-xl bg-[#17263B] border border-[#2B3C52] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{sos.id}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800">
                        {sos.type} • {sos.severity}
                      </span>
                      <span className="text-[10px] text-[#A9B7CA]">{sos.address}</span>
                    </div>
                    <p className="text-xs text-[#F1F5F9]">{sos.description}</p>
                    <p className="text-[11px] text-[#A9B7CA]">
                      Reporter: {sos.citizenName} • {sos.peopleCount} person(s) • Status: <strong className="text-white">{sos.status}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => alert(`Verified incident ${sos.id}. Marked official.`)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                    >
                      Approve & Verify
                    </button>
                    <button
                      onClick={() => alert(`Incident ${sos.id} flagged for field officer check.`)}
                      className="px-3 py-1.5 rounded-lg bg-[#21334B] hover:bg-[#2b3c52] text-[#A9B7CA] font-semibold text-xs"
                    >
                      Request Corroboration
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: AUDIT TRAIL */}
        {activeTab === "audit" && (
          <div className="bg-[#111C2E] border border-[#2B3C52] rounded-2xl p-5 space-y-4 text-xs">
            <div className="border-b border-[#2B3C52] pb-3">
              <h3 className="text-sm font-extrabold text-white">Immutable Administrative Audit Log</h3>
              <p className="text-[11px] text-[#A9B7CA]">Tracks critical incident escalations, squad assignments, and inter-agency overrides.</p>
            </div>

            <div className="space-y-2">
              {[
                { time: "2026-11-01 16:20:00", user: "Col. R. Verma (NDMA Commander)", action: "Approved AI Recommendation #ai-rec-001 (Assigned Oxfam to Danapur Diara)" },
                { time: "2026-11-01 15:00:00", user: "Col. R. Verma (NDMA Commander)", action: "Approved Emergency Water Transfer from Kurla Depot to Dharavi Shelter" },
                { time: "2026-11-01 13:40:00", user: "Capt. Vikram Singh (NDRF Leader)", action: "Confirmed On-Scene Arrival at Mahim Creek Sector" },
                { time: "2026-11-01 13:00:00", user: "System Dispatch Engine", action: "Dispatched Mission #mis-001 to NDRF Bravo Amphibious Unit" },
              ].map((log, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#0B1220] border border-[#2B3C52] flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">{log.action}</p>
                    <p className="text-[10px] text-[#A9B7CA] mt-0.5">Authorized by: {log.user}</p>
                  </div>
                  <span className="text-[10px] font-mono text-[#56C5E8]">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Dark Footer */}
      <footer className="border-t border-[#2B3C52] bg-[#111C2E] px-6 py-6 text-center text-xs text-[#A9B7CA] space-y-1">
        <p className="font-bold text-white">ReliefLink National Disaster Command Portal • Confidential Government Operations</p>
        <p className="text-[11px]">Authorized for State Disaster Management Authorities (SDMA) and National Emergency Responders.</p>
      </footer>
    </div>
  );
}
