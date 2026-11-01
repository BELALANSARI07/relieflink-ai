"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, User, Mail, Phone, Lock, Loader2, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CITIZEN");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, phone, password, role }),
      });
      const json = await res.json();
      if (json.success) {
        router.push("/dashboard");
      } else {
        setError(json.error?.message || "Registration failed");
      }
    } catch (err: any) {
      setError("Registration failed. Please check network connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-6 selection:bg-sky-500 selection:text-white">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <span className="font-extrabold text-xl tracking-wide text-white flex items-center gap-2">
              ReliefLink <span className="text-xs px-2 py-0.5 rounded bg-sky-950 border border-sky-800 text-sky-400 font-bold">AI</span>
            </span>
          </Link>
          <h2 className="text-2xl font-black text-white">Create Citizen / Volunteer Account</h2>
          <p className="text-xs text-slate-400">Join the national disaster assistance and safety network</p>
        </div>

        <form onSubmit={handleRegister} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl text-xs">
          {error && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-300">
              {error}
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Account Role *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("CITIZEN")}
                className={`p-2.5 rounded-xl border text-center transition ${
                  role === "CITIZEN"
                    ? "border-sky-500 bg-sky-950/60 text-sky-300 font-bold"
                    : "border-slate-800 text-slate-400"
                }`}
              >
                👤 Citizen
              </button>
              <button
                type="button"
                onClick={() => setRole("VOLUNTEER")}
                className={`p-2.5 rounded-xl border text-center transition ${
                  role === "VOLUNTEER"
                    ? "border-sky-500 bg-sky-950/60 text-sky-300 font-bold"
                    : "border-slate-800 text-slate-400"
                }`}
              >
                🤝 Volunteer
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Full Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                required
                placeholder="e.g. Priya Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                placeholder="priya@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Emergency Mobile Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="tel"
                placeholder="+91-98765-43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Password *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 flex items-center justify-center gap-1.5 transition"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            <span>Create Account & Enter Grid</span>
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="text-sky-400 font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
