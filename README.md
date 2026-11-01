# ReliefLink AI — AI-Powered Disaster Response & Relief Coordination Platform

> **Live Operational Grid:** Connecting Government Authorities, Disaster Management Agencies, NGOs, Rescue Squads, Hospitals, Shelters, and Affected Communities through a unified intelligent command network.

[![Build Status](https://img.shields.io/badge/Build-Passing-emerald)](https://github.com/BELALANSARI07/relieflink-ai)
[![Framework](https://img.shields.io/badge/Next.js-15.5-black)](https://nextjs.org)
[![Language](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org)
[![Database](https://img.shields.io/badge/PostgreSQL-PostGIS-336791)](https://postgis.net)
[![AI Integration](https://img.shields.io/badge/Google-Gemini_AI-4285F4)](https://ai.google.dev)

---

## 1. Executive Overview & Problem Statement

During major emergencies, response delays and uncoordinated relief result in tragic loss of life and misallocated aid. ReliefLink AI resolves the five core failure modes of humanitarian crisis response:

1. **Information Gaps:** Authorities and field squads operate on fragmented, delayed channels.
2. **Duplicate Relief Operations:** Multiple NGOs unknowingly deliver redundant dry rations to the same accessible sectors while remote clusters are left unassisted.
3. **Citizen Distress Triage Delays:** SOS requests arrive without structured triage, GPS tagging, or medical prioritization.
4. **Shelter & Trauma Hospital Bottlenecks:** Displaced evacuees flood overcrowded facilities while adjacent centers remain underutilized.
5. **Slow First Responder Dispatch:** Lack of specialization matching (e.g., dispatching general volunteers when amphibious water rescue boats or acoustic listening units are required).

ReliefLink AI solves this with **One Coordinated Disaster Response Grid** powered by explainable AI decision support.

---

## 2. Platform Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT FRONTEND                          │
│  Next.js App Router (React 19 + TypeScript + Tailwind CSS)  │
│  ├── Command Center Dashboard (/dashboard)                  │
│  ├── Live Citizen SOS Beacon & Tracking (/sos, /sos/new)    │
│  ├── Disaster Incident Management (/disasters)              │
│  ├── Interactive Geospatial Incident Map (/map)             │
│  ├── NGO Verification & Void Coordination (/ngos)           │
│  ├── Tactical Rescue Squad Operations (/rescue-teams)       │
│  ├── Real-time Shelter & Evacuation Grid (/shelters)        │
│  ├── Emergency Trauma & ICU Hospital Network (/hospitals)   │
│  ├── Logistics & Supply Stockpile Tracker (/resources)      │
│  ├── Community Volunteer Mobilization (/volunteers)         │
│  └── AI Decision Support & Chat Assistant (/ai)             │
└──────────────────────────────┬──────────────────────────────┘
                               │ JSON REST API
┌──────────────────────────────┴──────────────────────────────┐
│                    SERVER API ROUTE LAYER                   │
│  ├── /api/auth (Login, Register, Session Validation)        │
│  ├── /api/disasters (Incident CRUD, Field Bulletins)        │
│  ├── /api/sos (Citizen Influx, AI Triage, Squad Dispatch)   │
│  ├── /api/ngos (Verification, Task Distribution)            │
│  ├── /api/rescue-teams (Squad Deployments, Lat/Lng Status)  │
│  ├── /api/shelters & /api/hospitals (Capacity Updates)      │
│  ├── /api/resources (Inventory Allocations)                 │
│  ├── /api/map/layers (Unified Geospatial Layer Feed)        │
│  └── /api/ai (Classification, NGO Recommender, Chatbot)     │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────┐
│                   INTELLIGENCE & DATA LAYER                 │
│  ├── Google Gemini 1.5 Flash (Multimodal NLP & Triage)      │
│  ├── Heuristic Decision Engine (Zero-Downtime Rule Fallback)│
│  ├── PostGIS Geospatial Database (Spatial Proximity Queries)│
│  └── In-Memory / File Persistent Repository Data Store       │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Key Product Modules

### 🚨 Emergency Citizen SOS & Triage
- One-touch emergency distress beacon with automatic browser GPS coordinate retrieval.
- Categorization across: **Evacuation / Trapped, Severe Medical, Food & Water, Structural Collapse, Urgent Shelter**.
- Automated AI urgency classification (*Critical, High, Medium, Low*) based on casualties, medical needs, and rising water levels.
- Automated duplicate SOS suppression algorithm (flags repetitive reports within 600m radius).

### 🏛️ Incident Command & Disaster Management
- Multi-incident registry with dynamic radius tracking and affected population calculation.
- Status transition workflow: `Reported` → `Verified` → `Active` → `Contained` → `Resolved` → `Closed`.
- Field situation bulletins with instant multi-agency broadcasts.

### 🤝 NGO Coordination & Coverage Void Detection
- Official government verification workflow for humanitarian organizations.
- Capability matching (*WASH, Emergency Rations, Mobile Clinics, Dignity Kits*).
- AI coverage void engine identifies unassigned geographical sectors and recommends the optimal partner based on proximity, inventory, and active workload.

### 🗺️ Interactive Geospatial Incident Map
- Multi-layer visual canvas showing:
  - Active disaster zones with impact radii.
  - Citizen distress pins color-coded by severity.
  - Tactical rescue units and current deployment positions.
  - Evacuation shelters with live occupancy percentage bars.
  - Level-1 trauma medical centers with ICU bed counts.

### ⛺ Evacuation Shelters & Hospital Capacity Grid
- Live intake management preventing shelter overflows.
- Direct quick-adjust controls (+25, +50, -25 evacuees).
- Real-time hospital bed and ICU ventilator availability monitoring.

### 🤖 Explainable AI Decision Support
- Human-in-the-loop operational architecture: AI generates structured recommendations with confidence scores and reasoning explanations, requiring commander confirmation before dispatch.
- 24/7 Natural Language Disaster Safety Assistant for citizen guidance.

---

## 4. Local Setup & Quickstart

### Prerequisites
- Node.js 18+ (tested on Node v20 & v24)
- npm or pnpm

### Installation
```bash
# 1. Clone repository
git clone https://github.com/BELALANSARI07/relieflink-ai.git
cd relieflink-ai

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local

# 4. Run development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 5. Demo Sign-In Credentials

For demonstration, the login portal features one-click role sign-in buttons:

| Role | Email | Capabilities |
|---|---|---|
| **Incident Commander** | `authority@relieflink.org` | Full Command Center, Disaster Declarations, Triage Dispatch |
| **NGO Administrator** | `coordinator@oxfamindia.org` | Task Acceptances, Field Activity Logs, Supply Requests |
| **Rescue Squad Lead** | `alpha.leader@ndrf.gov.in` | Squad Status, Mission Deployment, On-Scene Casualty Triage |
| **Citizen** | `citizen.priya@gmail.com` | Direct SOS Submission, Evacuation Shelter Locator, Live Status |

---

## 6. Docker Deployment

Deploy full stack including PostGIS database using Docker Compose:

```bash
# Build and launch all services
docker-compose up --build -d

# View logs
docker-compose logs -f
```

---

## 7. Automated Testing

Run the automated test suite verifying domain triage, duplicate detection, and NGO recommendation engines:

```bash
npm test
# Or directly:
node --test tests/platform.test.mjs
```

---

## 8. License & Governance

Licensed under the Apache-2.0 License. Designed in compliance with NDMA and humanitarian disaster response coordination frameworks.
