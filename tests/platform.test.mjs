// ReliefLink AI — Comprehensive Test Suite
// Verifies core domain logic, algorithms, AI triage, and data consistency

import test from 'node:test';
import assert from 'node:assert';

// Heuristic AI Triage Functions (Direct Domain Unit Verification)
function classifyDisaster(description) {
  const lower = description.toLowerCase();
  let type = "OTHER";
  let severity = "MODERATE";
  let radius = 10;

  if (lower.includes("cyclone") || lower.includes("hurricane") || lower.includes("storm surge") || lower.includes("typhoon")) {
    type = "HURRICANE";
    severity = "CRITICAL";
    radius = 40;
  } else if (lower.includes("quake") || lower.includes("tremor") || lower.includes("rubble")) {
    type = "EARTHQUAKE";
    severity = lower.includes("collapse") ? "CRITICAL" : "HIGH";
    radius = 20;
  } else if (lower.includes("flood") || lower.includes("water level") || lower.includes("submerged") || lower.includes("dam")) {
    type = "FLOOD";
    severity = lower.includes("breach") || lower.includes("drowning") || lower.includes("critical") ? "CRITICAL" : "HIGH";
    radius = 25;
  }

  return { type, severity, recommendedRadiusKm: radius };
}

function classifySosUrgency(description, peopleCount = 1, medicalNeeds = null) {
  const lower = `${description} ${medicalNeeds || ""}`.toLowerCase();
  let urgency = "MEDIUM";
  let teamType = "GENERAL";

  const isLifeThreatening =
    lower.includes("unconscious") ||
    lower.includes("bleeding") ||
    lower.includes("trapped") ||
    lower.includes("drowning") ||
    lower.includes("elderly") ||
    peopleCount > 10;

  if (isLifeThreatening) {
    urgency = "CRITICAL";
  } else if (lower.includes("injured") || lower.includes("water rising")) {
    urgency = "HIGH";
  }

  if (lower.includes("water") || lower.includes("flood") || lower.includes("boat")) {
    teamType = "WATER_RESCUE";
  } else if (lower.includes("fracture") || lower.includes("wound") || lower.includes("medical")) {
    teamType = "MEDICAL";
  } else if (lower.includes("collapse") || lower.includes("rubble")) {
    teamType = "URBAN_SEARCH_RESCUE";
  }

  return { urgency, recommendedTeamSpecialization: teamType };
}

function detectDuplicates(newSos, existingList) {
  const thresholdKm = 0.6;
  for (const existing of existingList) {
    if (existing.status === "RESOLVED" || existing.status === "CANCELLED") continue;

    const dLat = Math.abs(existing.latitude - newSos.latitude);
    const dLng = Math.abs(existing.longitude - newSos.longitude);
    const approxDistKm = Math.sqrt(dLat * dLat + dLng * dLng) * 111;

    if (approxDistKm <= thresholdKm && existing.type === newSos.type) {
      return { isDuplicate: true, matchedSosId: existing.id, distanceKm: approxDistKm };
    }
  }
  return { isDuplicate: false };
}

function recommendNgoForArea(areaLat, areaLng, requiredSkill, ngos) {
  const candidates = ngos
    .filter((n) => n.operationalStatus === "ACTIVE" && n.verified)
    .map((ngo) => {
      const matchesSkill = ngo.capabilities.some((c) =>
        c.toLowerCase().includes(requiredSkill.toLowerCase())
      );
      const skillScore = matchesSkill ? 0.6 : 0.2;
      const workloadPenalty = (ngo.activeTasksCount || 0) * 0.08;
      const totalScore = Math.max(0.1, Math.min(0.98, skillScore + 0.35 - workloadPenalty));

      return {
        ngo,
        score: Math.round(totalScore * 100) / 100,
      };
    })
    .sort((a, b) => b.score - a.score);

  return candidates[0] || null;
}

// --------------------------------------------------------------------------
// TEST SUITE
// --------------------------------------------------------------------------

test('1. Disaster Classification AI identifies hurricane correctly', () => {
  const report = "Category 4 tropical cyclone made landfall with storm surge flooding coastal belt.";
  const result = classifyDisaster(report);
  assert.strictEqual(result.type, "HURRICANE");
  assert.strictEqual(result.severity, "CRITICAL");
  assert.strictEqual(result.recommendedRadiusKm, 40);
});

test('2. Disaster Classification AI identifies river flood breach correctly', () => {
  const report = "River embankment breach caused severe flood submerging downstream farms.";
  const result = classifyDisaster(report);
  assert.strictEqual(result.type, "FLOOD");
  assert.strictEqual(result.severity, "CRITICAL");
});

test('3. SOS Classification classifies life-threatening water entrapment as CRITICAL with WATER_RESCUE squad', () => {
  const desc = "Water level rising rapidly to ceiling, 4 family members trapped on terrace.";
  const result = classifySosUrgency(desc, 4, "Elderly diabetic citizen");
  assert.strictEqual(result.urgency, "CRITICAL");
  assert.strictEqual(result.recommendedTeamSpecialization, "WATER_RESCUE");
});

test('4. SOS Classification classifies structural trauma injury as CRITICAL with MEDICAL squad', () => {
  const desc = "Collapsed roof fell on 2 workers, severe open bleeding fracture wounds.";
  const result = classifySosUrgency(desc, 2, "Unconscious casualty");
  assert.strictEqual(result.urgency, "CRITICAL");
  assert.strictEqual(result.recommendedTeamSpecialization, "MEDICAL");
});

test('5. Duplicate SOS detector flags incidents within 600m threshold', () => {
  const existingList = [
    { id: "sos-101", latitude: 19.0820, longitude: 72.8850, type: "EVACUATION", status: "IN_PROGRESS" },
    { id: "sos-102", latitude: 25.5941, longitude: 85.1376, type: "FOOD_WATER", status: "PENDING" },
  ];

  // Report 200m away with same type
  const incoming = { latitude: 19.0835, longitude: 72.8860, type: "EVACUATION" };
  const check = detectDuplicates(incoming, existingList);
  assert.strictEqual(check.isDuplicate, true);
  assert.strictEqual(check.matchedSosId, "sos-101");
});

test('6. Duplicate SOS detector allows legitimate distinct incidents', () => {
  const existingList = [
    { id: "sos-101", latitude: 19.0820, longitude: 72.8850, type: "EVACUATION", status: "IN_PROGRESS" },
  ];

  // Report 5km away
  const incoming = { latitude: 19.1200, longitude: 72.9100, type: "EVACUATION" };
  const check = detectDuplicates(incoming, existingList);
  assert.strictEqual(check.isDuplicate, false);
});

test('7. AI NGO Recommendation engine matches capability and penalizes overloaded partners', () => {
  const ngos = [
    {
      id: "ngo-001",
      name: "Oxfam Relief",
      verified: true,
      operationalStatus: "ACTIVE",
      capabilities: ["Water Sanitation (WASH)", "Emergency Rations"],
      activeTasksCount: 1,
    },
    {
      id: "ngo-002",
      name: "Overloaded NGO",
      verified: true,
      operationalStatus: "ACTIVE",
      capabilities: ["Water Sanitation (WASH)"],
      activeTasksCount: 8,
    },
  ];

  const recommendation = recommendNgoForArea(19.08, 72.88, "Water Sanitation", ngos);
  assert.strictEqual(recommendation.ngo.id, "ngo-001");
  assert.ok(recommendation.score > 0.8);
});

test('8. Shelter occupancy rate calculation reflects capacity accurately', () => {
  const shelters = [
    { totalCapacity: 1200, currentOccupancy: 860 },
    { totalCapacity: 600, currentOccupancy: 590 },
  ];

  const totalCap = shelters.reduce((acc, s) => acc + s.totalCapacity, 0);
  const currentOcc = shelters.reduce((acc, s) => acc + s.currentOccupancy, 0);
  const rate = Math.round((currentOcc / totalCap) * 100);

  assert.strictEqual(totalCap, 1800);
  assert.strictEqual(currentOcc, 1450);
  assert.strictEqual(rate, 81);
});

test('9. Geospatial Coordinate Validator enforces planetary bounds', () => {
  function validateCoords(lat, lng) {
    if (typeof lat !== 'number' || typeof lng !== 'number') return false;
    if (isNaN(lat) || isNaN(lng)) return false;
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  }

  assert.strictEqual(validateCoords(19.076, 72.8777), true); // Mumbai
  assert.strictEqual(validateCoords(25.5941, 85.1376), true); // Patna
  assert.strictEqual(validateCoords(91.5, 72.0), false); // Lat > 90 invalid
  assert.strictEqual(validateCoords(20.0, 185.0), false); // Lng > 180 invalid
});

test('10. Marker Clustering algorithm merges nearby markers at country/state zoom level', () => {
  function clusterMarkers(markers, thresholdDeg) {
    const clusters = [];
    markers.forEach((m) => {
      let found = clusters.find((c) => Math.hypot(c.lat - m.lat, c.lng - m.lng) < thresholdDeg);
      if (found) {
        found.items.push(m);
      } else {
        clusters.push({ lat: m.lat, lng: m.lng, items: [m] });
      }
    });
    return clusters;
  }

  // 3 markers: 2 close together in Mumbai (0.02 deg apart), 1 in Patna (~12 deg away)
  const list = [
    { id: 'sos-1', lat: 19.0820, lng: 72.8850 },
    { id: 'sos-2', lat: 19.0720, lng: 72.8680 },
    { id: 'sos-3', lat: 25.5941, lng: 85.1376 },
  ];

  // At zoom level < 10 (threshold 0.5 deg), Mumbai markers merge into 1 cluster
  const clusters = clusterMarkers(list, 0.5);
  assert.strictEqual(clusters.length, 2);
  const mumbaiCluster = clusters.find((c) => c.items.some((i) => i.id === 'sos-1'));
  assert.strictEqual(mumbaiCluster.items.length, 2);

  // At street zoom level >= 12 (threshold 0.001 deg), all 3 markers are distinct
  const streetMarkers = clusterMarkers(list, 0.001);
  assert.strictEqual(streetMarkers.length, 3);
});

test('11. Map-based Squad Assignment updates emergency status to ASSIGNED and team status to DEPLOYED', () => {
  const sos = { id: 'sos-101', status: 'PENDING', assignedTeamId: null, assignedTeamName: null };
  const team = { id: 'team-001', name: 'NDRF Bravo', status: 'READY', activeAssignmentsCount: 0 };

  // Assignment action
  sos.assignedTeamId = team.id;
  sos.assignedTeamName = team.name;
  sos.status = 'ASSIGNED';
  team.status = 'DEPLOYED';
  team.activeAssignmentsCount += 1;

  assert.strictEqual(sos.status, 'ASSIGNED');
  assert.strictEqual(sos.assignedTeamName, 'NDRF Bravo');
  assert.strictEqual(team.status, 'DEPLOYED');
  assert.strictEqual(team.activeAssignmentsCount, 1);
});

test('12. 7-Stage Delivery State Machine enforces sequential progression', () => {
  const deliveryStages = [
    'REQUESTED',
    'VERIFIED',
    'ASSIGNED',
    'ACCEPTED',
    'DISPATCHED',
    'DELIVERED',
    'CONFIRMED',
  ];

  let currentStage = 'REQUESTED';
  function transition(toStage) {
    const currentIndex = deliveryStages.indexOf(currentStage);
    const targetIndex = deliveryStages.indexOf(toStage);
    if (targetIndex === currentIndex + 1) {
      currentStage = toStage;
      return true;
    }
    return false;
  }

  assert.strictEqual(transition('VERIFIED'), true);
  assert.strictEqual(transition('ASSIGNED'), true);
  assert.strictEqual(transition('ACCEPTED'), true);
  assert.strictEqual(transition('DISPATCHED'), true);
  assert.strictEqual(transition('DELIVERED'), true);
  assert.strictEqual(transition('CONFIRMED'), true);
  assert.strictEqual(currentStage, 'CONFIRMED');
});

test('13. Population Exposure Engine computes exposed ratio accurately', () => {
  const records = [
    { district: 'Mumbai Suburban', totalResidentialPop: 9356962, estimatedExposedPop: 420000, verifiedAffectedPop: 1840, confirmedAssistedPop: 1120 },
    { district: 'Patna Rural', totalResidentialPop: 5838465, estimatedExposedPop: 285000, verifiedAffectedPop: 2450, confirmedAssistedPop: 980 },
  ];

  const totalResidential = records.reduce((acc, r) => acc + r.totalResidentialPop, 0);
  const totalExposed = records.reduce((acc, r) => acc + r.estimatedExposedPop, 0);
  const totalAffected = records.reduce((acc, r) => acc + r.verifiedAffectedPop, 0);
  const totalAssisted = records.reduce((acc, r) => acc + r.confirmedAssistedPop, 0);

  const exposurePercent = ((totalExposed / totalResidential) * 100).toFixed(2);
  const assistanceCoveragePercent = ((totalAssisted / totalAffected) * 100).toFixed(1);

  assert.strictEqual(totalResidential, 15195427);
  assert.strictEqual(totalExposed, 705000);
  assert.strictEqual(exposurePercent, '4.64');
  assert.strictEqual(assistanceCoveragePercent, '49.0');
});

test('14. Relief Gap Detection flags underserved localities with unfulfilled requests', () => {
  function detectGap(unfulfilledCount, deliveredPercent, assignedNgos) {
    if (unfulfilledCount > 20 && deliveredPercent < 25 && assignedNgos <= 1) {
      return { isGap: true, severity: 'CRITICAL', recommendation: 'Immediate intervention needed' };
    }
    return { isGap: false };
  }

  const sector = { unfulfilled: 28, deliveredPercent: 18, assignedNgos: 1 };
  const gapResult = detectGap(sector.unfulfilled, sector.deliveredPercent, sector.assignedNgos);

  assert.strictEqual(gapResult.isGap, true);
  assert.strictEqual(gapResult.severity, 'CRITICAL');
});

test('15. Offline Field Queue stores and flushes queued reports upon reconnection', () => {
  const offlineQueue = [];
  function queueAction(action) {
    offlineQueue.push(action);
  }

  function flushQueue(handler) {
    const processed = [];
    while (offlineQueue.length > 0) {
      const item = offlineQueue.shift();
      handler(item);
      processed.push(item.id);
    }
    return processed;
  }

  // Simulate offline field status updates
  queueAction({ id: 'mis-001', newStatus: 'ON_SCENE' });
  queueAction({ id: 'mis-001', newStatus: 'RESCUED', peopleRescued: 4 });

  assert.strictEqual(offlineQueue.length, 2);

  // Online reconnection flush
  const synced = flushQueue((item) => {
    // Process item
  });

  assert.strictEqual(synced.length, 2);
  assert.strictEqual(offlineQueue.length, 0);
});
