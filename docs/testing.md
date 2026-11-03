# ReliefLink — Testing & Verification Strategy

## 1. Testing Pyramid

To ensure absolute reliability during real-world crises, ReliefLink enforces automated verification across 5 testing dimensions:

```
          / \
         / E2E \       End-to-End Workflow Verification
        /-------\      (Report -> Verify -> Assign -> Deliver)
       /  Integ  \     API & Database Integration Tests
      /-----------\    (Transactions, Idempotency, Conflict Locks)
     /  Geospatial \   Spatial Calculations & Boundary Intersections
    /---------------\  (Planetary Bounds, PostGIS Distance, Clustering)
   /   Unit Tests    \ AI Heuristics, Scoring Engines & Transformers
  /-------------------\
```

---

## 2. Test Suites Summary

### 1. Functional Tests
- Citizen emergency reporting via Civilian Portal.
- Emergency status transition through the 7-stage delivery state machine:
  `REQUESTED → VERIFIED → ASSIGNED → ACCEPTED → DISPATCHED → DELIVERED → CONFIRMED`.
- NGO warehouse inventory updates and reservation hold.
- Rescue team on-scene arrival confirmation and mission completion.

### 2. Geospatial Tests
- Exact coordinates boundary validation (-90 to 90 latitude, -180 to 180 longitude).
- Distance threshold algorithms for duplicate SOS detection (600m radius).
- Marker clustering at low zoom levels (< 10) vs street-level marker separation (>= 10).
- Population density grid intersection (WorldPop/Census calculations).

### 3. Reliability & Offline Tests
- Offline action queuing in browser local storage when `navigator.onLine` is false.
- Automatic queue flush and synchronization upon network reconnection.
- Idempotent API protection preventing duplicate submissions.

### 4. UI & Theming Tests
- Verification of **Peach & Cream light theme** on Citizen Portal (`/citizen`) and NGO Portal (`/ngo`).
- Verification of **Deep Navy & Cyan dark theme** on Authority Portal (`/authority`) and Field Rescue Portal (`/field`).

---

## 3. Automated Test Execution
Run the complete automated test suite locally:
```bash
npm test
# Equivalent to: node --test tests/platform.test.mjs
```
