"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, Lock, Mail, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("authority@relieflink.org");
  const [password, setPassword] = useState("Admin@123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e?: React.FormEvent, customEmail?: string) {
    if (e) e.preventDefault();
    const targetEmail = customEmail || email;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail, password: password || "demo123" }),
      });
      const json = await res.json();
      if (json.success) {
        router.push("/dashboard");
      } else {
        setError(json.error?.message || "Invalid credentials");
      }
    } catch (err: any) {
      setError("Login failed. Please check network connection.");
    } finally {
      setLoading(false);
    }
  }

  function handleQuickRole(roleEmail: string) {
    setEmail(roleEmail);
    handleLogin(undefined, roleEmail);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-6 selection:bg-sky-500 selection:text-white">
      <div className="max-w-md w-full space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <span className="font-extrabold text-xl tracking-wide text-white flex items-center gap-2">
              ReliefLink <span className="text-xs px-2 py-0.5 rounded bg-sky-950 border border-sky-800 text-sky-400 font-bold">AI</span>
            </span>
          </Link>
          <h2 className="text-2xl font-black text-white">Emergency Command Portal</h2>
          <p className="text-xs text-slate-400">Sign in to access disaster operations & multi-agency command</p>
        </div>

        {/* Quick Role Fill Pills */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
            One-Click Operational Role Sign In
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickRole("authority@relieflink.org")}
              className="p-2 rounded-lg bg-sky-950/60 hover:bg-sky-900 border border-sky-800 text-sky-300 font-semibold text-left transition"
            >
              <span className="block font-bold">🏛️ Authority</span>
              <span className="text-[10px] text-slate-400">Incident Commander</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRole("coordinator@oxfamindia.org")}
              className="p-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 font-semibold text-left transition"
            >
              <span className="block font-bold">🤝 NGO Admin</span>
              <span className="text-[10px] text-slate-400">Oxfam India</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRole("alpha.leader@ndrf.gov.in")}
              className="p-2 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-300 font-semibold text-left transition"
            >
              <span className="block font-bold">🚨 Rescue Squad</span>
              <span className="text-[10px] text-slate-400">NDRF Unit Lead</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRole("citizen.priya@gmail.com")}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-semibold text-left transition"
            >
              <span className="block font-bold">👤 Citizen</span>
              <span className="text-[10px] text-slate-400">Priya Sharma</span>
            </button>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          {error && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-300 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Official Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 flex items-center justify-center gap-1.5 transition"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            <span>Sign In to Grid</span>
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Citizen or volunteer?{" "}
          <Link href="/register" className="text-sky-400 font-bold hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}
