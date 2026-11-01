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
              href="/sos/new"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm tracking-wide shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 transition"
            >
              <LifeBuoy className="h-5 w-5" />
              <span>CITIZEN EMERGENCY SOS</span>
            </Link>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-sm tracking-wide shadow-xl shadow-sky-600/30 flex items-center justify-center gap-2 transition"
            >
              <span>ACCESS COMMAND CENTER</span>
              <ArrowRight className="h-4 w-4" />
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
