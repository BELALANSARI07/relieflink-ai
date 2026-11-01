# ReliefLink AI — Complete REST API Specification

> **Version:** 1.0  
> **Base URL:** `/api`  
> **Content-Type:** `application/json`  
> **Auth Header:** `Authorization: Bearer <token>` or HTTP-Only Session Cookie  

---

## 1. Global Standards & Conventions

### Response Envelope Format
All successful responses return:
```typescript
interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}
```

All error responses return:
```typescript
interface ApiError {
  success: false;
  error: {
    code: string;       // e.g. "NOT_FOUND", "UNAUTHORIZED", "VALIDATION_ERROR"
    message: string;    // Human-readable message
    details?: any;      // Validation field errors or debug info
  };
}
```

### Common HTTP Status Codes
- `200 OK` — Successful retrieval or update
- `201 Created` — Successful resource creation
- `400 Bad Request` — Validation error or malformed payload
- `401 Unauthorized` — Missing or invalid authentication token
- `403 Forbidden` — Insufficient role permissions
- `404 Not Found` — Resource does not exist
- `409 Conflict` — Duplicate key or state conflict
- `422 Unprocessable Entity` — Semantic validation failure
- `500 Internal Server Error` — Server exception

---

## 2. Authentication & Authorization (`/api/auth`)

### 2.1 Register User
- **Method / Path:** `POST /api/auth/register`
- **Access:** Public
- **Request Body:**
```typescript
interface RegisterRequest {
  email: string;        // Valid email
  password: string;     // Min 8 characters
  fullName: string;
  phone?: string;
  role?: 'CITIZEN' | 'VOLUNTEER'; // Default: CITIZEN
}
```
- **Response `201`:**
```typescript
{
  success: true,
  data: {
    user: {
      id: string,
      email: string,
      fullName: string,
      roles: string[],
      isVerified: boolean
    },
    token: string
  }
}
```

### 2.2 Login User
- **Method / Path:** `POST /api/auth/login`
- **Access:** Public
- **Request Body:**
```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```
- **Response `200`:**
```typescript
{
  success: true,
  data: {
    user: {
      id: string,
      email: string,
      fullName: string,
      roles: string[]
    },
    token: string
  }
}
```

### 2.3 Get Current User Session
- **Method / Path:** `GET /api/auth/me`
- **Access:** Authenticated
- **Response `200`:** User profile with current active roles and permissions.

### 2.4 Logout
- **Method / Path:** `POST /api/auth/logout`
- **Access:** Authenticated
- **Response `200`:** Clears session cookie and invalidates refresh token.

---

## 3. Disasters Module (`/api/disasters`)

### 3.1 List Disasters
- **Method / Path:** `GET /api/disasters`
- **Access:** Public (all authenticated or guest)
- **Query Parameters:**
  - `page?: number` (default: 1)
  - `limit?: number` (default: 20)
  - `status?: 'REPORTED' | 'VERIFIED' | 'ACTIVE' | 'CONTAINED' | 'RESOLVED' | 'CLOSED'`
  - `type?: 'EARTHQUAKE' | 'FLOOD' | 'HURRICANE' | 'WILDFIRE' | ...`
  - `severity?: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' | 'CATASTROPHIC'`
  - `lat?: number`, `lng?: number`, `radius?: number` (geospatial filter in km)
- **Response `200`:** Paginated array of Disaster records.

### 3.2 Create Disaster Event
- **Method / Path:** `POST /api/disasters`
- **Access:** `GOVERNMENT_AUTHORITY`, `SUPER_ADMIN`
- **Request Body:**
```typescript
interface CreateDisasterRequest {
  title: string;
  description: string;
  type: 'EARTHQUAKE' | 'FLOOD' | 'HURRICANE' | 'WILDFIRE' | 'TSUNAMI' | 'LANDSLIDE' | 'DROUGHT' | 'PANDEMIC' | 'INDUSTRIAL_ACCIDENT' | 'OTHER';
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' | 'CATASTROPHIC';
  latitude: number;
  longitude: number;
  address?: string;
  affectedRadiusKm?: number;
  metadata?: Record<string, any>;
}
```
- **Response `201`:** Created Disaster entity.

### 3.3 Get Disaster Details
- **Method / Path:** `GET /api/disasters/:id`
- **Access:** Public / Authenticated
- **Response `200`:** Complete Disaster entity including updates, SOS counts, assigned NGOs, and response metrics.

### 3.4 Update Disaster
- **Method / Path:** `PATCH /api/disasters/:id`
- **Access:** `GOVERNMENT_AUTHORITY`, `SUPER_ADMIN`
- **Request Body:** Partial `<CreateDisasterRequest>` with optional `status`.
- **Response `200`:** Updated Disaster entity.

### 3.5 Post Disaster Update / Bulletin
- **Method / Path:** `POST /api/disasters/:id/updates`
- **Access:** `GOVERNMENT_AUTHORITY`, `SUPER_ADMIN`, `NGO_ADMIN`
- **Request Body:**
```typescript
interface PostUpdateRequest {
  updateText: string;
  severityChange?: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' | 'CATASTROPHIC';
  metadata?: Record<string, any>;
}
```
- **Response `201`:** Created DisasterUpdate item and broadcasts SSE notification.

---

## 4. SOS & Emergency Rescue (`/api/sos`)

### 4.1 Citizen SOS Submission
- **Method / Path:** `POST /api/sos`
- **Access:** Any authenticated user or anonymous with emergency bypass
- **Request Body:**
```typescript
interface CreateSosRequest {
  disasterId?: string;
  type: 'MEDICAL' | 'RESCUE' | 'EVACUATION' | 'FOOD_WATER' | 'SHELTER' | 'MISSING_PERSON' | 'OTHER';
  description: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  latitude: number;
  longitude: number;
  address?: string;
  contactPhone?: string;
  peopleCount?: number;
  medicalNeeds?: string;
}
```
- **Response `201`:**
```typescript
{
  success: true,
  data: {
    id: string,
    status: "PENDING",
    trackingCode: string,
    createdAt: string
  }
}
```

### 4.2 List SOS Requests (Triage Feed)
- **Method / Path:** `GET /api/sos`
- **Access:** `GOVERNMENT_AUTHORITY`, `RESCUE_TEAM`, `NGO_ADMIN`, `SUPER_ADMIN`
- **Query Parameters:** `status`, `severity`, `type`, `disasterId`, `lat`, `lng`, `radius`, `page`, `limit`
- **Response `200`:** Paginated SOS list with distance and duplicate tags.

### 4.3 Get My SOS Requests
- **Method / Path:** `GET /api/sos/my-requests`
- **Access:** Authenticated Citizen
- **Response `200`:** User's active and resolved SOS requests with assignment status.

### 4.4 Update SOS Status
- **Method / Path:** `PATCH /api/sos/:id/status`
- **Access:** `RESCUE_TEAM`, `GOVERNMENT_AUTHORITY`, `SUPER_ADMIN`
- **Request Body:** `{ status: 'ACKNOWLEDGED' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CANCELLED' }`
- **Response `200`:** Updated SOS record.

### 4.5 Assign SOS to Rescue Team
- **Method / Path:** `POST /api/sos/:id/assign`
- **Access:** `GOVERNMENT_AUTHORITY`, `SUPER_ADMIN`
- **Request Body:** `{ rescueTeamId: string; priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'; notes?: string }`
- **Response `200`:** Created RescueAssignment.

---

## 5. Rescue Teams (`/api/rescue-teams`)

### 5.1 List Rescue Teams
- **Method / Path:** `GET /api/rescue-teams`
- **Access:** Authenticated
- **Query Parameters:** `status`, `specialization`
- **Response `200`:** Array of RescueTeams with member count and current coordinates.

### 5.2 Create Rescue Team
- **Method / Path:** `POST /api/rescue-teams`
- **Access:** `GOVERNMENT_AUTHORITY`, `SUPER_ADMIN`
- **Request Body:**
```typescript
interface CreateRescueTeamRequest {
  name: string;
  leaderId?: string;
  capacity?: number;
  specialization: 'URBAN_SEARCH_RESCUE' | 'WATER_RESCUE' | 'MOUNTAIN_RESCUE' | 'MEDICAL' | 'HAZMAT' | 'K9_UNIT' | 'AERIAL' | 'GENERAL';
  contactNumber?: string;
  equipment?: string[];
}
```
- **Response `201`:** Created RescueTeam.

### 5.3 Update Rescue Team Location & Status
- **Method / Path:** `PATCH /api/rescue-teams/:id/status`
- **Access:** Team Leader or `GOVERNMENT_AUTHORITY`
- **Request Body:** `{ status?: RescueTeamStatus; latitude?: number; longitude?: number }`
- **Response `200`:** Updated team status.

---

## 6. NGO & Relief Coordination (`/api/ngos`)

### 6.1 Register NGO
- **Method / Path:** `POST /api/ngos`
- **Access:** Authenticated User
- **Request Body:**
```typescript
interface RegisterNgoRequest {
  name: string;
  registrationNumber: string;
  description?: string;
  capabilities: string[];
  contactEmail: string;
  contactPhone: string;
  address?: string;
  website?: string;
  verificationDocUrl?: string;
}
```
- **Response `201`:** Registered NGO awaiting verification.

### 6.2 Verify NGO
- **Method / Path:** `POST /api/ngos/:id/verify`
- **Access:** `GOVERNMENT_AUTHORITY`, `SUPER_ADMIN`
- **Request Body:** `{ verified: boolean; operationalStatus: 'ACTIVE' | 'REJECTED' }`
- **Response `200`:** Updated NGO status.

### 6.3 Manage Operational Areas
- **Method / Path:** `POST /api/ngos/:id/operational-areas`
- **Access:** NGO Admin or `GOVERNMENT_AUTHORITY`
- **Request Body:** `{ areaName: string; coordinates: GeoJSON; latitude?: number; longitude?: number; radiusKm?: number }`
- **Response `201`:** Created area coverage record.

### 6.4 Relief Tasks Management (`/api/relief-tasks`)
- `GET /api/relief-tasks` — List tasks with filters (`disasterId`, `ngoId`, `status`)
- `POST /api/relief-tasks` — Create task assignment
- `PATCH /api/relief-tasks/:id` — Update task status / completion
- `POST /api/relief-tasks/:id/activities` — NGO submits activity log with beneficiaries and supplies used

---

## 7. Resources Management (`/api/resources`)

### 7.1 Inventory CRUD
- `GET /api/resources` — List inventory with category and location filters
- `POST /api/resources` — Add resource batch (Owner: Government/NGO/Hospital)
- `PATCH /api/resources/:id` — Update stock levels or location

### 7.2 Resource Requests & Allocations
- `POST /api/resource-requests` — Organization requests emergency supplies
- `GET /api/resource-requests` — Triage queue for logistics dispatch
- `POST /api/resource-allocations` — Fulfill request with dispatched inventory batches

---

## 8. Shelters & Hospitals (`/api/shelters`, `/api/hospitals`)

### 8.1 Shelters API
- `GET /api/shelters` — List shelters with capacity and distance search
- `POST /api/shelters` — Register shelter
- `PATCH /api/shelters/:id` — Update status and facilities
- `POST /api/shelters/:id/updates` — Real-time occupancy update (+/- headcount)

### 8.2 Hospitals API
- `GET /api/hospitals` — List hospitals with bed/ICU availability
- `POST /api/hospitals` — Register medical facility
- `POST /api/hospitals/:id/updates` — Real-time bed and ICU availability count

---

## 9. Interactive Map Data API (`/api/map`)

### 9.1 Unified Map Layers
- **Method / Path:** `GET /api/map/layers`
- **Access:** Public / Authenticated
- **Query Parameters:** `bbox=minLng,minLat,maxLng,maxLat`, `layers=disasters,sos,shelters,hospitals,ngos,rescue`
- **Response `200`:** GeoJSON FeatureCollection containing all active entities for map display.

---

## 10. AI Services (`/api/ai`)

### 10.1 Classify Disaster Report
- **Method / Path:** `POST /api/ai/classify-disaster`
- **Request Body:** `{ text: string; imageBase64?: string }`
- **Response `200`:**
```typescript
{
  type: DisasterType,
  severity: DisasterSeverity,
  confidence: number,
  recommendedRadiusKm: number,
  explanation: string
}
```

### 10.2 Classify SOS Request
- **Method / Path:** `POST /api/ai/classify-sos`
- **Request Body:** `{ description: string; peopleCount?: number; medicalNeeds?: string }`
- **Response `200`:**
```typescript
{
  urgency: PriorityLevel,
  recommendedTeamType: RescueTeamSpecialization,
  confidence: number,
  explanation: string
}
```

### 10.3 Recommend NGO for Uncovered Area
- **Method / Path:** `POST /api/ai/recommend-ngo`
- **Request Body:** `{ disasterId: string; taskType: ReliefTaskType; latitude: number; longitude: number }`
- **Response `200`:** Ranked list of NGOs with capability match scores and distance factors.

### 10.4 AI Disaster Assistant (Chatbot)
- **Method / Path:** `POST /api/ai/chat`
- **Request Body:** `{ message: string; disasterContextId?: string; conversationHistory?: Array<{ role: string; content: string }> }`
- **Response `200`:** Actionable, safety-checked advice with emergency phone numbers and verified shelters.
