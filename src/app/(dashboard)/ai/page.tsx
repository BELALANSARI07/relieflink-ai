"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import {
  Bot,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Cpu,
  RefreshCw,
} from "lucide-react";
import { AiRecommendationItem } from "@/types";

export default function AiDecisionSupportPage() {
  const [recommendations, setRecommendations] = useState<AiRecommendationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecs() {
      try {
        const res = await fetch("/api/analytics/overview");
        const json = await res.json();
        // Use initial data or mock
        setRecommendations([
          {
            id: "rec-001",
            type: "NGO_ASSIGNMENT",
            contextId: "dis-002",
            recommendation: {
              recommendedNgo: "Oxfam Relief Foundation India",
              targetSector: "Danapur Diara Embankment Zone 4",
              supplyNeeded: "5,000L Potable Water + 800 Ration Packs",
            },
            confidence: 0.94,
            explanation:
              "AI detected an unassisted cluster of 45 citizens stranded without potable water for 18h. Oxfam has active inventory of 3,200 meal packets within 4.2 km and 3 available logistics personnel. Deploying Oxfam eliminates duplicate distribution from Red Cross camps.",
            status: "PENDING",
            modelVersion: "gemini-1.5-flash",
            createdAt: "2026-11-01T16:20:00Z",
          },
          {
            id: "rec-002",
            type: "RESOURCE_ALLOCATION",
            contextId: "dis-001",
            recommendation: {
              sourceDepot: "Kurla West SDMA Depot",
              destination: "Dharavi Municipal Sports Shelter",
              quantity: "300 Bottled Water Cartons",
            },
            confidence: 0.89,
            explanation:
              "Shelter occupancy accelerated by 280 evacuees over 4 hours. Current water reserve projected to deplete in 5.5 hours. Early replenishment avoids bottleneck during expected high tide gale window.",
            status: "ACCEPTED",
            modelVersion: "gemini-1.5-flash",
            createdAt: "2026-11-01T15:00:00Z",
          },
          {
            id: "rec-003",
            type: "RESCUE_PRIORITY",
            contextId: "dis-001",
            recommendation: {
              sosId: "sos-101",
              targetSquad: "NDRF Bravo Amphibious Unit",
              action: "Immediate Water Extraction",
            },
            confidence: 0.96,
            explanation:
              "Elderly diabetic citizen and infant trapped with water level at ceiling level. High-risk hypothermia and medical collapse window within 90 minutes.",
            status: "ACCEPTED",
            modelVersion: "gemini-1.5-flash",
            createdAt: "2026-11-01T12:45:00Z",
          },
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadRecs();
  }, []);

  function handleDecision(id: string, action: "ACCEPTED" | "REJECTED") {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: action } : r))
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="AI Intelligence & Operational Decision Support"
        subtitle="Explainable Human-in-the-Loop Emergency Intelligence • Coverage Gap Analysis & Resource Forecasting"
      />

      <main className="p-6 space-y-6">
        {/* Core AI Governance Notice */}
        <div className="p-4 rounded-xl bg-sky-950/30 border border-sky-800/60 flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shrink-0">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-sky-300">
              Human-in-the-Loop Operational Mandate
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              ReliefLink AI provides explainable operational decision-support to incident commanders. In compliance with humanitarian disaster governance standards, <strong>AI recommendations never autonomously execute critical rescue dispatches</strong> without human officer approval.
            </p>
          </div>
        </div>

        {/* Live Recommendations Queue */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-sky-500" />
              <span>Pending Operational Recommendations</span>
            </h2>

            <Link
              href="/ai/assistant"
              className="text-xs font-semibold text-sky-500 hover:underline flex items-center gap-1"
            >
              <span>Open AI Natural Language Assistant</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className={`p-5 rounded-xl bg-white dark:bg-slate-900 border transition shadow-sm space-y-3 ${
                  rec.status === "PENDING"
                    ? "border-sky-500/50"
                    : "border-slate-200 dark:border-slate-800 opacity-90"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                      {rec.type}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Confidence Score: {Math.round(rec.confidence * 100)}%
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      rec.status === "ACCEPTED"
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                        : rec.status === "REJECTED"
                        ? "bg-red-950 text-red-400 border border-red-800"
                        : "bg-amber-950 text-amber-400 border border-amber-800 animate-pulse"
                    }`}
                  >
                    {rec.status}
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    Recommended Action:
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    {JSON.stringify(rec.recommendation, null, 2)}
                  </p>
                </div>

                {/* Explainable Reasoning */}
                <div className="text-xs space-y-1">
                  <p className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Bot className="h-3.5 w-3.5 text-sky-500" />
                    <span>Explainable Reasoning (Why this was recommended):</span>
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed pl-4 border-l-2 border-sky-500/50">
                    {rec.explanation}
                  </p>
                </div>

                {rec.status === "PENDING" && (
                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleDecision(rec.id, "REJECTED")}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <XCircle className="h-3.5 w-3.5 text-red-400" />
                      <span>Reject Recommendation</span>
                    </button>
                    <button
                      onClick={() => handleDecision(rec.id, "ACCEPTED")}
                      className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Approve & Dispatch Order</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
