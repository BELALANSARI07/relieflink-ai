"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import {
  Search,
  Maximize2,
  Minimize2,
  Compass,
  Plus,
  Minus,
  Layers,
  Flame,
  LifeBuoy,
  Users2,
  Home,
  Hospital,
  AlertTriangle,
  MapPin,
  Eye,
  Activity,
  Crosshair,
  Loader2,
} from "lucide-react";

interface EmergencyMapProps {
  layersData: {
    disasters: any[];
    sos: any[];
    rescueTeams: any[];
    shelters: any[];
    hospitals: any[];
    allRescueTeams?: any[];
  } | null;
  activeLayers: {
    disasters: boolean;
    sos: boolean;
    rescue: boolean;
    shelters: boolean;
    hospitals: boolean;
  };
  filterSeverity: string;
  filterCategory: string;
  filterStatus: string;
  filterUnassignedOnly: boolean;
  isHeatmapMode: boolean;
  isReportingMode: boolean;
  onSelectEntity: (entity: { type: any; data: any }) => void;
  onReportClick: (coords: { lat: number; lng: number }) => void;
}

export function EmergencyMap({
  layersData,
  activeLayers,
  filterSeverity,
  filterCategory,
  filterStatus,
  filterUnassignedOnly,
  isHeatmapMode,
  isReportingMode,
  onSelectEntity,
  onReportClick,
}: EmergencyMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layersGroupRef = useRef<any>(null);
  const reportPinRef = useRef<any>(null);
  const userLocationPinRef = useRef<any>(null);
  const LRef = useRef<any>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [basemap, setBasemap] = useState<"dark" | "osm" | "satellite">("dark");
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(7);
  const [locatingUser, setLocatingUser] = useState(false);

  // Filtered SOS list
  const filteredSos = useMemo(() => {
    if (!layersData?.sos) return [];
    return layersData.sos.filter((s) => {
      const matchSeverity = filterSeverity === "ALL" || s.severity === filterSeverity;
      const matchCategory = filterCategory === "ALL" || s.type === filterCategory;
      const matchStatus =
        filterStatus === "ALL"
          ? true
          : filterStatus === "RESOLVED"
          ? s.status === "RESOLVED"
          : s.status !== "RESOLVED";
      const matchUnassigned = filterUnassignedOnly ? !s.assignedTeamId : true;

      return matchSeverity && matchCategory && matchStatus && matchUnassigned;
    });
  }, [layersData?.sos, filterSeverity, filterCategory, filterStatus, filterUnassignedOnly]);

  // Initialize Map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      const L = await import("leaflet");
      LRef.current = L;

      // Default center: India central coordinates (covering Mumbai, Patna, Uttarakhand)
      const map = L.map(mapContainerRef.current, {
        center: [21.5, 78.9],
        zoom: 6,
        zoomControl: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // Basemap Tile Layer
      const darkTiles = L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
          subdomains: "abcd",
        }
      );
      darkTiles.addTo(map);
      (map as any)._currentBasemap = darkTiles;

      // Layer Group for markers
      const layerGroup = L.layerGroup().addTo(map);
      layersGroupRef.current = layerGroup;

      // Listen to zoom
      map.on("zoomend", () => {
        if (isMounted) {
          setCurrentZoom(map.getZoom());
        }
      });

      // Listen to map click for Reporting Mode
      map.on("click", (e: any) => {
        const { lat, lng } = e.latlng;
        if ((map as any)._isReporting) {
          // Place temporary indicator pin
          if (reportPinRef.current) {
            map.removeLayer(reportPinRef.current);
          }

          const tempIcon = L.divIcon({
            className: "temp-report-marker",
            html: `
              <div style="position:relative; width:36px; height:36px; display:flex; align-items:center; justify-content:center;">
                <div style="position:absolute; width:36px; height:36px; border-radius:50%; background:rgba(239, 68, 68, 0.4); animation:marker-pulse 1.5s infinite;"></div>
                <div style="position:relative; width:22px; height:22px; border-radius:50%; background:#ef4444; border:2px solid #ffffff; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 10px rgba(0,0,0,0.5);">
                  <span style="color:#ffffff; font-size:12px; font-weight:bold;">📍</span>
                </div>
              </div>
            `,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
          });

          const marker = L.marker([lat, lng], { icon: tempIcon }).addTo(map);
          reportPinRef.current = marker;

          onReportClick({ lat, lng });
        }
      });
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Reporting Mode flag on map
  useEffect(() => {
    if (mapInstanceRef.current) {
      (mapInstanceRef.current as any)._isReporting = isReportingMode;
    }
  }, [isReportingMode]);

  // Update Basemap Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    const L = LRef.current;
    if (!map || !L) return;

    if (map._currentBasemap) {
      map.removeLayer(map._currentBasemap);
    }

    let newLayer: any;
    if (basemap === "dark") {
      newLayer = L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        { maxZoom: 19, subdomains: "abcd" }
      );
    } else if (basemap === "osm") {
      newLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      });
    } else {
      newLayer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 18 }
      );
    }

    newLayer.addTo(map);
    map._currentBasemap = newLayer;
  }, [basemap]);

  // Render Markers, Clusters & Heatmap
  useEffect(() => {
    const map = mapInstanceRef.current;
    const L = LRef.current;
    const group = layersGroupRef.current;
    if (!map || !L || !group) return;

    group.clearLayers();

    // 1. Disaster Incident Zones (Perimeters & Centers)
    if (activeLayers.disasters && layersData?.disasters) {
      layersData.disasters.forEach((d) => {
        if (!d.latitude || !d.longitude) return;

        // Geodesic Impact Radius Circle
        const radiusMeters = (d.affectedRadiusKm || 20) * 1000;
        const circle = L.circle([d.latitude, d.longitude], {
          radius: radiusMeters,
          color: d.severity === "CRITICAL" ? "#ef4444" : "#a855f7",
          fillColor: d.severity === "CRITICAL" ? "#ef4444" : "#a855f7",
          fillOpacity: 0.12,
          weight: 2,
          dashArray: "6, 6",
        });

        circle.on("click", () => {
          onSelectEntity({ type: "DISASTER", data: d });
        });
        circle.addTo(group);

        // Disaster Center Eye Marker
        const disasterIcon = L.divIcon({
          className: "disaster-marker",
          html: `
            <div style="display:flex; align-items:center; justify-content:center; width:34px; height:34px; border-radius:50%; background:#581c87; border:2px solid #d8b4fe; box-shadow:0 0 16px rgba(168,85,247,0.7); cursor:pointer;">
              <span style="font-size:16px;">🌪️</span>
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        });

        const marker = L.marker([d.latitude, d.longitude], { icon: disasterIcon });
        marker.on("click", () => {
          onSelectEntity({ type: "DISASTER", data: d });
        });
        marker.bindTooltip(`<b>${d.title}</b><br/>${d.severity} • Radius: ${d.affectedRadiusKm}km`, {
          direction: "top",
          className: "bg-slate-900 text-white text-xs border border-slate-700 p-1.5 rounded",
        });
        marker.addTo(group);
      });
    }

    // 2. Heatmap Density Mode
    if (isHeatmapMode && filteredSos.length > 0) {
      filteredSos.forEach((s) => {
        if (!s.latitude || !s.longitude) return;

        const weightColor =
          s.severity === "CRITICAL"
            ? "rgba(239, 68, 68, 0.45)"
            : s.severity === "HIGH"
            ? "rgba(249, 115, 22, 0.35)"
            : "rgba(234, 179, 8, 0.25)";

        const heatCircle = L.circle([s.latitude, s.longitude], {
          radius: 12000,
          color: "transparent",
          fillColor: s.severity === "CRITICAL" ? "#ef4444" : "#f97316",
          fillOpacity: 0.28,
        });
        heatCircle.addTo(group);
      });
    }

    // 3. Citizen SOS Markers with Dynamic Clustering / Separation
    if (activeLayers.sos && filteredSos.length > 0) {
      // Clustering decision based on zoom:
      // If zoom < 10, cluster nearby emergencies within 0.8 degree threshold
      if (currentZoom < 10) {
        const clusters: {
          lat: number;
          lng: number;
          items: any[];
          maxSeverity: string;
        }[] = [];

        filteredSos.forEach((s) => {
          if (!s.latitude || !s.longitude) return;

          let foundCluster = clusters.find(
            (c) => Math.hypot(c.lat - s.latitude, c.lng - s.longitude) < 0.6
          );

          if (foundCluster) {
            foundCluster.items.push(s);
            if (s.severity === "CRITICAL") foundCluster.maxSeverity = "CRITICAL";
          } else {
            clusters.push({
              lat: s.latitude,
              lng: s.longitude,
              items: [s],
              maxSeverity: s.severity,
            });
          }
        });

        clusters.forEach((cluster) => {
          if (cluster.items.length === 1) {
            renderSingleSos(cluster.items[0]);
          } else {
            const isCrit = cluster.maxSeverity === "CRITICAL";
            const clusterIcon = L.divIcon({
              className: "custom-cluster-marker",
              html: `
                <div style="width:38px; height:38px; border-radius:50%; background:${
                  isCrit ? "#991b1b" : "#c2410c"
                }; border:2px solid ${
                isCrit ? "#f87171" : "#fdba74"
              }; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(0,0,0,0.6);">
                  <span style="font-size:12px; font-weight:800; color:#ffffff;">${
                    cluster.items.length
                  }</span>
                </div>
              `,
              iconSize: [38, 38],
              iconAnchor: [19, 19],
            });

            const clusterMarker = L.marker([cluster.lat, cluster.lng], { icon: clusterIcon });
            clusterMarker.on("click", () => {
              map.setView([cluster.lat, cluster.lng], Math.min(14, currentZoom + 3));
            });
            clusterMarker.bindTooltip(
              `<b>Cluster of ${cluster.items.length} Emergencies</b><br/>Click to inspect area`,
              { direction: "top" }
            );
            clusterMarker.addTo(group);
          }
        });
      } else {
        // High zoom: display individual distinct markers at exact latitude and longitude
        // Spiderfy offset slightly if identical coordinates exist
        const coordCounts: { [key: string]: number } = {};

        filteredSos.forEach((s) => {
          if (!s.latitude || !s.longitude) return;
          const key = `${s.latitude.toFixed(4)},${s.longitude.toFixed(4)}`;
          const offsetIndex = coordCounts[key] || 0;
          coordCounts[key] = offsetIndex + 1;

          let displayLat = s.latitude;
          let displayLng = s.longitude;

          // Tiny offset if overlapping
          if (offsetIndex > 0) {
            displayLat += Math.sin(offsetIndex) * 0.0003;
            displayLng += Math.cos(offsetIndex) * 0.0003;
          }

          renderSingleSos(s, displayLat, displayLng);
        });
      }
    }

    function renderSingleSos(s: any, lat = s.latitude, lng = s.longitude) {
      const isCritical = s.severity === "CRITICAL";
      const isResolved = s.status === "RESOLVED";
      const isMedical = s.type === "MEDICAL";

      let color = "#eab308"; // Moderate
      if (isResolved) color = "#22c55e"; // Green
      else if (isCritical) color = "#ef4444"; // Red
      else if (s.severity === "HIGH") color = "#f97316"; // Orange
      else if (isMedical) color = "#3b82f6"; // Blue

      const markerHtml = `
        <div style="position:relative; width:34px; height:34px; display:flex; align-items:center; justify-content:center; cursor:pointer;">
          ${
            isCritical && !isResolved
              ? '<div class="pulsing-critical-ring" style="position:absolute; width:34px; height:34px; border-radius:50%; background:rgba(239,68,68,0.4);"></div>'
              : ""
          }
          <div style="position:relative; width:26px; height:26px; border-radius:50%; background:${color}; border:2.5px solid #ffffff; display:flex; align-items:center; justify-content:center; box-shadow:0 3px 8px rgba(0,0,0,0.6);">
            <span style="font-size:11px; font-weight:bold; color:#ffffff;">
              ${isMedical ? "✚" : isResolved ? "✓" : "!"}
            </span>
          </div>
        </div>
      `;

      const sosIcon = L.divIcon({
        className: "custom-sos-marker",
        html: markerHtml,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const marker = L.marker([lat, lng], { icon: sosIcon });
      marker.on("click", () => {
        onSelectEntity({ type: "SOS", data: s });
      });

      // Hover tooltip
      marker.bindTooltip(
        `<div style="font-size:11px; font-weight:600;">
          <div style="color:${color}; font-weight:bold;">${s.id} • ${s.type}</div>
          <div>${s.address || "Sector"}</div>
          <div style="color:#94a3b8;">${s.peopleCount || 1} people affected • ${s.status}</div>
        </div>`,
        { direction: "top", offset: [0, -10] }
      );

      marker.addTo(group);
    }

    // 4. Tactical Rescue Squad Markers
    if (activeLayers.rescue && layersData?.rescueTeams) {
      layersData.rescueTeams.forEach((team) => {
        if (!team.latitude || !team.longitude) return;

        const squadIcon = L.divIcon({
          className: "squad-marker",
          html: `
            <div style="width:28px; height:28px; border-radius:50%; background:#0891b2; border:2px solid #a5f3fc; display:flex; align-items:center; justify-content:center; box-shadow:0 3px 8px rgba(0,0,0,0.5); cursor:pointer;">
              <span style="font-size:13px; color:#ffffff;">🚒</span>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([team.latitude, team.longitude], { icon: squadIcon });
        marker.on("click", () => {
          onSelectEntity({ type: "RESCUE_TEAM", data: team });
        });
        marker.bindTooltip(`<b>${team.name}</b><br/>${team.specialization} (${team.status})`, {
          direction: "top",
        });
        marker.addTo(group);
      });
    }

    // 5. Shelter Markers
    if (activeLayers.shelters && layersData?.shelters) {
      layersData.shelters.forEach((shelter) => {
        if (!shelter.latitude || !shelter.longitude) return;

        const shelterIcon = L.divIcon({
          className: "shelter-marker",
          html: `
            <div style="width:28px; height:28px; border-radius:50%; background:#4f46e5; border:2px solid #c7d2fe; display:flex; align-items:center; justify-content:center; box-shadow:0 3px 8px rgba(0,0,0,0.5); cursor:pointer;">
              <span style="font-size:13px; color:#ffffff;">⛺</span>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([shelter.latitude, shelter.longitude], { icon: shelterIcon });
        marker.on("click", () => {
          onSelectEntity({ type: "SHELTER", data: shelter });
        });
        marker.bindTooltip(
          `<b>${shelter.name}</b><br/>Capacity: ${shelter.currentOccupancy}/${shelter.totalCapacity} (${shelter.occupancyPercent}%)`,
          { direction: "top" }
        );
        marker.addTo(group);
      });
    }

    // 6. Hospital Markers
    if (activeLayers.hospitals && layersData?.hospitals) {
      layersData.hospitals.forEach((hospital) => {
        if (!hospital.latitude || !hospital.longitude) return;

        const hospitalIcon = L.divIcon({
          className: "hospital-marker",
          html: `
            <div style="width:28px; height:28px; border-radius:50%; background:#059669; border:2px solid #a7f3d0; display:flex; align-items:center; justify-content:center; box-shadow:0 3px 8px rgba(0,0,0,0.5); cursor:pointer;">
              <span style="font-size:13px; color:#ffffff; font-weight:bold;">✚</span>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([hospital.latitude, hospital.longitude], { icon: hospitalIcon });
        marker.on("click", () => {
          onSelectEntity({ type: "HOSPITAL", data: hospital });
        });
        marker.bindTooltip(
          `<b>${hospital.name}</b><br/>Beds: ${hospital.availableBeds} | ICU: ${hospital.availableIcu}`,
          { direction: "top" }
        );
        marker.addTo(group);
      });
    }
  }, [layersData, activeLayers, filteredSos, currentZoom, isHeatmapMode]);

  // Fullscreen Handler
  function toggleFullscreen() {
    if (!mapContainerRef.current) return;
    if (!document.fullscreenElement) {
      mapContainerRef.current.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  }

  // Geolocation Handler
  function handleLocateMe() {
    if (!navigator.geolocation || !mapInstanceRef.current || !LRef.current) {
      alert("Geolocation is not supported or permission denied.");
      return;
    }

    setLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const map = mapInstanceRef.current;
        const L = LRef.current;

        if (userLocationPinRef.current) {
          map.removeLayer(userLocationPinRef.current);
        }

        const userPinGroup = L.layerGroup();

        // Accuracy Circle
        L.circle([latitude, longitude], {
          radius: accuracy,
          color: "#0ea5e9",
          fillColor: "#0ea5e9",
          fillOpacity: 0.15,
        }).addTo(userPinGroup);

        // User Marker
        const userIcon = L.divIcon({
          html: `
            <div style="width:20px; height:20px; border-radius:50%; background:#0284c7; border:3px solid #ffffff; box-shadow:0 0 10px rgba(14,165,233,0.8);"></div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        L.marker([latitude, longitude], { icon: userIcon }).addTo(userPinGroup);
        userPinGroup.addTo(map);
        userLocationPinRef.current = userPinGroup;

        map.flyTo([latitude, longitude], 15, { duration: 1.5 });
        setLocatingUser(false);
      },
      (err) => {
        console.error("Location lookup error:", err);
        setLocatingUser(false);
        alert("Could not access your location. Please check browser permissions.");
      },
      { timeout: 8000 }
    );
  }

  // Address Geocode Search
  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Check if user entered direct coordinates like "19.076, 72.877"
    const coordMatch = searchQuery.match(/^(-?\d+(\.\d+)?)[,\s]+(-?\d+(\.\d+)?)$/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[3]);
      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        mapInstanceRef.current?.flyTo([lat, lng], 15);
        setSearchQuery("");
        return;
      }
    }

    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=5`,
        { headers: { "Accept-Language": "en" } }
      );
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
        setIsSearchOpen(true);
      }
    } catch {
      alert("Search failed or offline. Try entering coordinates directly (e.g. 19.076, 72.877).");
    } finally {
      setSearching(false);
    }
  }

  function handleSelectSearchResult(item: any) {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    if (!isNaN(lat) && !isNaN(lon)) {
      mapInstanceRef.current?.flyTo([lat, lon], 15);
      setIsSearchOpen(false);
      setSearchQuery(item.display_name.split(",")[0]);
    }
  }

  return (
    <div
      ref={mapContainerRef}
      className={`relative w-full h-full min-h-[500px] overflow-hidden ${
        isReportingMode ? "cursor-crosshair" : ""
      }`}
    >
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pointer-events-none">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md pointer-events-auto">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search address, landmark, or GPS (e.g. Mahim, Patna, 19.08, 72.88)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-20 py-2.5 rounded-xl bg-slate-900/95 backdrop-blur border border-slate-800 text-white placeholder:text-slate-400 text-xs shadow-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              disabled={searching}
              className="absolute right-2 top-1.5 px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-semibold transition flex items-center gap-1"
            >
              {searching ? <Loader2 className="h-3 w-3 animate-spin" /> : "Fly"}
            </button>
          </form>

          {/* Search Dropdown */}
          {isSearchOpen && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 mt-1.5 bg-slate-900/98 backdrop-blur border border-slate-800 rounded-xl shadow-2xl overflow-hidden divide-y divide-slate-800 text-xs">
              {searchResults.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSearchResult(item)}
                  className="w-full p-2.5 text-left hover:bg-slate-800 text-slate-200 transition flex items-start gap-2"
                >
                  <MapPin className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                  <span className="truncate">{item.display_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Map Controls (Basemap Switcher, Fullscreen, Locate Me, Zoom) */}
        <div className="flex items-center gap-2 pointer-events-auto shrink-0 self-end sm:self-auto">
          {/* Basemap Switcher */}
          <div className="p-1 rounded-xl bg-slate-900/95 backdrop-blur border border-slate-800 flex items-center gap-1 text-[11px] shadow-lg">
            <button
              onClick={() => setBasemap("dark")}
              className={`px-2 py-1 rounded-lg font-semibold transition ${
                basemap === "dark"
                  ? "bg-sky-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Tactical Dark
            </button>
            <button
              onClick={() => setBasemap("osm")}
              className={`px-2 py-1 rounded-lg font-semibold transition ${
                basemap === "osm"
                  ? "bg-sky-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Streets
            </button>
            <button
              onClick={() => setBasemap("satellite")}
              className={`px-2 py-1 rounded-lg font-semibold transition ${
                basemap === "satellite"
                  ? "bg-sky-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Satellite
            </button>
          </div>

          {/* Locate Me */}
          <button
            onClick={handleLocateMe}
            disabled={locatingUser}
            title="Center on My GPS Location"
            className="h-9 w-9 rounded-xl bg-slate-900/95 backdrop-blur border border-slate-800 hover:bg-slate-800 text-slate-200 hover:text-sky-400 flex items-center justify-center transition shadow-lg"
          >
            {locatingUser ? (
              <Loader2 className="h-4 w-4 animate-spin text-sky-400" />
            ) : (
              <Compass className="h-4 w-4" />
            )}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="h-9 w-9 rounded-xl bg-slate-900/95 backdrop-blur border border-slate-800 hover:bg-slate-800 text-slate-200 hover:text-white flex items-center justify-center transition shadow-lg"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>

          {/* Zoom Buttons */}
          <div className="flex flex-col bg-slate-900/95 backdrop-blur border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <button
              onClick={() => mapInstanceRef.current?.zoomIn()}
              className="h-8 w-8 text-slate-300 hover:text-white hover:bg-slate-800 flex items-center justify-center transition"
            >
              <Plus className="h-4 w-4" />
            </button>
            <div className="h-[1px] bg-slate-800" />
            <button
              onClick={() => mapInstanceRef.current?.zoomOut()}
              className="h-8 w-8 text-slate-300 hover:text-white hover:bg-slate-800 flex items-center justify-center transition"
            >
              <Minus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Reporting Mode Alert Banner on Map */}
      {isReportingMode && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] bg-red-600/95 text-white px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-pulse pointer-events-auto">
          <Crosshair className="h-4 w-4" />
          <span>Click anywhere on the map to pinpoint and dispatch an emergency</span>
        </div>
      )}
    </div>
  );
}
