"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import {
  Bot,
  Send,
  Sparkles,
  Phone,
  AlertTriangle,
  Loader2,
  ArrowLeft,
  LifeBuoy,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  advisory?: string;
  helplines?: { agency: string; phone: string }[];
}

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I am ReliefLink AI Emergency Response Assistant. How can I assist you with disaster protocols, shelter directions, or emergency aid triage?",
      helplines: [
        { agency: "National Emergency", phone: "112" },
        { agency: "NDRF Control Room", phone: "011-24363260" },
        { agency: "Ambulance", phone: "108" },
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend(promptText?: string) {
    const textToSend = promptText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });
      const json = await res.json();
      if (json.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: json.data.reply,
            advisory: json.data.safetyAdvisory,
            helplines: json.data.helplines,
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "System connection temporarily limited. For immediate life-saving emergencies, dial 112 or 108 directly.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col h-screen">
      <Header
        title="AI Emergency Response Assistant"
        subtitle="Natural-Language Disaster Safety Guidance, Shelter Lookups & Protocol Verification"
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Main Chat Stream */}
        <div className="flex-1 flex flex-col justify-between p-6 overflow-hidden">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 max-w-2xl ${
                  m.role === "user" ? "ml-auto justify-end" : "mr-auto"
                }`}
              >
                {m.role === "assistant" && (
                  <div className="h-8 w-8 rounded-full bg-sky-950 border border-sky-800 text-sky-400 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`p-4 rounded-2xl text-xs space-y-2 shadow-sm ${
                    m.role === "user"
                      ? "bg-sky-600 text-white rounded-br-none"
                      : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none"
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>

                  {m.advisory && (
                    <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-900/50 text-amber-300 text-[11px] font-medium flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span>{m.advisory}</span>
                    </div>
                  )}

                  {m.helplines && m.helplines.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-2 text-[10px]">
                      {m.helplines.map((h, i) => (
                        <a
                          key={i}
                          href={`tel:${h.phone}`}
                          className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono flex items-center gap-1 hover:bg-slate-200"
                        >
                          <Phone className="h-3 w-3 text-emerald-500" />
                          <span>{h.agency}: {h.phone}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 max-w-xl mr-auto">
                <div className="h-8 w-8 rounded-full bg-sky-950 border border-sky-800 text-sky-400 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 animate-spin" />
                </div>
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Synthesizing disaster response instructions...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompt Chips & Input Bar */}
          <div className="pt-4 space-y-3">
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                "What to do during rising flood waters?",
                "Which emergency shelters have open beds?",
                "How do I submit an emergency SOS?",
                "Check hospital trauma bed availability",
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip)}
                  className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-medium transition"
                >
                  {chip}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="Ask about disaster safety, evacuation routes, helpline numbers, or shelter capacity..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Ask AI</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Help Desk Sidebar */}
        <aside className="w-72 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-5 hidden lg:block overflow-y-auto space-y-5">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Emergency Hotlines
            </h3>
            <p className="text-[11px] text-slate-500">24/7 Toll-Free Crisis Numbers</p>
          </div>

          <div className="space-y-2.5 text-xs font-medium">
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60">
              <p className="text-[10px] uppercase font-bold text-red-500">National Emergency</p>
              <p className="font-mono text-base font-black text-red-600 mt-0.5">112</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <p className="text-[10px] uppercase font-bold text-slate-500">NDRF Central Control</p>
              <p className="font-mono text-xs font-bold text-slate-900 dark:text-white mt-0.5">011-24363260</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <p className="text-[10px] uppercase font-bold text-slate-500">Medical Ambulance</p>
              <p className="font-mono text-xs font-bold text-slate-900 dark:text-white mt-0.5">108</p>
            </div>
          </div>

          <Link
            href="/sos/new"
            className="w-full py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold block text-center shadow-sm transition"
          >
            🚨 Submit Emergency SOS
          </Link>
        </aside>
      </div>
    </div>
  );
}
