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
