# ReliefLink — External Data & Government Integrations

## 1. Integration Landscape (India First)

ReliefLink connects with Indian public safety agencies, geospatial observation feeds, and international humanitarian standards:

### A. National Disaster Management Authority (NDMA) — SACHET
- **Purpose**: Real-time CAP (Common Alerting Protocol) dissemination for cyclone, flood, earthquake, and extreme temperature warnings across telecom networks.
- **Protocol**: XML / CAP 1.2 REST Webhook subscriber.
- **Data Attributes**: Event identifier, severity (Alert / Warning / Advisory), geographical polygon envelope, instruction text.
- **Failover / Mock Interface**: In-memory CAP validator with official advisory fallbacks when disconnected from government intranet.

### B. India Meteorological Department (IMD)
- **Purpose**: Cyclone track forecasting, 3-hourly rainfall accumulation grids, and Doppler weather radar imagery.
- **Endpoints**: IMD Open Weather API and Gridded Rainfall NetCDF/GeoTIFF imports.
- **Update Cadence**: Automated hourly cron ingestion into PostGIS layer cache.

### C. Central Water Commission (CWC)
- **Purpose**: River gauge levels, danger-mark thresholds, and dam discharge rates across national river basins (e.g. Ganga, Brahmaputra, Godavari).
- **Threshold Triggers**: River levels exceeding "Danger Level" automatically generate high-priority flood alerts in corresponding district portals.

### D. ISRO / NRSC National Database for Emergency Management (NDEM)
- **Purpose**: High-resolution optical and SAR (Synthetic Aperture Radar) flood inundation extents from RISAT and Cartosat constellations.
- **Auth Model**: Signed OGC WMS/WFS endpoints with government agency token authorization.

### E. Census of India & WorldPop
- **Purpose**: Sub-district (Tehsil/Taluk) population density, household vulnerability breakdown (seniors, children, pregnant women).
- **Format**: Raster GeoTIFF (WorldPop 100m) + Vector Shapefile (Census 2011/2024 projections).
- **Storage**: Raster data indexed in PostgreSQL PostGIS raster or pre-calculated vector centroids.

### F. OpenStreetMap / Humanitarian OpenStreetMap Team (HOT)
- **Purpose**: Street-level routing, road accessibility, bridges, hospitals, and relief camp physical structures.
- **Licensing**: Open Database License (ODbL) with explicit attribution on all interactive maps.
