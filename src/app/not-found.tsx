"use client";

import Link from "next/link";
import {
  ShieldAlert,
  Radio,
  MapPin,
  LifeBuoy,
  Flame,
  Home,
  Hospital,
  Building2,
  Users2,
  Boxes,
  HandHeart,
  Bot,
  ArrowLeft,
  Search,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const modules = [
    { title: "Command Center Dashboard", href: "/dashboard", desc: "Main operations overview & real-time metrics", icon: Radio },
    { title: "Interactive Geospatial Map", href: "/map", desc: "Multi-layer live incident map", icon: MapPin },
    { title: "Citizen Emergency SOS", href: "/sos/new", desc: "Direct citizen emergency distress broadcast", icon: LifeBuoy, urgent: true },
    { title: "SOS Triage Console", href: "/sos", desc: "Live distress triage & squad dispatch", icon: LifeBuoy },
    { title: "Active Disaster Registry", href: "/disasters", desc: "Ongoing incidents & radius tracking", icon: Flame },
    { title: "Evacuation Shelters", href: "/shelters", desc: "Shelter bed availability & intake", icon: Home },
    { title: "Trauma Hospitals", href: "/hospitals", desc: "ICU beds & emergency medical capacity", icon: Hospital },
    { title: "NGO Coordination", href: "/ngos", desc: "Registered humanitarian organizations", icon: Building2 },
    { title: "Tactical Rescue Squads", href: "/rescue-teams", desc: "Deployed units & team readiness", icon: Users2 },
    { title: "Relief Inventory", href: "/resources", desc: "Food, water, medicine & equipment stock", icon: Boxes },
    { title: "Volunteers Network", href: "/volunteers", desc: "Certified emergency responders", icon: HandHeart },
    { title: "AI Decision Support", href: "/ai", desc: "Shortage predictions & void analysis", icon: Bot },
  ];

  const filtered = search
    ? modules.filter(
        (m) =>
          m.title.toLowerCase().includes(search.toLowerCase()) ||
          m.desc.toLowerCase().includes(search.toLowerCase())
      )
    : modules;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-8 my-12">
        {/* Header Banner */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800 text-amber-400 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span>404 — Route Not Located in Grid</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Select a Destination Module
          </h1>

          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            The path you entered does not match an active coordinate. Choose any operational system below or search to jump directly:
          </p>

          {/* Quick Search */}
          <div className="max-w-md mx-auto relative pt-2">
            <Search className="absolute left-3.5 top-5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter modules (e.g. map, shelter, hospital, sos)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Module Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filtered.map((m) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.href}
                href={m.href}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-850 transition group flex items-start gap-3.5"
              >
                <div
                  className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                    m.urgent
                      ? "bg-red-950 border border-red-800 text-red-400"
                      : "bg-slate-800 border border-slate-700 text-sky-400 group-hover:scale-105 transition-transform"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-slate-200 group-hover:text-sky-400 transition truncate">
                    {m.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{m.desc}</p>
                  <code className="text-[10px] text-sky-500/70 font-mono mt-1 inline-block">
                    {m.href}
                  </code>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-slate-900 text-xs">
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold transition flex items-center gap-2"
          >
            <Radio className="h-4 w-4" />
            <span>Go to Command Center</span>
          </Link>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-semibold transition flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go to Public Portal Landing</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
