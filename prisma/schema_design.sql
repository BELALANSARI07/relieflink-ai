-- ============================================================================
-- ReliefLink AI — Complete PostgreSQL Database Schema
-- AI-Powered Disaster Response & Relief Coordination Platform
-- ============================================================================
-- Prerequisites: PostgreSQL 15+, PostGIS extension, pgcrypto extension
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

CREATE TYPE user_role AS ENUM (
    'citizen',
    'volunteer',
    'ngo_admin',
    'rescue_team',
    'hospital_admin',
    'shelter_admin',
    'government_authority',
    'super_admin'
);

CREATE TYPE disaster_type AS ENUM (
    'earthquake',
    'flood',
    'hurricane',
    'wildfire',
    'tsunami',
    'landslide',
    'drought',
    'pandemic',
    'industrial_accident',
    'other'
);

CREATE TYPE disaster_severity AS ENUM (
    'low',
    'moderate',
    'high',
    'critical',
    'catastrophic'
);

CREATE TYPE disaster_status AS ENUM (
    'reported',
    'verified',
    'active',
    'contained',
    'resolved',
    'closed'
);

CREATE TYPE sos_type AS ENUM (
    'medical',
    'rescue',
    'evacuation',
    'food_water',
    'shelter',
    'missing_person',
    'other'
);

CREATE TYPE sos_status AS ENUM (
    'pending',
    'acknowledged',
    'assigned',
    'in_progress',
    'resolved',
    'cancelled',
    'expired'
);

CREATE TYPE rescue_team_status AS ENUM (
    'available',
    'deployed',
    'en_route',
    'on_scene',
    'returning',
    'off_duty',
    'standby'
);

CREATE TYPE rescue_assignment_status AS ENUM (
    'assigned',
    'accepted',
    'en_route',
    'on_scene',
    'completed',
    'failed',
    'cancelled'
);

CREATE TYPE rescue_team_specialization AS ENUM (
    'urban_search_rescue',
    'water_rescue',
    'mountain_rescue',
    'medical',
    'hazmat',
    'k9_unit',
    'aerial',
    'general'
);

CREATE TYPE ngo_operational_status AS ENUM (
    'active',
    'inactive',
    'suspended',
    'pending_verification'
);

CREATE TYPE relief_task_type AS ENUM (
    'food_distribution',
    'medical_aid',
    'shelter_setup',
    'evacuation',
    'search_rescue',
    'debris_clearing',
    'water_sanitation',
    'psychosocial_support',
    'logistics',
    'other'
);

CREATE TYPE task_status AS ENUM (
    'pending',
    'assigned',
    'in_progress',
    'completed',
    'cancelled',
    'on_hold'
);

CREATE TYPE priority_level AS ENUM (
    'low',
    'medium',
    'high',
    'critical'
);

CREATE TYPE resource_status AS ENUM (
    'available',
    'reserved',
    'in_transit',
    'deployed',
    'depleted',
    'expired',
    'damaged'
);

CREATE TYPE resource_request_status AS ENUM (
    'pending',
    'approved',
    'partially_fulfilled',
    'fulfilled',
    'denied',
    'cancelled'
);

CREATE TYPE allocation_status AS ENUM (
    'allocated',
    'dispatched',
    'in_transit',
    'delivered',
    'returned',
    'cancelled'
);

CREATE TYPE resource_owner_type AS ENUM (
    'government',
    'ngo',
    'hospital',
    'shelter',
    'private',
    'donated'
);

CREATE TYPE shelter_status AS ENUM (
    'preparing',
    'open',
    'full',
    'closed',
    'evacuating'
);

CREATE TYPE volunteer_availability AS ENUM (
    'available',
    'busy',
    'unavailable',
    'on_assignment'
);

CREATE TYPE volunteer_assignment_status AS ENUM (
    'assigned',
    'accepted',
    'in_progress',
    'completed',
    'cancelled',
    'no_show'
);

CREATE TYPE notification_type AS ENUM (
    'disaster_alert',
    'sos_update',
    'assignment',
    'resource_update',
    'shelter_update',
    'hospital_update',
    'system',
    'ai_recommendation',
    'volunteer_request',
    'relief_update'
);

CREATE TYPE ai_recommendation_type AS ENUM (
    'resource_allocation',
    'evacuation_route',
    'rescue_priority',
    'shelter_assignment',
    'volunteer_matching',
    'supply_forecast',
    'damage_assessment',
    'risk_prediction'
);

CREATE TYPE ai_recommendation_status AS ENUM (
    'pending',
    'accepted',
    'rejected',
    'implemented',
    'expired'
);

CREATE TYPE ai_classification_type AS ENUM (
    'disaster_severity',
    'damage_level',
    'sos_priority',
    'image_classification',
    'text_sentiment',
    'resource_need'
);

CREATE TYPE ngo_area_status AS ENUM (
    'active',
    'inactive',
    'planned'
);

-- ============================================================================
-- 1. USERS & AUTHENTICATION
-- ============================================================================

-- ---------------------------------------------------
-- users: Core user identity table
-- Design notes:
--   - UUID PKs for distributed-safe ID generation.
--   - phone stored as TEXT to accommodate international formats.
--   - Soft-delete via is_active flag; hard-delete is discouraged for audit.
-- ---------------------------------------------------
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           TEXT NOT NULL,
    password_hash   TEXT NOT NULL,
    full_name       TEXT NOT NULL,
    phone           TEXT,
    avatar_url      TEXT,
    is_verified     BOOLEAN NOT NULL DEFAULT FALSE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT users_email_unique UNIQUE (email),
    CONSTRAINT users_phone_unique UNIQUE (phone),
    CONSTRAINT users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_is_active ON users (is_active) WHERE is_active = TRUE;
CREATE INDEX idx_users_created_at ON users (created_at);

-- ---------------------------------------------------
-- user_roles: Many-to-many mapping of users to roles.
-- Design notes:
--   - Composite PK enforces one row per (user, role) pair.
--   - granted_by tracks who assigned the role for audit trail.
-- ---------------------------------------------------
CREATE TABLE user_roles (
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role        user_role NOT NULL,
    granted_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    granted_by  UUID REFERENCES users(id) ON DELETE SET NULL,

    PRIMARY KEY (user_id, role)
);

CREATE INDEX idx_user_roles_role ON user_roles (role);

-- ---------------------------------------------------
-- user_profiles: Extended profile data per user.
-- Design notes:
--   - Single-row-per-user design with JSONB for role-specific metadata.
--   - Avoids multiple profile sub-tables; role_metadata schema is validated
--     at the application layer or via CHECK constraints per role.
--   - geography(Point) for user's home/base location.
-- ---------------------------------------------------
CREATE TABLE user_profiles (
    user_id             UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    bio                 TEXT,
    date_of_birth       DATE,
    gender              TEXT,
    address             TEXT,
    city                TEXT,
    state               TEXT,
    country             TEXT,
    postal_code         TEXT,
    location            geography(Point, 4326),
    emergency_contact   JSONB,          -- { name, phone, relationship }
    languages           TEXT[],
    role_metadata       JSONB,          -- role-specific extended fields
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_profiles_location ON user_profiles USING GIST (location);
CREATE INDEX idx_user_profiles_city ON user_profiles (city);
CREATE INDEX idx_user_profiles_country ON user_profiles (country);

-- ---------------------------------------------------
-- refresh_tokens: JWT refresh-token store.
-- Design notes:
--   - Supports token rotation; revoked_at enables blacklisting.
--   - family_id groups tokens in a rotation chain to detect reuse attacks.
--   - Partitioned or periodically purged by expires_at in production.
-- ---------------------------------------------------
CREATE TABLE refresh_tokens (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash      TEXT NOT NULL,
    family_id       UUID NOT NULL DEFAULT uuid_generate_v4(),
    device_info     JSONB,              -- { user_agent, ip, device_type }
    expires_at      TIMESTAMPTZ NOT NULL,
    revoked_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT refresh_tokens_token_hash_unique UNIQUE (token_hash)
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens (user_id);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens (expires_at);
CREATE INDEX idx_refresh_tokens_family ON refresh_tokens (family_id);

-- ============================================================================
-- 2. DISASTER MANAGEMENT
-- ============================================================================

-- ---------------------------------------------------
-- disasters: Central disaster event registry.
-- Design notes:
--   - geography(Point) for epicenter; affected_radius_km defines the impact zone.
--   - AI models may auto-update severity via disaster_updates.
--   - verified_by is NULL until a government_authority or super_admin confirms.
--   - affected_area is an optional polygon for non-circular impact zones.
-- ---------------------------------------------------
CREATE TABLE disasters (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title               TEXT NOT NULL,
    description         TEXT,
    type                disaster_type NOT NULL,
    severity            disaster_severity NOT NULL DEFAULT 'moderate',
    status              disaster_status NOT NULL DEFAULT 'reported',
    location            geography(Point, 4326) NOT NULL,
    affected_area       geography(Polygon, 4326),
    affected_radius_km  NUMERIC(8, 2) NOT NULL DEFAULT 0,
    estimated_affected  INTEGER,        -- estimated number of people affected
    reported_by         UUID NOT NULL REFERENCES users(id),
    verified_by         UUID REFERENCES users(id),
    verified_at         TIMESTAMPTZ,
    started_at          TIMESTAMPTZ,
    ended_at            TIMESTAMPTZ,
    metadata            JSONB,          -- { source, external_ids, media_urls }
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT disasters_radius_positive CHECK (affected_radius_km >= 0),
    CONSTRAINT disasters_dates_valid CHECK (ended_at IS NULL OR ended_at >= started_at)
);

CREATE INDEX idx_disasters_type ON disasters (type);
CREATE INDEX idx_disasters_severity ON disasters (severity);
CREATE INDEX idx_disasters_status ON disasters (status);
CREATE INDEX idx_disasters_location ON disasters USING GIST (location);
CREATE INDEX idx_disasters_affected_area ON disasters USING GIST (affected_area);
CREATE INDEX idx_disasters_created_at ON disasters (created_at DESC);
CREATE INDEX idx_disasters_active ON disasters (status) WHERE status IN ('reported', 'verified', 'active');

-- ---------------------------------------------------
-- disaster_updates: Chronological updates to a disaster event.
-- Design notes:
--   - severity_change records transitions (nullable when no change).
--   - Supports both human-posted and AI-generated updates (via ai_generated flag).
-- ---------------------------------------------------
CREATE TABLE disaster_updates (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    disaster_id     UUID NOT NULL REFERENCES disasters(id) ON DELETE CASCADE,
    update_text     TEXT NOT NULL,
    severity_change disaster_severity,
    status_change   disaster_status,
    media_urls      TEXT[],
    ai_generated    BOOLEAN NOT NULL DEFAULT FALSE,
    posted_by       UUID NOT NULL REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_disaster_updates_disaster ON disaster_updates (disaster_id, created_at DESC);
CREATE INDEX idx_disaster_updates_posted_by ON disaster_updates (posted_by);

-- ============================================================================
-- 3. SOS & RESCUE
-- ============================================================================

-- ---------------------------------------------------
-- rescue_teams: Registered rescue teams.
-- Design notes:
--   - leader_id must be a user with 'rescue_team' role (enforced at app layer).
--   - specialization array allows multi-capability teams.
--   - location is the team's current/last-known position, updated in real-time.
-- ---------------------------------------------------
CREATE TABLE rescue_teams (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            TEXT NOT NULL,
    leader_id       UUID NOT NULL REFERENCES users(id),
    status          rescue_team_status NOT NULL DEFAULT 'available',
    location        geography(Point, 4326),
    capacity        INTEGER NOT NULL DEFAULT 1,
    specialization  rescue_team_specialization[] NOT NULL DEFAULT '{general}',
    equipment       TEXT[],
    contact_info    JSONB,              -- { phone, radio_freq, email }
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT rescue_teams_capacity_positive CHECK (capacity > 0)
);

CREATE INDEX idx_rescue_teams_status ON rescue_teams (status);
CREATE INDEX idx_rescue_teams_location ON rescue_teams USING GIST (location);
CREATE INDEX idx_rescue_teams_leader ON rescue_teams (leader_id);
CREATE INDEX idx_rescue_teams_available ON rescue_teams (status) WHERE status = 'available';

-- ---------------------------------------------------
-- rescue_team_members: Members belonging to a rescue team.
-- ---------------------------------------------------
CREATE TABLE rescue_team_members (
    team_id         UUID NOT NULL REFERENCES rescue_teams(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_in_team    TEXT NOT NULL DEFAULT 'member', -- leader, medic, navigator, member
    joined_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (team_id, user_id)
);

CREATE INDEX idx_rescue_team_members_user ON rescue_team_members (user_id);

-- ---------------------------------------------------
-- sos_requests: Distress signals from citizens.
-- Design notes:
--   - location is the citizen's position at time of request.
--   - assigned_team_id is a denormalized shortcut; canonical assignment is
--     tracked in rescue_assignments for full history.
--   - media_urls for photos/videos of the situation.
-- ---------------------------------------------------
CREATE TABLE sos_requests (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    citizen_id      UUID NOT NULL REFERENCES users(id),
    disaster_id     UUID REFERENCES disasters(id) ON DELETE SET NULL,
    type            sos_type NOT NULL DEFAULT 'rescue',
    description     TEXT,
    severity        priority_level NOT NULL DEFAULT 'high',
    people_count    INTEGER NOT NULL DEFAULT 1,
    location        geography(Point, 4326) NOT NULL,
    address         TEXT,
    media_urls      TEXT[],
    status          sos_status NOT NULL DEFAULT 'pending',
    assigned_team_id UUID REFERENCES rescue_teams(id) ON DELETE SET NULL,
    resolved_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT sos_people_positive CHECK (people_count > 0)
);

CREATE INDEX idx_sos_requests_citizen ON sos_requests (citizen_id);
CREATE INDEX idx_sos_requests_disaster ON sos_requests (disaster_id);
CREATE INDEX idx_sos_requests_status ON sos_requests (status);
CREATE INDEX idx_sos_requests_severity ON sos_requests (severity);
CREATE INDEX idx_sos_requests_location ON sos_requests USING GIST (location);
CREATE INDEX idx_sos_requests_created_at ON sos_requests (created_at DESC);
CREATE INDEX idx_sos_requests_pending ON sos_requests (status, severity)
    WHERE status IN ('pending', 'acknowledged');

-- ---------------------------------------------------
-- rescue_assignments: Assignment history linking SOS to teams.
-- Design notes:
--   - Preserves full history — reassignments create new rows.
--   - notes field for field reports and status updates.
-- ---------------------------------------------------
CREATE TABLE rescue_assignments (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sos_id          UUID NOT NULL REFERENCES sos_requests(id) ON DELETE CASCADE,
    team_id         UUID NOT NULL REFERENCES rescue_teams(id),
    assigned_by     UUID NOT NULL REFERENCES users(id),
    status          rescue_assignment_status NOT NULL DEFAULT 'assigned',
    priority        priority_level NOT NULL DEFAULT 'high',
    notes           TEXT,
    eta_minutes     INTEGER,
    started_at      TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_rescue_assignments_sos ON rescue_assignments (sos_id);
CREATE INDEX idx_rescue_assignments_team ON rescue_assignments (team_id);
CREATE INDEX idx_rescue_assignments_status ON rescue_assignments (status);
CREATE INDEX idx_rescue_assignments_active ON rescue_assignments (team_id, status)
    WHERE status IN ('assigned', 'accepted', 'en_route', 'on_scene');

-- ============================================================================
-- 4. NGO & RELIEF COORDINATION
-- ============================================================================

-- ---------------------------------------------------
-- ngos: Registered non-governmental organizations.
-- Design notes:
--   - capabilities stored as TEXT[] for filterable specializations.
--   - contact_info JSONB allows flexible multi-channel contact data.
--   - verification_doc_url points to uploaded proof of registration.
-- ---------------------------------------------------
CREATE TABLE ngos (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                TEXT NOT NULL,
    registration_number TEXT,
    description         TEXT,
    admin_id            UUID NOT NULL REFERENCES users(id),
    verified            BOOLEAN NOT NULL DEFAULT FALSE,
    verified_by         UUID REFERENCES users(id),
    verified_at         TIMESTAMPTZ,
    verification_doc_url TEXT,
    operational_status  ngo_operational_status NOT NULL DEFAULT 'pending_verification',
    capabilities        TEXT[],         -- ['medical_aid', 'food_distribution', ...]
    website             TEXT,
    contact_info        JSONB NOT NULL DEFAULT '{}', -- { phone, email, address }
    logo_url            TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT ngos_registration_unique UNIQUE (registration_number)
);

CREATE INDEX idx_ngos_admin ON ngos (admin_id);
CREATE INDEX idx_ngos_status ON ngos (operational_status);
CREATE INDEX idx_ngos_verified ON ngos (verified) WHERE verified = TRUE;
CREATE INDEX idx_ngos_capabilities ON ngos USING GIN (capabilities);

-- ---------------------------------------------------
-- ngo_operational_areas: Geographic areas where an NGO operates.
-- Design notes:
--   - boundary is a Polygon geography for precise area matching.
--   - Enables spatial queries: "which NGOs cover this disaster location?"
-- ---------------------------------------------------
CREATE TABLE ngo_operational_areas (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ngo_id      UUID NOT NULL REFERENCES ngos(id) ON DELETE CASCADE,
    area_name   TEXT NOT NULL,
    boundary    geography(Polygon, 4326) NOT NULL,
    status      ngo_area_status NOT NULL DEFAULT 'active',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ngo_areas_ngo ON ngo_operational_areas (ngo_id);
CREATE INDEX idx_ngo_areas_boundary ON ngo_operational_areas USING GIST (boundary);
CREATE INDEX idx_ngo_areas_active ON ngo_operational_areas (ngo_id) WHERE status = 'active';

-- ---------------------------------------------------
-- ngo_members: Users belonging to an NGO.
-- ---------------------------------------------------
CREATE TABLE ngo_members (
    ngo_id      UUID NOT NULL REFERENCES ngos(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_in_ngo TEXT NOT NULL DEFAULT 'member', -- admin, coordinator, field_worker, member
    joined_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (ngo_id, user_id)
);

CREATE INDEX idx_ngo_members_user ON ngo_members (user_id);

-- ---------------------------------------------------
-- relief_tasks: Coordinated relief activities linked to disasters.
-- Design notes:
--   - area geography defines the task's operational zone.
--   - Links to both disaster and NGO for cross-reference queries.
--   - estimated_beneficiaries for planning; actual count tracked in relief_activities.
-- ---------------------------------------------------
CREATE TABLE relief_tasks (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    disaster_id             UUID NOT NULL REFERENCES disasters(id),
    ngo_id                  UUID REFERENCES ngos(id) ON DELETE SET NULL,
    title                   TEXT NOT NULL,
    description             TEXT,
    type                    relief_task_type NOT NULL,
    status                  task_status NOT NULL DEFAULT 'pending',
    area                    geography(Polygon, 4326),
    priority                priority_level NOT NULL DEFAULT 'medium',
    estimated_beneficiaries INTEGER,
    assigned_by             UUID REFERENCES users(id),
    due_date                TIMESTAMPTZ,
    started_at              TIMESTAMPTZ,
    completed_at            TIMESTAMPTZ,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_relief_tasks_disaster ON relief_tasks (disaster_id);
CREATE INDEX idx_relief_tasks_ngo ON relief_tasks (ngo_id);
CREATE INDEX idx_relief_tasks_status ON relief_tasks (status);
CREATE INDEX idx_relief_tasks_type ON relief_tasks (type);
CREATE INDEX idx_relief_tasks_area ON relief_tasks USING GIST (area);
CREATE INDEX idx_relief_tasks_active ON relief_tasks (disaster_id, status)
    WHERE status IN ('pending', 'assigned', 'in_progress');

-- ---------------------------------------------------
-- relief_activities: Granular activity logs under relief tasks.
-- ---------------------------------------------------
CREATE TABLE relief_activities (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id             UUID NOT NULL REFERENCES relief_tasks(id) ON DELETE CASCADE,
    ngo_id              UUID REFERENCES ngos(id) ON DELETE SET NULL,
    description         TEXT NOT NULL,
    resources_used      JSONB,          -- [{ resource_id, name, quantity, unit }]
    beneficiaries_count INTEGER NOT NULL DEFAULT 0,
    location            geography(Point, 4326),
    media_urls          TEXT[],
    performed_by        UUID REFERENCES users(id),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT relief_activities_beneficiaries_nonneg CHECK (beneficiaries_count >= 0)
);

CREATE INDEX idx_relief_activities_task ON relief_activities (task_id);
CREATE INDEX idx_relief_activities_ngo ON relief_activities (ngo_id);
CREATE INDEX idx_relief_activities_location ON relief_activities USING GIST (location);

-- ============================================================================
-- 5. RESOURCE MANAGEMENT
-- ============================================================================

-- ---------------------------------------------------
-- resource_categories: Taxonomy of resource types.
-- Design notes:
--   - parent_id enables hierarchical categories (e.g., Medical > Bandages).
--   - icon for UI rendering.
-- ---------------------------------------------------
CREATE TABLE resource_categories (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        TEXT NOT NULL,
    parent_id   UUID REFERENCES resource_categories(id) ON DELETE SET NULL,
    unit        TEXT NOT NULL,           -- 'kg', 'liters', 'units', 'boxes', etc.
    icon        TEXT,
    description TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT resource_categories_name_unique UNIQUE (name, parent_id)
);

CREATE INDEX idx_resource_categories_parent ON resource_categories (parent_id);

-- ---------------------------------------------------
-- resources: Physical resource inventory items.
-- Design notes:
--   - Polymorphic owner via owner_type + owner_id pattern.
--   - expiry_date for perishable goods (food, medicine).
--   - location for warehouse/storage position.
-- ---------------------------------------------------
CREATE TABLE resources (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id     UUID NOT NULL REFERENCES resource_categories(id),
    name            TEXT NOT NULL,
    description     TEXT,
    quantity         NUMERIC(12, 2) NOT NULL DEFAULT 0,
    unit            TEXT NOT NULL,
    location        geography(Point, 4326),
    address         TEXT,
    owner_type      resource_owner_type NOT NULL,
    owner_id        UUID NOT NULL,      -- FK resolved at app layer (ngo.id, shelter.id, etc.)
    status          resource_status NOT NULL DEFAULT 'available',
    expiry_date     DATE,
    metadata        JSONB,              -- { batch_number, condition, storage_requirements }
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT resources_quantity_nonneg CHECK (quantity >= 0)
);

CREATE INDEX idx_resources_category ON resources (category_id);
CREATE INDEX idx_resources_owner ON resources (owner_type, owner_id);
CREATE INDEX idx_resources_status ON resources (status);
CREATE INDEX idx_resources_location ON resources USING GIST (location);
CREATE INDEX idx_resources_available ON resources (category_id, status) WHERE status = 'available';
CREATE INDEX idx_resources_expiry ON resources (expiry_date) WHERE expiry_date IS NOT NULL;

-- ---------------------------------------------------
-- resource_requests: Requests for resources during a disaster.
-- ---------------------------------------------------
CREATE TABLE resource_requests (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    disaster_id         UUID NOT NULL REFERENCES disasters(id),
    requested_by        UUID NOT NULL REFERENCES users(id),
    category_id         UUID NOT NULL REFERENCES resource_categories(id),
    quantity_needed     NUMERIC(12, 2) NOT NULL,
    fulfilled_quantity  NUMERIC(12, 2) NOT NULL DEFAULT 0,
    priority            priority_level NOT NULL DEFAULT 'medium',
    status              resource_request_status NOT NULL DEFAULT 'pending',
    justification       TEXT,
    delivery_location   geography(Point, 4326),
    delivery_address    TEXT,
    needed_by           TIMESTAMPTZ,
    approved_by         UUID REFERENCES users(id),
    approved_at         TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT resource_requests_qty_positive CHECK (quantity_needed > 0),
    CONSTRAINT resource_requests_fulfilled_valid CHECK (fulfilled_quantity >= 0 AND fulfilled_quantity <= quantity_needed)
);

CREATE INDEX idx_resource_requests_disaster ON resource_requests (disaster_id);
CREATE INDEX idx_resource_requests_category ON resource_requests (category_id);
CREATE INDEX idx_resource_requests_status ON resource_requests (status);
CREATE INDEX idx_resource_requests_priority ON resource_requests (priority);
CREATE INDEX idx_resource_requests_pending ON resource_requests (disaster_id, status, priority)
    WHERE status IN ('pending', 'approved', 'partially_fulfilled');

-- ---------------------------------------------------
-- resource_allocations: Tracks movement of resources to fulfill requests.
-- ---------------------------------------------------
CREATE TABLE resource_allocations (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id      UUID NOT NULL REFERENCES resource_requests(id),
    resource_id     UUID NOT NULL REFERENCES resources(id),
    quantity        NUMERIC(12, 2) NOT NULL,
    allocated_by    UUID NOT NULL REFERENCES users(id),
    status          allocation_status NOT NULL DEFAULT 'allocated',
    dispatched_at   TIMESTAMPTZ,
    estimated_arrival TIMESTAMPTZ,
    delivered_at    TIMESTAMPTZ,
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT resource_allocations_qty_positive CHECK (quantity > 0)
);

CREATE INDEX idx_resource_allocations_request ON resource_allocations (request_id);
CREATE INDEX idx_resource_allocations_resource ON resource_allocations (resource_id);
CREATE INDEX idx_resource_allocations_status ON resource_allocations (status);
CREATE INDEX idx_resource_allocations_in_transit ON resource_allocations (status)
    WHERE status IN ('dispatched', 'in_transit');

-- ============================================================================
-- 6. SHELTERS & HOSPITALS
-- ============================================================================

-- ---------------------------------------------------
-- shelters: Emergency shelters for displaced people.
-- Design notes:
--   - facilities JSONB stores amenities: { water, electricity, medical, kitchen, ... }
--   - current_occupancy maintained via triggers or app-level updates.
--   - Constraint ensures occupancy never exceeds capacity at DB level.
-- ---------------------------------------------------
CREATE TABLE shelters (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                TEXT NOT NULL,
    admin_id            UUID NOT NULL REFERENCES users(id),
    disaster_id         UUID REFERENCES disasters(id) ON DELETE SET NULL,
    location            geography(Point, 4326) NOT NULL,
    address             TEXT NOT NULL,
    total_capacity      INTEGER NOT NULL,
    current_occupancy   INTEGER NOT NULL DEFAULT 0,
    status              shelter_status NOT NULL DEFAULT 'preparing',
    facilities          JSONB NOT NULL DEFAULT '{}',
    contact_info        JSONB NOT NULL DEFAULT '{}',
    operating_hours     TEXT,
    accessibility       TEXT[],         -- ['wheelchair', 'elevator', 'pet_friendly']
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT shelters_capacity_positive CHECK (total_capacity > 0),
    CONSTRAINT shelters_occupancy_valid CHECK (current_occupancy >= 0 AND current_occupancy <= total_capacity)
);

CREATE INDEX idx_shelters_admin ON shelters (admin_id);
CREATE INDEX idx_shelters_disaster ON shelters (disaster_id);
CREATE INDEX idx_shelters_status ON shelters (status);
CREATE INDEX idx_shelters_location ON shelters USING GIST (location);
CREATE INDEX idx_shelters_available ON shelters (status, current_occupancy)
    WHERE status = 'open';

-- ---------------------------------------------------
-- hospitals: Medical facilities with capacity tracking.
-- ---------------------------------------------------
CREATE TABLE hospitals (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                TEXT NOT NULL,
    admin_id            UUID NOT NULL REFERENCES users(id),
    location            geography(Point, 4326) NOT NULL,
    address             TEXT NOT NULL,
    total_beds          INTEGER NOT NULL,
    available_beds      INTEGER NOT NULL DEFAULT 0,
    icu_beds            INTEGER NOT NULL DEFAULT 0,
    available_icu       INTEGER NOT NULL DEFAULT 0,
    ventilators         INTEGER NOT NULL DEFAULT 0,
    available_ventilators INTEGER NOT NULL DEFAULT 0,
    specializations     TEXT[],         -- ['trauma', 'burn', 'cardiac', 'pediatric']
    emergency_capable   BOOLEAN NOT NULL DEFAULT FALSE,
    blood_bank          BOOLEAN NOT NULL DEFAULT FALSE,
    contact_info        JSONB NOT NULL DEFAULT '{}',
    operating_status    TEXT NOT NULL DEFAULT 'operational', -- operational, limited, overwhelmed, closed
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT hospitals_beds_valid CHECK (
        total_beds > 0
        AND available_beds >= 0
        AND available_beds <= total_beds
        AND icu_beds >= 0
        AND icu_beds <= total_beds
        AND available_icu >= 0
        AND available_icu <= icu_beds
    )
);

CREATE INDEX idx_hospitals_admin ON hospitals (admin_id);
CREATE INDEX idx_hospitals_location ON hospitals USING GIST (location);
CREATE INDEX idx_hospitals_emergency ON hospitals (emergency_capable) WHERE emergency_capable = TRUE;
CREATE INDEX idx_hospitals_specializations ON hospitals USING GIN (specializations);
CREATE INDEX idx_hospitals_available ON hospitals (available_beds) WHERE available_beds > 0;

-- ---------------------------------------------------
-- shelter_updates: Occupancy change log for shelters.
-- ---------------------------------------------------
CREATE TABLE shelter_updates (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shelter_id          UUID NOT NULL REFERENCES shelters(id) ON DELETE CASCADE,
    occupancy_change    INTEGER NOT NULL, -- positive = check-in, negative = check-out
    new_occupancy       INTEGER NOT NULL,
    status_change       shelter_status,
    notes               TEXT,
    updated_by          UUID NOT NULL REFERENCES users(id),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_shelter_updates_shelter ON shelter_updates (shelter_id, created_at DESC);

-- ---------------------------------------------------
-- hospital_updates: Bed availability change log for hospitals.
-- ---------------------------------------------------
CREATE TABLE hospital_updates (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hospital_id     UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    beds_change     INTEGER NOT NULL DEFAULT 0,
    icu_change      INTEGER NOT NULL DEFAULT 0,
    notes           TEXT,
    updated_by      UUID NOT NULL REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_hospital_updates_hospital ON hospital_updates (hospital_id, created_at DESC);

-- ============================================================================
-- 7. VOLUNTEER MANAGEMENT
-- ============================================================================

-- ---------------------------------------------------
-- volunteer_profiles: Extended profile for volunteer users.
-- Design notes:
--   - skills TEXT[] for flexible, searchable skill tags.
--   - hours_contributed aggregated from completed assignments.
--   - max_travel_km limits assignment radius.
-- ---------------------------------------------------
CREATE TABLE volunteer_profiles (
    user_id             UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    skills              TEXT[] NOT NULL DEFAULT '{}',
    certifications      TEXT[],
    availability_status volunteer_availability NOT NULL DEFAULT 'available',
    location            geography(Point, 4326),
    max_travel_km       NUMERIC(6, 2) DEFAULT 50,
    verified            BOOLEAN NOT NULL DEFAULT FALSE,
    verified_by         UUID REFERENCES users(id),
    verification_doc_url TEXT,
    hours_contributed   NUMERIC(8, 2) NOT NULL DEFAULT 0,
    assignments_completed INTEGER NOT NULL DEFAULT 0,
    rating              NUMERIC(3, 2),   -- 0.00 – 5.00
    notes               TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT volunteer_hours_nonneg CHECK (hours_contributed >= 0),
    CONSTRAINT volunteer_rating_range CHECK (rating IS NULL OR (rating >= 0 AND rating <= 5))
);

CREATE INDEX idx_volunteer_profiles_location ON volunteer_profiles USING GIST (location);
CREATE INDEX idx_volunteer_profiles_skills ON volunteer_profiles USING GIN (skills);
CREATE INDEX idx_volunteer_profiles_status ON volunteer_profiles (availability_status);
CREATE INDEX idx_volunteer_profiles_available ON volunteer_profiles (availability_status)
    WHERE availability_status = 'available' AND verified = TRUE;

-- ---------------------------------------------------
-- volunteer_assignments: Task assignments for volunteers.
-- ---------------------------------------------------
CREATE TABLE volunteer_assignments (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    volunteer_id    UUID NOT NULL REFERENCES users(id),
    disaster_id     UUID NOT NULL REFERENCES disasters(id),
    relief_task_id  UUID REFERENCES relief_tasks(id) ON DELETE SET NULL,
    task_description TEXT NOT NULL,
    location        geography(Point, 4326),
    status          volunteer_assignment_status NOT NULL DEFAULT 'assigned',
    assigned_by     UUID NOT NULL REFERENCES users(id),
    hours_logged    NUMERIC(6, 2) DEFAULT 0,
    rating          NUMERIC(3, 2),
    feedback        TEXT,
    started_at      TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT vol_assign_hours_nonneg CHECK (hours_logged >= 0),
    CONSTRAINT vol_assign_rating_range CHECK (rating IS NULL OR (rating >= 0 AND rating <= 5))
);

CREATE INDEX idx_vol_assignments_volunteer ON volunteer_assignments (volunteer_id);
CREATE INDEX idx_vol_assignments_disaster ON volunteer_assignments (disaster_id);
CREATE INDEX idx_vol_assignments_status ON volunteer_assignments (status);
CREATE INDEX idx_vol_assignments_location ON volunteer_assignments USING GIST (location);
CREATE INDEX idx_vol_assignments_active ON volunteer_assignments (volunteer_id, status)
    WHERE status IN ('assigned', 'accepted', 'in_progress');

-- ============================================================================
-- 8. NOTIFICATIONS & ALERTS
-- ============================================================================

-- ---------------------------------------------------
-- notifications: User-targeted notification store.
-- Design notes:
--   - data JSONB carries type-specific payload (entity_id, link, action).
--   - Partial index on unread for efficient badge-count queries.
--   - Consider TTL-based cleanup (e.g., delete read notifications > 90 days).
-- ---------------------------------------------------
CREATE TABLE notifications (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type        notification_type NOT NULL,
    title       TEXT NOT NULL,
    message     TEXT NOT NULL,
    data        JSONB,                  -- { entity_type, entity_id, action_url, ... }
    read        BOOLEAN NOT NULL DEFAULT FALSE,
    read_at     TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications (user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications (user_id, created_at DESC) WHERE read = FALSE;
CREATE INDEX idx_notifications_type ON notifications (type);

-- ---------------------------------------------------
-- alert_subscriptions: User preferences for disaster alerts.
-- Design notes:
--   - location + radius_km defines the user's area of interest.
--   - disaster_types array filters which disasters trigger alerts.
--   - channels array controls delivery method (push, sms, email).
-- ---------------------------------------------------
CREATE TABLE alert_subscriptions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    disaster_types  disaster_type[] NOT NULL DEFAULT '{}',
    severity_min    disaster_severity NOT NULL DEFAULT 'low',
    location        geography(Point, 4326) NOT NULL,
    radius_km       NUMERIC(8, 2) NOT NULL DEFAULT 50,
    channels        TEXT[] NOT NULL DEFAULT '{push}', -- push, sms, email
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT alert_sub_radius_positive CHECK (radius_km > 0)
);

CREATE INDEX idx_alert_subs_user ON alert_subscriptions (user_id);
CREATE INDEX idx_alert_subs_location ON alert_subscriptions USING GIST (location);
CREATE INDEX idx_alert_subs_active ON alert_subscriptions (is_active) WHERE is_active = TRUE;
CREATE INDEX idx_alert_subs_types ON alert_subscriptions USING GIN (disaster_types);

-- ============================================================================
-- 9. AI / ML INTEGRATION
-- ============================================================================

-- ---------------------------------------------------
-- ai_recommendations: AI-generated action recommendations.
-- Design notes:
--   - context_id is polymorphic: references a disaster, SOS, task, etc.
--   - recommendation JSONB carries structured, model-specific output.
--   - confidence is 0.0–1.0 probability.
--   - Tracks which model/version generated it for reproducibility.
-- ---------------------------------------------------
CREATE TABLE ai_recommendations (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type            ai_recommendation_type NOT NULL,
    context_type    TEXT NOT NULL,       -- 'disaster', 'sos_request', 'resource_request', etc.
    context_id      UUID NOT NULL,
    recommendation  JSONB NOT NULL,     -- model-specific structured output
    confidence      NUMERIC(5, 4) NOT NULL,
    explanation     TEXT,
    status          ai_recommendation_status NOT NULL DEFAULT 'pending',
    actioned_by     UUID REFERENCES users(id),
    actioned_at     TIMESTAMPTZ,
    created_by_model TEXT NOT NULL,      -- 'relieflink-triage-v2', 'route-optimizer-v1', etc.
    model_version   TEXT,
    processing_time_ms INTEGER,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT ai_rec_confidence_range CHECK (confidence >= 0 AND confidence <= 1)
);

CREATE INDEX idx_ai_recommendations_type ON ai_recommendations (type);
CREATE INDEX idx_ai_recommendations_context ON ai_recommendations (context_type, context_id);
CREATE INDEX idx_ai_recommendations_status ON ai_recommendations (status);
CREATE INDEX idx_ai_recommendations_model ON ai_recommendations (created_by_model);
CREATE INDEX idx_ai_recommendations_created ON ai_recommendations (created_at DESC);
CREATE INDEX idx_ai_recommendations_pending ON ai_recommendations (type, status)
    WHERE status = 'pending';

-- ---------------------------------------------------
-- ai_classifications: AI classification results on entities.
-- Design notes:
--   - input_id references the classified entity (image, text, SOS, etc.)
--   - classification JSONB allows multi-label with per-label confidence.
--   - Versioned by model_version for A/B testing and rollback.
-- ---------------------------------------------------
CREATE TABLE ai_classifications (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type            ai_classification_type NOT NULL,
    input_type      TEXT NOT NULL,       -- 'sos_request', 'disaster_image', 'report_text', etc.
    input_id        UUID NOT NULL,
    classification  JSONB NOT NULL,     -- { label, sub_labels, raw_scores }
    confidence      NUMERIC(5, 4) NOT NULL,
    model_name      TEXT NOT NULL,
    model_version   TEXT NOT NULL,
    processing_time_ms INTEGER,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT ai_cls_confidence_range CHECK (confidence >= 0 AND confidence <= 1)
);

CREATE INDEX idx_ai_classifications_type ON ai_classifications (type);
CREATE INDEX idx_ai_classifications_input ON ai_classifications (input_type, input_id);
CREATE INDEX idx_ai_classifications_model ON ai_classifications (model_name, model_version);
CREATE INDEX idx_ai_classifications_created ON ai_classifications (created_at DESC);

-- ============================================================================
-- 10. AUDIT LOG
-- ============================================================================

-- ---------------------------------------------------
-- audit_logs: Immutable event log for compliance and traceability.
-- Design notes:
--   - old_values/new_values JSONB capture before/after snapshots.
--   - Append-only; no UPDATE/DELETE operations should target this table.
--   - Consider table partitioning by created_at for large deployments.
--   - ip_address stored as INET for proper range queries.
-- ---------------------------------------------------
CREATE TABLE audit_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    action          TEXT NOT NULL,       -- 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', ...
    entity_type     TEXT NOT NULL,       -- table name / entity name
    entity_id       UUID,
    old_values      JSONB,
    new_values      JSONB,
    ip_address      INET,
    user_agent      TEXT,
    session_id      UUID,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs (user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs (entity_type, entity_id);
CREATE INDEX idx_audit_logs_action ON audit_logs (action);
CREATE INDEX idx_audit_logs_created ON audit_logs (created_at DESC);
CREATE INDEX idx_audit_logs_user_time ON audit_logs (user_id, created_at DESC);

-- ============================================================================
-- TRIGGER: auto-update updated_at columns
-- ============================================================================

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables with an updated_at column
DO $$
DECLARE
    tbl TEXT;
BEGIN
    FOR tbl IN
        SELECT table_name
        FROM information_schema.columns
        WHERE column_name = 'updated_at'
          AND table_schema = 'public'
          AND table_name != 'audit_logs'
    LOOP
        EXECUTE format(
            'CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I
             FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();',
            tbl
        );
    END LOOP;
END;
$$;

-- ============================================================================
-- TRIGGER: auto-update shelter occupancy from shelter_updates
-- ============================================================================

CREATE OR REPLACE FUNCTION trigger_shelter_occupancy_update()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE shelters
    SET current_occupancy = NEW.new_occupancy,
        status = CASE
            WHEN NEW.status_change IS NOT NULL THEN NEW.status_change
            WHEN NEW.new_occupancy >= total_capacity THEN 'full'::shelter_status
            WHEN NEW.new_occupancy > 0 THEN 'open'::shelter_status
            ELSE status
        END
    WHERE id = NEW.shelter_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER shelter_occupancy_sync
    AFTER INSERT ON shelter_updates
    FOR EACH ROW
    EXECUTE FUNCTION trigger_shelter_occupancy_update();

-- ============================================================================
-- TRIGGER: auto-update hospital bed counts from hospital_updates
-- ============================================================================

CREATE OR REPLACE FUNCTION trigger_hospital_beds_update()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE hospitals
    SET available_beds = GREATEST(0, available_beds + NEW.beds_change),
        available_icu  = GREATEST(0, available_icu + NEW.icu_change)
    WHERE id = NEW.hospital_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER hospital_beds_sync
    AFTER INSERT ON hospital_updates
    FOR EACH ROW
    EXECUTE FUNCTION trigger_hospital_beds_update();

-- ============================================================================
-- TRIGGER: auto-update fulfilled_quantity on resource_allocations delivery
-- ============================================================================

CREATE OR REPLACE FUNCTION trigger_allocation_delivered()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
        UPDATE resource_requests
        SET fulfilled_quantity = fulfilled_quantity + NEW.quantity,
            status = CASE
                WHEN fulfilled_quantity + NEW.quantity >= quantity_needed THEN 'fulfilled'::resource_request_status
                ELSE 'partially_fulfilled'::resource_request_status
            END
        WHERE id = NEW.request_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER allocation_delivery_sync
    AFTER UPDATE ON resource_allocations
    FOR EACH ROW
    EXECUTE FUNCTION trigger_allocation_delivered();

-- ============================================================================
-- SEED DATA: Default resource categories
-- ============================================================================

INSERT INTO resource_categories (name, unit, description) VALUES
    ('Drinking Water',      'liters',   'Potable water for drinking'),
    ('Food Packets',        'units',    'Ready-to-eat food packets'),
    ('Blankets',            'units',    'Thermal blankets'),
    ('Tents',               'units',    'Emergency shelter tents'),
    ('First Aid Kits',      'units',    'Standard first aid kits'),
    ('Medicines',           'boxes',    'General medicines and supplies'),
    ('Clothing',            'units',    'Emergency clothing sets'),
    ('Generators',          'units',    'Portable power generators'),
    ('Fuel',                'liters',   'Diesel/petrol fuel'),
    ('Communication Devices','units',   'Radios, satellite phones'),
    ('Sanitation Supplies', 'boxes',    'Hygiene and sanitation items'),
    ('Baby Supplies',       'boxes',    'Formula, diapers, baby food'),
    ('Surgical Equipment',  'units',    'Surgical tools and supplies'),
    ('Blood Units',         'units',    'Blood bags for transfusion'),
    ('Rescue Equipment',    'units',    'Ropes, harnesses, cutters'),
    ('Body Bags',           'units',    'For deceased victim handling'),
    ('Water Purification',  'units',    'Water purification tablets/systems'),
    ('Batteries',           'units',    'Assorted batteries'),
    ('Flashlights',         'units',    'Portable flashlights/torches'),
    ('Tarps',               'units',    'Waterproof tarpaulins');

-- ============================================================================
-- VIEWS: Commonly used aggregations
-- ============================================================================

-- Active disaster summary with counts of related entities
CREATE OR REPLACE VIEW v_active_disaster_summary AS
SELECT
    d.id,
    d.title,
    d.type,
    d.severity,
    d.status,
    d.location,
    d.affected_radius_km,
    d.started_at,
    (SELECT COUNT(*) FROM sos_requests s WHERE s.disaster_id = d.id AND s.status NOT IN ('resolved', 'cancelled'))
        AS active_sos_count,
    (SELECT COUNT(*) FROM relief_tasks rt WHERE rt.disaster_id = d.id AND rt.status IN ('pending', 'assigned', 'in_progress'))
        AS active_tasks_count,
    (SELECT COUNT(*) FROM resource_requests rr WHERE rr.disaster_id = d.id AND rr.status IN ('pending', 'approved', 'partially_fulfilled'))
        AS pending_resource_requests,
    (SELECT COUNT(*) FROM volunteer_assignments va WHERE va.disaster_id = d.id AND va.status IN ('assigned', 'accepted', 'in_progress'))
        AS active_volunteers
FROM disasters d
WHERE d.status IN ('reported', 'verified', 'active');

-- Shelter availability near a point (usage: WHERE ST_DWithin(location, ST_MakePoint(lng, lat)::geography, radius_m))
CREATE OR REPLACE VIEW v_shelter_availability AS
SELECT
    s.id,
    s.name,
    s.location,
    s.address,
    s.total_capacity,
    s.current_occupancy,
    (s.total_capacity - s.current_occupancy) AS available_spots,
    s.status,
    s.facilities,
    s.contact_info
FROM shelters s
WHERE s.status IN ('open', 'preparing');

-- Hospital availability
CREATE OR REPLACE VIEW v_hospital_availability AS
SELECT
    h.id,
    h.name,
    h.location,
    h.address,
    h.total_beds,
    h.available_beds,
    h.icu_beds,
    h.available_icu,
    h.available_ventilators,
    h.specializations,
    h.emergency_capable,
    h.contact_info,
    h.operating_status
FROM hospitals h
WHERE h.operating_status != 'closed';

-- ============================================================================
-- ROW-LEVEL SECURITY POLICIES (framework — enable per table as needed)
-- ============================================================================

-- Example: Enable RLS on sos_requests so citizens see only their own
-- In production, enable via: ALTER TABLE sos_requests ENABLE ROW LEVEL SECURITY;
-- Then apply policies:
--
-- CREATE POLICY sos_citizen_own ON sos_requests
--     FOR ALL TO citizen_role
--     USING (citizen_id = current_setting('app.current_user_id')::UUID);
--
-- CREATE POLICY sos_responder_all ON sos_requests
--     FOR SELECT TO responder_role
--     USING (TRUE);

-- ============================================================================
-- COMMENTS: Table documentation
-- ============================================================================

COMMENT ON TABLE users IS 'Core user identity and authentication table. Soft-delete via is_active flag.';
COMMENT ON TABLE user_roles IS 'RBAC role assignments. Users may hold multiple roles simultaneously.';
COMMENT ON TABLE user_profiles IS 'Extended profile data. role_metadata JSONB holds role-specific fields.';
COMMENT ON TABLE refresh_tokens IS 'JWT refresh token store with rotation-family tracking for reuse detection.';

COMMENT ON TABLE disasters IS 'Central disaster event registry. Geography point + radius defines impact zone.';
COMMENT ON TABLE disaster_updates IS 'Chronological updates to disasters, including AI-generated severity changes.';

COMMENT ON TABLE rescue_teams IS 'Registered rescue teams with real-time location and status tracking.';
COMMENT ON TABLE rescue_team_members IS 'Membership roster for rescue teams.';
COMMENT ON TABLE sos_requests IS 'Citizen distress signals with geolocation and severity classification.';
COMMENT ON TABLE rescue_assignments IS 'Assignment history linking SOS requests to rescue teams.';

COMMENT ON TABLE ngos IS 'Registered NGOs with verification status and capability tags.';
COMMENT ON TABLE ngo_operational_areas IS 'Geographic polygons defining where an NGO operates.';
COMMENT ON TABLE ngo_members IS 'NGO membership and role assignments.';
COMMENT ON TABLE relief_tasks IS 'Coordinated relief tasks linked to disasters and NGOs.';
COMMENT ON TABLE relief_activities IS 'Granular activity logs under relief tasks with beneficiary counts.';

COMMENT ON TABLE resource_categories IS 'Hierarchical taxonomy of resource types (supports parent-child nesting).';
COMMENT ON TABLE resources IS 'Physical resource inventory with polymorphic ownership (owner_type + owner_id).';
COMMENT ON TABLE resource_requests IS 'Disaster-linked resource requests with fulfillment tracking.';
COMMENT ON TABLE resource_allocations IS 'Tracks allocation, dispatch, and delivery of resources to fulfill requests.';

COMMENT ON TABLE shelters IS 'Emergency shelters with real-time occupancy tracking via triggers.';
COMMENT ON TABLE hospitals IS 'Medical facilities with bed/ICU availability tracking via triggers.';
COMMENT ON TABLE shelter_updates IS 'Append-only occupancy change log; triggers sync to shelters table.';
COMMENT ON TABLE hospital_updates IS 'Append-only bed change log; triggers sync to hospitals table.';

COMMENT ON TABLE volunteer_profiles IS 'Extended volunteer profile with skills, certifications, and contribution stats.';
COMMENT ON TABLE volunteer_assignments IS 'Task assignments for volunteers linked to disasters and relief tasks.';

COMMENT ON TABLE notifications IS 'User-targeted notifications with JSONB payload for type-specific data.';
COMMENT ON TABLE alert_subscriptions IS 'User preferences for location/type-based disaster alerts.';

COMMENT ON TABLE ai_recommendations IS 'AI-generated action recommendations with confidence scores and audit trail.';
COMMENT ON TABLE ai_classifications IS 'AI classification results on entities (images, text, SOS priority, etc.).';

COMMENT ON TABLE audit_logs IS 'Immutable audit log. Append-only; no UPDATE/DELETE. Partition by created_at in production.';
