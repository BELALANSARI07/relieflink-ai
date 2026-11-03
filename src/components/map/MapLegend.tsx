"use client";

import { useState } from "react";
import { Info, ChevronUp, ChevronDown } from "lucide-react";

export function MapLegend() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="absolute bottom-6 left-6 z-[1000] bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl shadow-2xl p-3 max-w-xs text-xs text-slate-300">
      <div
        className="flex items-center justify-between cursor-pointer select-none pb-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 font-bold text-white text-xs">
          <Info className="h-4 w-4 text-sky-400" />
          <span>Emergency Map Legend</span>
        </div>
        <button className="text-slate-400 hover:text-white">
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-2 space-y-2 border-t border-slate-800 pt-2 text-[11px]">
          <div>
            <span className="font-semibold text-slate-400 block mb-1">SOS Distress Severities:</span>
            <div className="grid grid-cols-2 gap-1.5">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-600 ring-2 ring-red-400/50 shrink-0 animate-pulse" />
                <span>Critical / Life Threat</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-orange-500 shrink-0" />
                <span>High Priority</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-amber-400 shrink-0" />
                <span>Moderate Needs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-blue-500 shrink-0" />
                <span>Medical Emergency</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-emerald-500 shrink-0" />
                <span>Resolved / Rescued</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-1.5">
            <span className="font-semibold text-slate-400 block mb-1">Infrastructure & Response:</span>
            <div className="grid grid-cols-2 gap-1.5">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded bg-purple-500/30 border border-purple-500 shrink-0" />
                <span>Disaster Perimeter</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-cyan-500 flex items-center justify-center text-[9px] font-bold text-black shrink-0">
                  R
                </span>
                <span>Rescue Squad</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-indigo-500 flex items-center justify-center text-[9px] font-bold text-white shrink-0">
                  S
                </span>
                <span>Evac Shelter</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-emerald-600 flex items-center justify-center text-[9px] font-bold text-white shrink-0">
                  +
                </span>
                <span>Trauma Hospital</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
