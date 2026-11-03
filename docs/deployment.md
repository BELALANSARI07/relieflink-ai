# ReliefLink — Production Deployment & DevOps Architecture

## 1. Containerization & Production Topology

ReliefLink is packaged using multi-stage Docker builds and coordinated via Docker Compose / Kubernetes.

```
                  ┌──────────────────────┐
                  │ Cloudflare CDN / WAF │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │ Nginx Reverse Proxy  │
                  └──────────┬───────────┘
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
┌───────────────────────┐         ┌───────────────────────┐
│ Next.js App Service 1 │         │ Next.js App Service 2 │
│ (Port 3000)           │         │ (Port 3000)           │
└───────────┬───────────┘         └───────────┬───────────┘
            │                                 │
            └────────────────┬────────────────┘
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
┌────────────────────────┐        ┌───────────────────────┐
│ PostgreSQL 16 PostGIS  │        │ Redis 7 Queue & Cache │
│ (Port 5432)            │        │ (Port 6379)           │
└────────────────────────┘        └───────────────────────┘
```

---

## 2. Environment Variables Specification

```bash
# Application Runtime
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_APP_URL=https://relieflink.in

# Database Configuration
DATABASE_URL=postgresql://relieflink_admin:secret_pass@localhost:5432/relieflink_db?schema=public

# AI / Decision Support Keys (Optional Google Gemini or Local Model)
GEMINI_API_KEY=AIzaSy...

# Geospatial Tile Services
NEXT_PUBLIC_MAP_TILE_URL=https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png
NEXT_PUBLIC_OSM_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png

# Redis Cache & Message Queue
REDIS_URL=redis://localhost:6379

# Storage Service for Photos & Evidence
S3_BUCKET_NAME=relieflink-evidence
S3_REGION=ap-south-1
S3_ACCESS_KEY_ID=AKIA...
S3_SECRET_ACCESS_KEY=...
```

---

## 3. High Availability, Healthchecks & Disaster Recovery

- **Liveness Probe**: `GET /api/analytics/overview` (returns 200 OK within 300ms).
- **Automated Backup Strategy**: Hourly WAL (Write-Ahead Logging) archiving with daily compressed `pg_dump` pushed to immutable cloud storage.
- **Failover Target**: RTO (Recovery Time Objective) < 15 minutes; RPO (Recovery Point Objective) < 1 hour.
