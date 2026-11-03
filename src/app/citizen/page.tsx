"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LifeBuoy,
  MapPin,
  Camera,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Heart,
  Home,
  Utensils,
  Droplets,
  ShieldAlert,
  Phone,
  Search,
  Globe,
  Radio,
  ArrowRight,
  ExternalLink,
  Info,
  Loader2,
  HelpCircle,
} from "lucide-react";
import { PortalSwitcher } from "@/components/layout/PortalSwitcher";

export default function CitizenPortalPage() {
  const [lang, setLang] = useState<"en" | "hi" | "mr" | "bn">("en");
  const [lowBandwidth, setLowBandwidth] = useState(false);
  const [activeTab, setActiveTab] = useState<"report" | "track" | "safe-map" | "shelters">("report");

  // Form State
  const [incidentType, setIncidentType] = useState("FLOOD");
  const [peopleCount, setPeopleCount] = useState(3);
  const [needs, setNeeds] = useState<string[]>(["FOOD_WATER", "EVACUATION"]);
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("Bungalow 14, Mahim Fisherman Colony, Mumbai");
  const [lat, setLat] = useState("19.0820");
  const [lng, setLng] = useState("72.8850");
  const [phone, setPhone] = useState("+91-98765-43210");
  const [submitting, setSubmitting] = useState(false);
  const [submittedSos, setSubmittedSos] = useState<any>(null);

  // Translations dictionary
  const t = {
    en: {
      headline: "Need Emergency Help or Relief Assistance?",
      subline: "ReliefLink connects your family directly with verified disaster authorities and nearest humanitarian aid teams.",
      reportBtn: "🚨 Report Emergency Now",
      trackBtn: "🔍 Track Existing Request",
      shelterBtn: "⛺ Find Open Evacuation Shelters",
      mapBtn: "🗺️ View Public Safe Map",
      lowBandwidthMode: "Low-Bandwidth Mode",
    },
    hi: {
      headline: "क्या आपको आपातकालीन सहायता या राहत सामग्री की आवश्यकता है?",
      subline: "रिलीफ़लिंक आपके परिवार को सीधे अधिकृत आपदा प्रबंधन और निकटतम मानवीय राहत दलों से जोड़ता है।",
      reportBtn: "🚨 अभी आपातकालीन सहायता मांगें",
      trackBtn: "🔍 अपनी सहायता स्थिति ट्रैक करें",
      shelterBtn: "⛺ खुले राहत शिविर खोजें",
      mapBtn: "🗺️ सुरक्षित सार्वजनिक मानचित्र देखें",
      lowBandwidthMode: "कम-बैंडविड्थ मोड",
    },
    mr: {
      headline: "तातडीची मदत किंवा अन्न-पाणी साहाय्य हवे आहे का?",
      subline: "रिलीफलिंक आपल्या कुटुंबाला थेट आपत्ती व्यवस्थापन पथके आणि मदत संस्थांशी जोडते.",
      reportBtn: "🚨 आत्ताच आपत्कालीन तक्रार नोंदवा",
      trackBtn: "🔍 मदत स्थिती तपासा",
      shelterBtn: "⛺ सुरक्षित निवारा केंद्रे शोधा",
      mapBtn: "🗺️ सार्वजनिक सुरक्षित नकाशा",
      lowBandwidthMode: "कमी-इंटरनेट मोड",
    },
    bn: {
      headline: "জরুরী উদ্ধার বা ত্রাণ সহায়তার প্রয়োজন?",
      subline: "রিলিফলিংক আপনার পরিবারকে সরাসরি দুর্যোগ কর্তৃপক্ষ এবং নিকটতম ত্রাণ সংস্থার সাথে সংযুক্ত করে।",
      reportBtn: "🚨 এখনই জরুরী সাহায্য চান",
      trackBtn: "🔍 অনুরোধের অবস্থা ট্র্যাক করুন",
      shelterBtn: "⛺ নিরাপদ আশ্রয়কেন্দ্র খুঁজুন",
      mapBtn: "🗺️ নিরাপদ মানচিত্র দেখুন",
      lowBandwidthMode: "কম-ব্যান্ডউইথ মোড",
    },
  }[lang];

  function toggleNeed(item: string) {
    setNeeds((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  }

  async function handleReportSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/sos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: incidentType,
          description: description || "Citizen emergency request via Civilian Portal.",
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
          address,
          contactPhone: phone,
          peopleCount,
          medicalNeeds: needs.includes("MEDICAL") ? "Urgent medical supplies requested" : undefined,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSubmittedSos(json.data.sos);
        setActiveTab("track");
      }
    } catch (err) {
      alert("Submission error. Please check connection.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF7F2] text-[#352823] flex flex-col font-sans selection:bg-[#F2A789] selection:text-[#352823]">
      {/* Top Portal Switcher Bar */}
      <PortalSwitcher />

      {/* Official Emergency Advisory Banner */}
      <div className="bg-[#FFE3D5] border-b border-[#F1DED4] px-4 py-2 text-center text-xs text-[#79665F] font-semibold flex items-center justify-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[#DB8064] animate-ping" />
        <span>
          OFFICIAL ADVISORY (NDMA): Cyclone Varuna & River Flood response active. Citizens in low-lying coastal & diara sectors please seek nearest shelter.
        </span>
      </div>

      {/* Portal Header */}
      <header className="bg-white border-b border-[#F1DED4] px-6 lg:px-12 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#FFE3D5] border border-[#F2A789] flex items-center justify-center text-[#DB8064]">
            <Heart className="h-5 w-5 fill-[#DB8064]" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-wide text-[#352823] flex items-center gap-1.5">
              ReliefLink <span className="text-xs px-2 py-0.5 rounded-full bg-[#FFE3D5] text-[#DB8064] font-bold">Civilian Portal</span>
            </span>
            <p className="text-[10px] text-[#79665F] font-medium uppercase tracking-wider">
              Citizen Emergency & Relief Assistance
            </p>
          </div>
        </div>

        {/* Accessibility & Language Selectors */}
        <div className="flex items-center gap-3">
          {/* Low Bandwidth Toggle */}
          <button
            onClick={() => setLowBandwidth(!lowBandwidth)}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
              lowBandwidth
                ? "bg-[#DB8064] text-white border-[#DB8064]"
                : "bg-[#FFF0E8] text-[#79665F] border-[#F1DED4] hover:bg-[#FFE3D5]"
            }`}
          >
            <Radio className="h-3.5 w-3.5" />
            <span>{t.lowBandwidthMode}</span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-[#FFF0E8] border border-[#F1DED4] rounded-xl p-1 text-xs font-bold text-[#79665F]">
            <Globe className="h-3.5 w-3.5 ml-1 text-[#DB8064]" />
            <button
              onClick={() => setLang("en")}
              className={`px-2 py-1 rounded-lg ${lang === "en" ? "bg-white text-[#DB8064] shadow-xs" : ""}`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("hi")}
              className={`px-2 py-1 rounded-lg ${lang === "hi" ? "bg-white text-[#DB8064] shadow-xs" : ""}`}
            >
              हिंदी
            </button>
            <button
              onClick={() => setLang("mr")}
              className={`px-2 py-1 rounded-lg ${lang === "mr" ? "bg-white text-[#DB8064] shadow-xs" : ""}`}
            >
              मराठी
            </button>
            <button
              onClick={() => setLang("bn")}
              className={`px-2 py-1 rounded-lg ${lang === "bn" ? "bg-white text-[#DB8064] shadow-xs" : ""}`}
            >
              বাংলা
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Warm Welcome Hero Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#F1DED4] shadow-sm space-y-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE3D5] text-[#DB8064] text-xs font-bold">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Free Humanitarian Service • 24/7 National Emergency Grid</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#352823] tracking-tight leading-snug">
              {t.headline}
            </h1>
            <p className="text-sm text-[#79665F] leading-relaxed">
              {t.subline}
            </p>
          </div>

          <div className="flex flex-col gap-2.5 w-full sm:w-auto shrink-0">
            <button
              onClick={() => setActiveTab("report")}
              className="w-full sm:w-56 px-6 py-3.5 rounded-2xl bg-[#DB8064] hover:bg-[#c97358] text-white font-extrabold text-xs shadow-md shadow-[#DB8064]/20 transition flex items-center justify-center gap-2"
            >
              <LifeBuoy className="h-4 w-4" />
              <span>{t.reportBtn}</span>
            </button>
            <button
              onClick={() => setActiveTab("track")}
              className="w-full sm:w-56 px-6 py-3 rounded-2xl bg-[#FFF0E8] hover:bg-[#FFE3D5] text-[#352823] font-bold text-xs border border-[#F1DED4] transition flex items-center justify-center gap-2"
            >
              <Clock className="h-4 w-4 text-[#DB8064]" />
              <span>{t.trackBtn}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#F1DED4] pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("report")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeTab === "report"
                ? "bg-[#FFE3D5] text-[#DB8064] border border-[#F2A789]"
                : "text-[#79665F] hover:bg-white"
            }`}
          >
            <LifeBuoy className="h-4 w-4" />
            <span>1. Report Emergency</span>
          </button>

          <button
            onClick={() => setActiveTab("track")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeTab === "track"
                ? "bg-[#FFE3D5] text-[#DB8064] border border-[#F2A789]"
                : "text-[#79665F] hover:bg-white"
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>2. Track My Request</span>
          </button>

          <button
            onClick={() => setActiveTab("shelters")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeTab === "shelters"
                ? "bg-[#FFE3D5] text-[#DB8064] border border-[#F2A789]"
                : "text-[#79665F] hover:bg-white"
            }`}
          >
            <Home className="h-4 w-4" />
            <span>3. Evacuation Shelters</span>
          </button>

          <Link
            href="/map"
            className="px-4 py-2 rounded-xl text-xs font-bold text-[#79665F] hover:bg-white transition flex items-center gap-2 shrink-0 ml-auto"
          >
            <MapPin className="h-4 w-4 text-[#DB8064]" />
            <span>Full GIS Map →</span>
          </Link>
        </div>

        {/* TAB 1: REPORT EMERGENCY FORM */}
        {activeTab === "report" && (
          <div className="bg-white border border-[#F1DED4] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-[#F1DED4] pb-4">
              <h2 className="text-lg font-extrabold text-[#352823] flex items-center gap-2">
                <LifeBuoy className="h-5 w-5 text-[#DB8064]" />
                <span>Submit Emergency Assistance Request</span>
              </h2>
              <p className="text-xs text-[#79665F] mt-1">
                Fill in the details below. Our automated system detects duplicates and alerts the nearest active NDRF/SDRF squad or humanitarian NGO.
              </p>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-6 text-xs">
              {/* Type of Emergency */}
              <div>
                <label className="font-bold text-[#352823] block mb-2">
                  What kind of emergency is this?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: "FLOOD", label: "🌊 Flood / Rising Water" },
                    { id: "EVACUATION", label: "🚶 Stranded / Cut Off" },
                    { id: "MEDICAL", label: "🚑 Severe Medical Need" },
                    { id: "RESCUE", label: "🏚️ Structural Collapse" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setIncidentType(t.id)}
                      className={`p-3 rounded-2xl border text-center font-bold text-xs transition ${
                        incidentType === t.id
                          ? "bg-[#FFE3D5] text-[#DB8064] border-[#DB8064] ring-2 ring-[#DB8064]/30"
                          : "bg-[#FFF0E8] text-[#79665F] border-[#F1DED4] hover:bg-white"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* What Assistance is Needed */}
              <div>
                <label className="font-bold text-[#352823] block mb-2">
                  What assistance does your group need immediately?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {[
                    { id: "FOOD_WATER", label: "🍱 Food & Rations" },
                    { id: "WATER", label: "💧 Drinking Water" },
                    { id: "EVACUATION", label: "🚤 Boat Rescue" },
                    { id: "MEDICAL", label: "💊 Medicine / Insulin" },
                    { id: "SHELTER", label: "⛺ Dry Shelter" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleNeed(item.id)}
                      className={`p-2.5 rounded-xl border text-center font-semibold text-xs transition ${
                        needs.includes(item.id)
                          ? "bg-[#FFE3D5] text-[#DB8064] border-[#DB8064]"
                          : "bg-[#FFF7F2] text-[#79665F] border-[#F1DED4]"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Picker */}
              <div className="p-4 rounded-2xl bg-[#FFF7F2] border border-[#F1DED4] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#352823] flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-[#DB8064]" />
                    <span>Exact Location / Address</span>
                  </label>
                  <span className="text-[11px] text-[#DB8064] font-semibold">
                    📍 GPS Auto-Detected
                  </span>
                </div>

                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#F1DED4] text-[#352823] text-xs focus:outline-none focus:ring-2 focus:ring-[#F2A789]"
                  placeholder="Street name, landmark, house number..."
                />

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-[#79665F] block mb-0.5">Latitude:</span>
                    <input
                      type="text"
                      value={lat}
                      onChange={(e) => setLat(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#F1DED4] font-mono"
                    />
                  </div>
                  <div>
                    <span className="text-[#79665F] block mb-0.5">Longitude:</span>
                    <input
                      type="text"
                      value={lng}
                      onChange={(e) => setLng(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#F1DED4] font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* People Affected & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#352823] block mb-1.5">
                    Number of People Trapped / Affected
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="500"
                      value={peopleCount}
                      onChange={(e) => setPeopleCount(parseInt(e.target.value, 10) || 1)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FFF7F2] border border-[#F1DED4] text-xs font-bold"
                    />
                    <div className="flex gap-1">
                      {[1, 2, 4, 10].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setPeopleCount(num)}
                          className="px-2.5 py-2 rounded-lg bg-[#FFE3D5] text-[#DB8064] font-bold text-xs hover:bg-[#fbd0bc]"
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#352823] block mb-1.5">
                    Contact Phone Number (For Responders)
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF7F2] border border-[#F1DED4] text-xs"
                    placeholder="+91-98765-43210"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-bold text-[#352823] block mb-1.5">
                  Describe the Situation (Water height, injuries, building condition)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Water entered ground floor, 4 family members including grandmother on terrace, mobile battery low..."
                  className="w-full px-3 py-2.5 rounded-xl bg-[#FFF7F2] border border-[#F1DED4] text-xs resize-none"
                />
              </div>

              {/* Photo Upload Simulation */}
              <div className="p-3 rounded-2xl bg-[#FFF0E8] border border-dashed border-[#DB8064]/50 flex items-center justify-between text-xs text-[#79665F]">
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4 text-[#DB8064]" />
                  <span>Attach Photograph of Emergency (Optional)</span>
                </div>
                <button
                  type="button"
                  onClick={() => alert("Photo capture ready. Uses device camera or file gallery.")}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#F1DED4] text-[#DB8064] font-bold text-xs hover:bg-[#FFE3D5]"
                >
                  Upload Evidence
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-2xl bg-[#DB8064] hover:bg-[#c97358] text-white font-extrabold text-sm shadow-lg shadow-[#DB8064]/25 transition flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Broadcasting to Disaster Response Grid...</span>
                  </>
                ) : (
                  <>
                    <LifeBuoy className="h-5 w-5" />
                    <span>Submit & Request Immediate Help</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: TRACK REQUEST */}
        {activeTab === "track" && (
          <div className="bg-white border border-[#F1DED4] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-[#F1DED4] pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-[#352823]">
                  Emergency Assistance Status Tracker
                </h2>
                <p className="text-xs text-[#79665F] mt-0.5">
                  Real-time pipeline tracking your request from verification to verified relief delivery.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#FFE3D5] text-[#DB8064] font-bold text-xs">
                Request #SOS-101
              </span>
            </div>

            {/* Workflow Progress Stepper */}
            <div className="p-4 rounded-2xl bg-[#FFF7F2] border border-[#F1DED4] space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                  <CheckCircle2 className="h-4 w-4 mx-auto mb-1 text-emerald-600" />
                  <span className="font-bold block">1. REQUESTED</span>
                  <span className="text-[10px] text-emerald-600">Captured</span>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                  <CheckCircle2 className="h-4 w-4 mx-auto mb-1 text-emerald-600" />
                  <span className="font-bold block">2. VERIFIED</span>
                  <span className="text-[10px] text-emerald-600">Geo-Validated</span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FFE3D5] border border-[#DB8064] text-[#DB8064]">
                  <Clock className="h-4 w-4 mx-auto mb-1 text-[#DB8064] animate-spin" />
                  <span className="font-bold block">3. ASSIGNED</span>
                  <span className="text-[10px] font-semibold">NDRF Bravo Squad</span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FFF0E8] border border-[#F1DED4] text-[#79665F]">
                  <span className="h-4 w-4 block mx-auto mb-1">🚤</span>
                  <span className="font-bold block">4. DISPATCHED</span>
                  <span className="text-[10px]">En Route</span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FFF0E8] border border-[#F1DED4] text-[#79665F]">
                  <span className="h-4 w-4 block mx-auto mb-1">🏁</span>
                  <span className="font-bold block">5. DELIVERED</span>
                  <span className="text-[10px]">Handover</span>
                </div>
              </div>

              {/* Active Incident Summary */}
              <div className="p-4 rounded-xl bg-white border border-[#F1DED4] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#352823]">Assigned Response Team:</span>
                  <span className="font-bold text-[#DB8064]">NDRF Bravo Amphibious Unit</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#79665F]">Destination Address:</span>
                  <span className="font-semibold text-[#352823]">Bungalow 14, Fisherman Colony, Mahim Creek</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#79665F]">ETA of Rescue Craft:</span>
                  <span className="font-bold text-emerald-600">Approx. 18 minutes</span>
                </div>
              </div>
            </div>

            {/* Helpline Card */}
            <div className="p-4 rounded-2xl bg-[#FFF0E8] border border-[#F1DED4] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Phone className="h-5 w-5 text-[#DB8064]" />
                <div>
                  <h4 className="font-bold text-xs text-[#352823]">Toll-Free National Disaster Helpline</h4>
                  <p className="text-[11px] text-[#79665F]">Call 1078 (NDMA) or 112 (National Emergency) if network drops.</p>
                </div>
              </div>
              <a
                href="tel:112"
                className="px-4 py-2 rounded-xl bg-[#DB8064] text-white font-bold text-xs hover:bg-[#c97358]"
              >
                Call 112
              </a>
            </div>
          </div>
        )}

        {/* TAB 3: OPEN EVACUATION SHELTERS */}
        {activeTab === "shelters" && (
          <div className="bg-white border border-[#F1DED4] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-[#F1DED4] pb-4">
              <h2 className="text-lg font-extrabold text-[#352823] flex items-center gap-2">
                <Home className="h-5 w-5 text-[#DB8064]" />
                <span>Verified Public Shelters & Relief Camps</span>
              </h2>
              <p className="text-xs text-[#79665F] mt-0.5">
                Shelters verified by government authorities with food, clean drinking water, dry bedding, and medical assistance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#FFF7F2] border border-[#F1DED4] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    OPEN • 57% FULL
                  </span>
                  <span className="text-[11px] text-[#79665F]">3.2 km away</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#352823]">Dharavi Sports Complex Relief Center</h3>
                  <p className="text-[#79665F] text-[11px] mt-0.5">90 Feet Road, Dharavi, Mumbai</p>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#F1DED4]">
                  <span>Available Beds: <strong className="text-[#DB8064]">340 Beds</strong></span>
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=19.0400,72.8550"
                    target="_blank"
                    className="font-bold text-[#DB8064] hover:underline flex items-center gap-1"
                  >
                    <span>Get Directions</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFF7F2] border border-[#F1DED4] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    OPEN • 45% FULL
                  </span>
                  <span className="text-[11px] text-[#79665F]">4.8 km away</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#352823]">Gandhi Maidan Relief Encampment</h3>
                  <p className="text-[#79665F] text-[11px] mt-0.5">Gandhi Maidan Sector, Patna Central</p>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#F1DED4]">
                  <span>Available Beds: <strong className="text-[#DB8064]">420 Beds</strong></span>
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=25.6020,85.1250"
                    target="_blank"
                    className="font-bold text-[#DB8064] hover:underline flex items-center gap-1"
                  >
                    <span>Get Directions</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Warm Footer */}
      <footer className="border-t border-[#F1DED4] bg-white px-6 py-6 text-center text-xs text-[#79665F] space-y-1">
        <p className="font-semibold">ReliefLink Civilian Portal • Built for Citizens in Crisis</p>
        <p className="text-[11px]">Personal identities and residential coordinates are encrypted and protected under national data privacy guidelines.</p>
      </footer>
    </div>
  );
}
