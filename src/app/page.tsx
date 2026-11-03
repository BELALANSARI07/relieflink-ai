import Link from "next/link";
import {
  ShieldAlert,
  Flame,
  LifeBuoy,
  Building2,
  Users2,
  MapPin,
  Bot,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Phone,
  BarChart3,
  Hospital,
  Home,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
      {/* Top Emergency Advisory Bar */}
      <div className="bg-red-600/90 text-white px-4 py-2 text-center text-xs font-bold tracking-wide flex items-center justify-center gap-2">
        <span className="h-2 w-2 rounded-full bg-white animate-ping" />
        <span>NATIONAL DISASTER ALERT: Cyclone Varuna active in Western Estuary. Citizens in low-lying sectors use direct SOS.</span>
      </div>

      {/* Main Navigation */}
      <header className="h-20 border-b border-slate-800/80 px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-wide text-white flex items-center gap-2">
              ReliefLink <span className="text-xs px-2 py-0.5 rounded bg-sky-950 border border-sky-800 text-sky-400 font-bold">AI</span>
            </span>
            <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Unified Disaster Response Ecosystem</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/sos/new"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-lg shadow-red-600/30 transition tracking-wide"
          >
            <LifeBuoy className="h-4 w-4" />
            <span>DIRECT SOS</span>
          </Link>

          <Link
            href="/login"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 text-xs font-semibold transition"
          >
            Command Portal
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <section className="px-6 lg:px-12 py-16 lg:py-24 max-w-6xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/60 border border-sky-800 text-sky-300 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
            <span>Next-Generation Disaster Response & Relief Coordination Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            One Coordinated Network. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400">
              Zero Unassisted Lives.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            ReliefLink AI connects government disaster authorities, rescue teams, NGOs, hospitals, shelter managers, and citizens into a unified intelligent command grid to eliminate delayed rescue responses, duplicate supplies, and coordination failures.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/citizen"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#DB8064] hover:bg-[#c97358] text-white font-extrabold text-sm tracking-wide shadow-xl shadow-[#DB8064]/30 flex items-center justify-center gap-2 transition"
            >
              <LifeBuoy className="h-5 w-5" />
              <span>CITIZEN EMERGENCY PORTAL</span>
            </Link>

            <Link
              href="/authority"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-sm tracking-wide shadow-xl shadow-sky-600/30 flex items-center justify-center gap-2 transition"
            >
              <span>GOVERNMENT AUTHORITY COMMAND</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Four Connected User Portals Showcase */}
          <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto text-left">
            <Link
              href="/citizen"
              className="p-5 rounded-2xl bg-gradient-to-b from-[#FFF7F2] to-[#FFE3D5] text-[#352823] border border-[#F1DED4] hover:scale-102 transition group flex flex-col justify-between shadow-md"
            >
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white text-[#DB8064] border border-[#F2A789]">
                  Civilian Portal
                </span>
                <h3 className="font-black text-base mt-2 text-[#352823] group-hover:text-[#DB8064] transition">
                  Citizens & Families
                </h3>
                <p className="text-xs text-[#79665F] mt-1 line-clamp-3">
                  Warm peach & cream interface. Request food, water, medical aid, track assigned rescuers, and find safe shelters.
                </p>
              </div>
              <div className="pt-3 font-bold text-xs text-[#DB8064] flex items-center gap-1">
                <span>Enter Civilian Portal</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>

            <Link
              href="/ngo"
              className="p-5 rounded-2xl bg-gradient-to-b from-[#FFF7F2] to-[#FFE3D5] text-[#352823] border border-[#F1DED4] hover:scale-102 transition group flex flex-col justify-between shadow-md"
            >
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white text-[#DB8064] border border-[#F2A789]">
                  NGO Portal
                </span>
                <h3 className="font-black text-base mt-2 text-[#352823] group-hover:text-[#DB8064] transition">
                  Humanitarian NGOs
                </h3>
                <p className="text-xs text-[#79665F] mt-1 line-clamp-3">
                  Logistics dashboard, inventory management with expiry dates, 7-stage delivery verification, and surplus sharing.
                </p>
              </div>
              <div className="pt-3 font-bold text-xs text-[#DB8064] flex items-center gap-1">
                <span>Enter NGO Portal</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>

            <Link
              href="/authority"
              className="p-5 rounded-2xl bg-[#111C2E] text-white border border-[#2B3C52] hover:scale-102 transition group flex flex-col justify-between shadow-md"
            >
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#17263B] text-[#56C5E8] border border-[#56C5E8]/40">
                  Command Center
                </span>
                <h3 className="font-black text-base mt-2 text-white group-hover:text-[#56C5E8] transition">
                  Government Authority
                </h3>
                <p className="text-xs text-[#A9B7CA] mt-1 line-clamp-3">
                  Dark operations grid. Population exposure intelligence (Census & WorldPop), relief gap analysis, and incident verification.
                </p>
              </div>
              <div className="pt-3 font-bold text-xs text-[#56C5E8] flex items-center gap-1">
                <span>Enter Command Grid</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>

            <Link
              href="/field"
              className="p-5 rounded-2xl bg-[#111C2E] text-white border border-[#2B3C52] hover:scale-102 transition group flex flex-col justify-between shadow-md"
            >
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#17263B] text-cyan-400 border border-cyan-800">
                  Field Operations
                </span>
                <h3 className="font-black text-base mt-2 text-white group-hover:text-cyan-400 transition">
                  Rescue Squads
                </h3>
                <p className="text-xs text-[#A9B7CA] mt-1 line-clamp-3">
                  Tactical field UI for NDRF/SDRF with large controls, mission priority, GPS directions, and offline-first PWA sync.
                </p>
              </div>
              <div className="pt-3 font-bold text-xs text-cyan-400 flex items-center gap-1">
                <span>Enter Field Portal</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Active Incidents</span>
              <p className="text-2xl font-black text-white mt-1">3 Zones</p>
              <span className="text-[11px] text-orange-400 font-semibold">Live Monitoring</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Rescue Teams</span>
              <p className="text-2xl font-black text-sky-400 mt-1">100% Ready</p>
              <span className="text-[11px] text-slate-400 font-semibold">Amphibious & Trauma</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Shelter Capacity</span>
              <p className="text-2xl font-black text-indigo-400 mt-1">3,800 Beds</p>
              <span className="text-[11px] text-emerald-400 font-semibold">57% Utilized</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">AI Triage Speed</span>
              <p className="text-2xl font-black text-emerald-400 mt-1">&lt; 500 ms</p>
              <span className="text-[11px] text-slate-400 font-semibold">Zero-Wait Dispatch</span>
            </div>
          </div>
        </section>

        {/* Core Pillars */}
        <section className="px-6 lg:px-12 py-16 bg-slate-900/30 border-y border-slate-800/80">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Engineered for High-Stakes Disaster Operations
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
                Purpose-built modules that eliminate operational bottlenecks and enable seamless inter-agency collaboration.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-red-950 border border-red-800 text-red-400 flex items-center justify-center">
                  <LifeBuoy className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-white">1. Direct Citizen SOS & GPS Triage</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  One-tap emergency broadcast with high-precision GPS capture, automatic AI severity classification, and automated duplicate SOS suppression.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-sky-950 border border-sky-800 text-sky-400 flex items-center justify-center">
                  <Building2 className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-white">2. NGO Coordination & Void Analysis</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Register, verify, and coordinate humanitarian NGOs. Our AI engine scans operational polygons to identify and fill uncovered relief sectors.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-purple-950 border border-purple-800 text-purple-400 flex items-center justify-center">
                  <Bot className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-white">3. Explainable AI Decision Support</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Gemini-powered recommendation algorithms forecast resource shortages and suggest tactical NGO assignments with complete reasoning audit trails.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center">
                  <MapPin className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-white">4. Unified Geospatial Map Grid</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Overlay active disaster radii, pending SOS distress markers, deployed rescue teams, and open shelter capacities on one interactive map.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-950 border border-indigo-800 text-indigo-400 flex items-center justify-center">
                  <Home className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-white">5. Live Shelter & Hospital Tracking</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Track real-time bed occupancy, ICU ventilator availability, and water/meal inventory to prevent shelter overflows and trauma center bottlenecks.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-amber-950 border border-amber-800 text-amber-400 flex items-center justify-center">
                  <Users2 className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-white">6. Community Volunteer Network</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Mobilize and verify skilled volunteers with CPR, HAM radio, paramedic, and off-road driving certifications for field missions.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 lg:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>© 2026 ReliefLink AI • National Disaster Management & Civil Protection Ecosystem</p>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="hover:text-slate-300">Command Center</Link>
          <Link href="/map" className="hover:text-slate-300">Live Map</Link>
          <Link href="/sos/new" className="text-red-400 font-bold hover:underline">Emergency SOS</Link>
        </div>
      </footer>
    </div>
  );
}
