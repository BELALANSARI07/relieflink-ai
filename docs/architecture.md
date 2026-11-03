# ReliefLink — Master System Architecture

## 1. Executive Summary & Vision

**ReliefLink** is an integrated humanitarian response and disaster intelligence infrastructure connecting citizens, NGOs, government authorities, and tactical rescue teams through a shared emergency response backbone.

Geographical Strategy: **India First** (optimized for Indian disaster patterns: tropical cyclones, monsoonal river breaches, seismic Himalayan fractures, and urban flash floods), engineered for seamless international humanitarian expansion.

### The Complete Disaster Response Lifecycle:
```
DISASTER DETECTION
       │
       ▼
EMERGENCY REPORTING (Civilian Portal & Direct Map Pinning)
       │
       ▼
INCIDENT VERIFICATION (AI Duplicate Suppression & Field Recon)
       │
       ▼
POPULATION IMPACT ASSESSMENT (Census of India & WorldPop 100m Grid)
       │
       ▼
TACTICAL PRIORITIZATION (Severity Scoring & Vulnerability Index)
       │
       ▼
NGO & RESCUE ALLOCATION (Explainable Matching Engine & Conflict Check)
       │
       ▼
RESCUE & RELIEF DISPATCH (Offline-First Field PWA & GPS Tracking)
       │
       ▼
DELIVERY VERIFICATION (7-Stage Workflow: REQUESTED → CONFIRMED)
       │
       ▼
RELIEF GAP & IMPACT ANALYSIS (Underserved Locality Heatmaps)
```

---

## 2. Four Connected User Portals & Dual Design System

ReliefLink enforces strict portal-based visual theming sharing a unified data store and database layer:

### A. Civilian / Citizen Portal (`/citizen`)
- **Theme**: Light, warm peach & cream (`#FFF7F2` background, `#FFF0E8` secondary, `#FFE3D5` cards, `#DB8064` coral accents, `#352823` text).
- **UX Goal**: Simple, reassuring, accessible to people in acute crisis or with limited digital literacy.
- **Key Features**:
  - One-tap emergency broadcast with photo upload and GPS coordinate capture.
  - Active assistance tracker (`REQUESTED → VERIFIED → ASSIGNED → DISPATCHED → COMPLETED`).
  - Public safe map (sensitive residential coordinates jittered/obscured for civilian privacy).
  - Multilingual support (English, Hindi, Marathi, Bengali, Tamil).
  - Low-bandwidth mode with large tactile touch buttons.

### B. NGO / Humanitarian Organization Portal (`/ngo`)
- **Theme**: Professional peach/cream light interface with coral operational accents.
- **UX Goal**: Multi-warehouse inventory control, dispatch oversight, and inter-agency mutual aid.
- **Key Features**:
  - Organization verification badge (80G/12A legal status).
  - Real-time warehouse inventory management (food packets, potable water, medical trauma dressings, tarpaulins) with expiry dates and reserve locks.
  - 7-Stage Delivery State Machine (`REQUESTED → VERIFIED → ASSIGNED → ACCEPTED → DISPATCHED → DELIVERED → CONFIRMED`).
  - NGO-to-NGO surplus sharing board to eliminate resource waste.

### C. Government Authority Portal (`/authority`)
- **Theme**: Premium dark command center (`#0B1220` deep navy, `#111C2E` secondary, `#17263B` panels, `#56C5E8` cyan, `#438EED` blue).
- **UX Goal**: Real-time national, state, and district incident command and inter-agency coordination.
- **Key Features**:
  - National & District Dashboards.
  - Population Intelligence Engine (Census of India + WorldPop 100m grid intersection).
  - Relief Gap Detection Engine (highlighting unserved sectors and delayed deliveries).
  - Incident verification, duplicate merging, and escalation console.
  - Immutable audit trail.

### D. Rescue Team / Field Operations Portal (`/field`)
- **Theme**: Tactical high-contrast dark field UI with large touch targets.
- **UX Goal**: Rapid action in harsh field conditions (monsoon rains, darkness, boat navigation).
- **Key Features**:
  - Assigned tactical missions with priority instructions and on-scene hazard alerts.
  - One-tap status buttons: Accept Mission, En Route, On Scene, Rescued.
  - Turn-by-turn navigation via Google Maps & OpenStreetMap.
  - **Offline-First PWA Caching & Queued Synchronization**: Caches mission data in local storage and queues status transitions when disconnected, auto-syncing upon reconnection.

---

## 3. Specialized Intelligence Engines

### 1. Population Intelligence Engine
- **Methodology**: Rather than treating an entire district as affected, the engine intersects disaster boundary polygons (radius or vector geofence) with 100m population settlement rasters (WorldPop / GHSL).
- **Three Rigorous Metrics**:
  1. *Total Residential Population*: Baseline census count inside administrative boundary.
  2. *Estimated Exposed Population*: Modelled count residing inside the physical hazard zone.
  3. *Verified Affected Population*: Cumulative confirmed persons with active distress reports.

### 2. Relief Gap Detection Engine
- **Core Principle**: A locality is marked "served" *strictly* to the extent that actual deliveries have been verified on site.
- Continuously correlates exposed population density, pending distress requests, and verified supply logs to flag underserved clusters (e.g. Danapur Diara river breach).

### 3. Intelligent NGO Assignment Engine
- Multi-criteria scoring:
  $$\text{Score} = w_1 \cdot \text{SkillMatch} + w_2 \cdot \text{Proximity} - w_3 \cdot \text{WorkloadPenalty}$$
- Enforces conflict checks, inventory reservations, and human authorization before critical dispatches.
