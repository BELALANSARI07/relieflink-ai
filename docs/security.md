# ReliefLink — Security, Privacy & Safety Architecture

## 1. Core Threat Model

ReliefLink handles high-stakes operational disaster data and personal records of vulnerable citizens. Our security model addresses the following threat vectors:

1. **Vulnerable Citizen Location Exposure**: Publicizing exact residential addresses or GPS points during a flood or riot can expose trapped families to looting or harassment.
2. **Fraudulent Emergency Reports**: Malicious actors broadcasting fake crises to divert rescue squads away from real emergencies.
3. **Impersonation & Malicious NGO Accounts**: Fake relief organizations claiming relief funds or diverting supplies.
4. **Cross-Organization Data Leakage**: Sensitive military or police rescue coordinates leaking across unvetted volunteer tiers.
5. **Network Interruption & Man-in-the-Middle Attacks**: Tainted offline queued synchronization requests.

---

## 2. Privacy & PII Protection Policies

### A. Two-Tier Geospatial Coordinate Obfuscation
- **Public & Civilian Map Tier**: Exact coordinates of trapped citizens are *never* returned to unauthenticated or public API queries. Coordinates are rounded/jittered to a 1 km randomized centroid.
- **Authorized Responder Tier**: Only government authorities, assigned tactical rescue teams, and verified NGOs assigned to that specific SOS record can view high-precision sub-meter coordinates.

### B. Role-Based Access Control (RBAC) Matrix

| Entity / Resource | Citizen | Verified NGO | Tactical Rescue Squad | Government Authority | Super Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| Submit SOS | ✅ | ❌ | ❌ | ✅ | ✅ |
| View Own SOS Status | ✅ | ❌ | ❌ | ✅ | ✅ |
| View Public Shelters/Alerts | ✅ | ✅ | ✅ | ✅ | ✅ |
| Access Precise Citizen GPS | ❌ | ✅ (Assigned only) | ✅ (Assigned only) | ✅ | ✅ |
| Update Delivery Workflow | ❌ | ✅ | ❌ | ✅ | ✅ |
| Execute Field Mission Status | ❌ | ❌ | ✅ | ✅ | ✅ |
| View Population Exposure Intelligence | ❌ | ❌ | ❌ | ✅ | ✅ |
| Declare Disaster Event | ❌ | ❌ | ❌ | ✅ | ✅ |
| Overwrite Audit Logs | ❌ | ❌ | ❌ | ❌ | ❌ (Immutable) |

---

## 3. Data Integrity & Verification Safeguards

- **AI Triage Guardrails**: AI algorithms may prioritize and classify emergencies, but *never* possess autonomous authority to dismiss or reject a distress call without human sign-off.
- **Idempotent Delivery Transactions**: All delivery status updates require an idempotency key (`id + timestamp + sequence`) to guarantee duplicate network requests in poor connectivity cannot consume inventory twice.
- **Audit Logging**: Every mission status transition, squad reassignment, and administrative override is logged with user UUID, IP, and timestamp into an immutable audit table.
