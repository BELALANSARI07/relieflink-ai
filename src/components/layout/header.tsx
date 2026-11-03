"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Search,
  AlertTriangle,
  ShieldCheck,
  LifeBuoy,
  MapPin,
  Flame,
  Building2,
  Users2,
  Home,
  Hospital,
  Boxes,
  HandHeart,
  Bot,
  BarChart3,
  Globe,
  Radio,
  ArrowRight,
  X,
} from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

interface SearchItem {
  title: string;
  category: "Module" | "Action" | "Incident" | "Facility";
  url: string;
  keywords: string;
  icon: any;
  badge?: string;
}

const SEARCH_ITEMS: SearchItem[] = [
  {
    title: "Civilian / Citizen Portal (Warm Peach)",
    category: "Module",
    url: "/citizen",
    keywords: "civilian citizen portal peach family request help track assistance shelter",
    icon: LifeBuoy,
    badge: "Civilian Light",
  },
  {
    title: "NGO & Humanitarian Organization Portal",
    category: "Module",
    url: "/ngo",
    keywords: "ngo humanitarian organization inventory delivery tracking surplus supplies oxfam",
    icon: Building2,
    badge: "Logistics",
  },
  {
    title: "Government Authority Command Portal",
    category: "Module",
    url: "/authority",
    keywords: "government authority portal command ndma population exposure relief gaps audit",
    icon: ShieldCheck,
    badge: "Authority",
  },
  {
    title: "Rescue Team & Field Operations Portal",
    category: "Module",
    url: "/field",
    keywords: "rescue team field operations tactical missions offline pwa ndrf sdrf squad",
    icon: Radio,
    badge: "Field Ops",
  },
  {
    title: "Command Center Dashboard",
    category: "Module",
    url: "/dashboard",
    keywords: "command center dashboard home overview metrics operations grid",
    icon: Radio,
  },
  {
    title: "Interactive Geospatial Map",
    category: "Module",
    url: "/map",
    keywords: "interactive map geospatial gis coordinates layers disasters pins live",
    icon: MapPin,
    badge: "Live Grid",
  },
  {
    title: "Direct Citizen Emergency SOS Form",
    category: "Action",
    url: "/sos/new",
    keywords: "direct citizen emergency sos form submit broadcast help distress gps",
    icon: LifeBuoy,
    badge: "Urgent",
  },
  {
    title: "SOS Triage Console & Live Feed",
    category: "Module",
    url: "/sos",
    keywords: "sos triage queue console distress calls pending requests priority",
    icon: LifeBuoy,
  },
  {
    title: "Active Disaster Registry",
    category: "Module",
    url: "/disasters",
    keywords: "active disasters registry cyclone flood hurricane earthquake incident alerts",
    icon: Flame,
  },
  {
    title: "Declare New Disaster Incident",
    category: "Action",
    url: "/disasters/new",
    keywords: "declare disaster new incident create emergency classification",
    icon: AlertTriangle,
  },
  {
    title: "Evacuation Shelters & Relief Camps",
    category: "Module",
    url: "/shelters",
    keywords: "shelters camps beds evacuation relief capacity occupancy housing food",
    icon: Home,
  },
  {
    title: "Trauma Hospitals & Surge Grid",
    category: "Module",
    url: "/hospitals",
    keywords: "hospitals trauma medical icu doctors beds ventilators emergency surgical",
    icon: Hospital,
  },
  {
    title: "NGO Coordination & Relief Areas",
    category: "Module",
    url: "/ngos",
    keywords: "ngo coordination humanitarian charities relief aid non-profit oxfam red cross",
    icon: Building2,
  },
  {
    title: "Tactical Rescue Squads & Teams",
    category: "Module",
    url: "/rescue-teams",
    keywords: "rescue teams squads ndrf sdrf military amphibious boats vehicles dispatch",
    icon: Users2,
  },
  {
    title: "Emergency Resource Inventory & Stock",
    category: "Module",
    url: "/resources",
    keywords: "resources supplies inventory stock food water rations medicine clothing boats",
    icon: Boxes,
  },
  {
    title: "Volunteers Network & Mobilization",
    category: "Module",
    url: "/volunteers",
    keywords: "volunteers network skills cpr ham radio paramedics community",
    icon: HandHeart,
  },
  {
    title: "AI Decision Support & Tactical Insights",
    category: "Module",
    url: "/ai",
    keywords: "ai decision support gemini tactical recommendations forecasting gap analysis",
    icon: Bot,
    badge: "AI Powered",
  },
  {
    title: "AI Disaster Response Assistant (Chat)",
    category: "Action",
    url: "/ai/assistant",
    keywords: "ai assistant chatbot questions advisory natural language copilot",
    icon: Bot,
  },
  {
    title: "Disaster Operations Analytics & SLA",
    category: "Module",
    url: "/analytics",
    keywords: "analytics reports metrics stats charts response time sla performance",
    icon: BarChart3,
  },
  {
    title: "Public Landing Portal",
    category: "Module",
    url: "/",
    keywords: "landing page public portal website citizen front page",
    icon: Globe,
  },
  {
    title: "Incident: Cyclone Varuna (Western Estuary)",
    category: "Incident",
    url: "/disasters/dis-001",
    keywords: "cyclone varuna mumbai coastal belt gale storm surge",
    icon: Flame,
    badge: "Cat 4 Critical",
  },
  {
    title: "Incident: North Basin Flash Flood",
    category: "Incident",
    url: "/disasters/dis-002",
    keywords: "north basin flash flood patna rural bihar water level",
    icon: Flame,
    badge: "High",
  },
  {
    title: "Facility: Dharavi Sports Complex Shelter",
    category: "Facility",
    url: "/shelters",
    keywords: "dharavi sports complex shelter 1200 beds mumbai evacuation",
    icon: Home,
  },
  {
    title: "Facility: Lilavati Emergency Trauma Hospital",
    category: "Facility",
    url: "/hospitals",
    keywords: "lilavati hospital trauma icu beds oxygen bandra",
    icon: Hospital,
  },
];

export function Header({ title, subtitle }: HeaderProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener ('/' or 'Ctrl+K' / 'Cmd+K')
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        (e.key === "/" && (e.target as HTMLElement).tagName !== "INPUT" && (e.target as HTMLElement).tagName !== "TEXTAREA") ||
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const trimmed = query.trim().toLowerCase();
  const filtered = trimmed
    ? SEARCH_ITEMS.filter(
        (item) =>
          item.title.toLowerCase().includes(trimmed) ||
          item.keywords.toLowerCase().includes(trimmed) ||
          item.category.toLowerCase().includes(trimmed)
      )
    : SEARCH_ITEMS.slice(0, 8); // show popular quick jumps when empty

  function handleSelect(url: string) {
    setIsOpen(false);
    setQuery("");
    router.push(url);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && filtered.length > 0) {
      handleSelect(filtered[0].url);
    }
  }

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30 gap-4">
      {/* Title & Subtitle */}
      <div className="shrink-0">
        <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium truncate max-w-xs sm:max-w-md">
            {subtitle}
          </p>
        )}
      </div>

      {/* Global Interactive Command & Route Switcher Bar */}
      <div ref={containerRef} className="relative flex-1 max-w-lg mx-2">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type anything (e.g. Map, SOS, Shelters, NGOs, Cyclone)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            className="w-full pl-9 pr-14 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-100 dark:bg-slate-950/70 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition shadow-inner"
          />
          {query ? (
            <button
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="absolute right-3 top-2 text-slate-400 hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block absolute right-2.5 top-2 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded shadow-xs">
              /
            </kbd>
          )}
        </div>

        {/* Live Search & Module Switcher Dropdown */}
        {isOpen && (
          <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="p-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold px-2">
                {trimmed ? `Search Results (${filtered.length})` : "⚡ Quick Navigation & Operational Modules"}
              </span>
              <span className="text-[10px] text-slate-500 hidden sm:inline">Press Enter to open first</span>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 p-1">
              {filtered.length > 0 ? (
                filtered.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.title + idx}
                      onClick={() => handleSelect(item.url)}
                      className="w-full px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between text-left transition group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-7 w-7 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:text-sky-400 group-hover:border-sky-500/40 shrink-0">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-sky-400">
                            {item.title}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                            {item.category} • <code className="text-[10px] text-slate-400">{item.url}</code>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        {item.badge && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-950 border border-sky-800 text-sky-400">
                            {item.badge}
                          </span>
                        )}
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="py-6 px-4 text-center">
                  <p className="text-xs text-slate-400">No matching routes or records found for &quot;{query}&quot;.</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Try searching for: <span className="text-sky-400">map</span>, <span className="text-sky-400">shelter</span>, <span className="text-sky-400">sos</span>, <span className="text-sky-400">hospitals</span>, or <span className="text-sky-400">cyclone</span>.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Real-time Status Beacon */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Network Online</span>
        </div>

        {/* SOS Action Button */}
        <Link
          href="/sos/new"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition"
        >
          <LifeBuoy className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Broadcast SOS</span>
          <span className="sm:hidden">SOS</span>
        </Link>

        {/* Notifications Icon Link */}
        <Link
          href="/notifications"
          className="relative p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
        </Link>
      </div>
    </header>
  );
}
