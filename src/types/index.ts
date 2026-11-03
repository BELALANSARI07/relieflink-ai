// ReliefLink AI — Core Type Definitions

export type UserRole =
  | 'CITIZEN'
  | 'VOLUNTEER'
  | 'NGO_ADMIN'
  | 'RESCUE_TEAM'
  | 'HOSPITAL_ADMIN'
  | 'SHELTER_ADMIN'
  | 'GOVERNMENT_AUTHORITY'
  | 'SUPER_ADMIN';

export type DisasterType =
  | 'EARTHQUAKE'
  | 'FLOOD'
  | 'HURRICANE'
  | 'WILDFIRE'
  | 'TSUNAMI'
  | 'LANDSLIDE'
  | 'DROUGHT'
  | 'PANDEMIC'
  | 'INDUSTRIAL_ACCIDENT'
  | 'OTHER';

export type DisasterSeverity = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' | 'CATASTROPHIC';

export type DisasterStatus = 'REPORTED' | 'VERIFIED' | 'ACTIVE' | 'CONTAINED' | 'RESOLVED' | 'CLOSED';

export type SosType =
  | 'MEDICAL'
  | 'RESCUE'
  | 'EVACUATION'
  | 'FOOD_WATER'
  | 'SHELTER'
  | 'MISSING_PERSON'
  | 'OTHER';

export type SosStatus =
  | 'PENDING'
  | 'ACKNOWLEDGED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CANCELLED'
  | 'EXPIRED';

export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type RescueTeamStatus =
  | 'AVAILABLE'
  | 'DEPLOYED'
  | 'EN_ROUTE'
  | 'ON_SCENE'
  | 'RETURNING'
  | 'OFF_DUTY'
  | 'STANDBY';

export type RescueTeamSpecialization =
  | 'URBAN_SEARCH_RESCUE'
  | 'WATER_RESCUE'
  | 'MOUNTAIN_RESCUE'
  | 'MEDICAL'
  | 'HAZMAT'
  | 'K9_UNIT'
  | 'AERIAL'
  | 'GENERAL';

export type NgoOperationalStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';

export type ReliefTaskType =
  | 'FOOD_DISTRIBUTION'
  | 'MEDICAL_AID'
  | 'SHELTER_SETUP'
  | 'EVACUATION'
  | 'SEARCH_RESCUE'
  | 'DEBRIS_CLEARING'
  | 'WATER_SANITATION'
  | 'PSYCHOSOCIAL_SUPPORT'
  | 'LOGISTICS'
  | 'OTHER';

export type TaskStatus = 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'ON_HOLD';

export type ResourceStatus =
  | 'AVAILABLE'
  | 'RESERVED'
  | 'IN_TRANSIT'
  | 'DEPLOYED'
  | 'DEPLETED'
  | 'EXPIRED'
  | 'DAMAGED';

export type ShelterStatus = 'PREPARING' | 'OPEN' | 'FULL' | 'CLOSED' | 'EVACUATING';

export type VolunteerAvailability = 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE' | 'ON_ASSIGNMENT';

export type NotificationType =
  | 'DISASTER_ALERT'
  | 'SOS_UPDATE'
  | 'ASSIGNMENT'
  | 'RESOURCE_UPDATE'
  | 'SHELTER_UPDATE'
  | 'HOSPITAL_UPDATE'
  | 'SYSTEM'
  | 'AI_RECOMMENDATION'
  | 'VOLUNTEER_REQUEST'
  | 'RELIEF_UPDATE';

// Entity Models
export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string | null;
  avatarUrl?: string | null;
  roles: UserRole[];
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface Disaster {
  id: string;
  title: string;
  description: string;
  type: DisasterType;
  severity: DisasterSeverity;
  status: DisasterStatus;
  latitude: number;
  longitude: number;
  address?: string | null;
  affectedRadiusKm: number;
  reportedById?: string | null;
  reportedByName?: string | null;
  startedAt: string;
  endedAt?: string | null;
  updatesCount?: number;
  sosCount?: number;
  activeTeamsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DisasterUpdate {
  id: string;
  disasterId: string;
  updateText: string;
  severityChange?: DisasterSeverity | null;
  postedById?: string | null;
  postedByName?: string | null;
  createdAt: string;
}

export interface SosRequest {
  id: string;
  citizenId?: string | null;
  citizenName?: string | null;
  disasterId?: string | null;
  disasterTitle?: string | null;
  type: SosType;
  description: string;
  severity: PriorityLevel;
  latitude: number;
  longitude: number;
  address?: string | null;
  status: SosStatus;
  assignedTeamId?: string | null;
  assignedTeamName?: string | null;
  contactPhone?: string | null;
  peopleCount: number;
  medicalNeeds?: string | null;
  isDuplicate?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RescueTeam {
  id: string;
  name: string;
  leaderId?: string | null;
  leaderName?: string | null;
  status: RescueTeamStatus;
  latitude?: number | null;
  longitude?: number | null;
  capacity: number;
  specialization: RescueTeamSpecialization;
  contactNumber?: string | null;
  equipment?: string[];
  membersCount?: number;
  activeAssignmentsCount?: number;
  createdAt: string;
}

export interface Ngo {
  id: string;
  name: string;
  registrationNumber: string;
  description?: string | null;
  adminId?: string | null;
  verified: boolean;
  operationalStatus: NgoOperationalStatus;
  capabilities: string[];
  contactEmail?: string | null;
  contactPhone?: string | null;
  address?: string | null;
  website?: string | null;
  operationalAreasCount?: number;
  activeTasksCount?: number;
  createdAt: string;
}

export interface ReliefTask {
  id: string;
  disasterId: string;
  disasterTitle?: string;
  ngoId?: string | null;
  ngoName?: string | null;
  title: string;
  description: string;
  type: ReliefTaskType;
  status: TaskStatus;
  latitude?: number | null;
  longitude?: number | null;
  areaName?: string | null;
  priority: PriorityLevel;
  createdAt: string;
  completedAt?: string | null;
}

export interface ResourceItem {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  description?: string | null;
  quantity: number;
  unit: string;
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
  ownerType: string;
  ownerName: string;
  status: ResourceStatus;
  updatedAt: string;
}

export interface Shelter {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  totalCapacity: number;
  currentOccupancy: number;
  status: ShelterStatus;
  facilities: string[];
  contactPhone?: string | null;
  contactEmail?: string | null;
  updatedAt: string;
}

export interface Hospital {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  totalBeds: number;
  availableBeds: number;
  icuBeds: number;
  availableIcu: number;
  specializations: string[];
  emergencyCapable: boolean;
  contactPhone?: string | null;
  contactEmail?: string | null;
  updatedAt: string;
}

export interface Volunteer {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string | null;
  skills: string[];
  availabilityStatus: VolunteerAvailability;
  verified: boolean;
  hoursContributed: number;
  address?: string | null;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

export interface AiRecommendationItem {
  id: string;
  type: string;
  contextId?: string | null;
  recommendation: Record<string, any>;
  confidence: number;
  explanation: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  modelVersion: string;
  createdAt: string;
}

// --------------------------------------------------------------------------
// ADVANCED LIFECYCLE, POPULATION, VERIFICATION & LOGISTICS EXTENSIONS
// --------------------------------------------------------------------------

export type DeliveryStatus =
  | 'REQUESTED'
  | 'VERIFIED'
  | 'ASSIGNED'
  | 'ACCEPTED'
  | 'DISPATCHED'
  | 'DELIVERED'
  | 'CONFIRMED';

export interface DeliverySupplyItem {
  item: string;
  quantity: number;
  unit: string;
  batchNumber?: string;
  expiryDate?: string;
}

export interface DeliveryRecord {
  id: string;
  sosId: string;
  disasterId: string;
  ngoId: string;
  ngoName: string;
  recipientName: string;
  recipientAddress: string;
  recipientCoords: [number, number];
  recipientPhone: string;
  supplies: DeliverySupplyItem[];
  status: DeliveryStatus;
  dispatchedAt?: string | null;
  deliveredAt?: string | null;
  confirmedAt?: string | null;
  responsiblePersonnel: string;
  vehicleRegistration?: string | null;
  deliveryEvidenceUrl?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type IncidentVerificationStatus =
  | 'UNVERIFIED'
  | 'VERIFICATION_PENDING'
  | 'VERIFICATION_IN_PROGRESS'
  | 'VERIFIED'
  | 'REJECTED'
  | 'DUPLICATE_SUSPECTED'
  | 'ESCALATED'
  | 'RESOLVED';

export interface VerificationAuditRecord {
  id: string;
  incidentId: string;
  previousStatus: IncidentVerificationStatus;
  newStatus: IncidentVerificationStatus;
  verifiedById: string;
  verifiedByName: string;
  evidenceNotes: string;
  timestamp: string;
}

export interface PopulationExposureRecord {
  id: string;
  district: string;
  state: string;
  totalResidentialPop: number;
  estimatedExposedPop: number;
  verifiedAffectedPop: number;
  confirmedAssistedPop: number;
  confidenceScore: number;
  dataSource: string;
  vintageYear: number;
  lastUpdated: string;
  vulnerabilityBreakdown: {
    elderly: number;
    children: number;
    medicalNeeds: number;
  };
}

export interface ReliefGapRecord {
  id: string;
  sectorId: string;
  sectorName: string;
  district: string;
  coordinates: [number, number];
  exposedPop: number;
  unfulfilledRequestsCount: number;
  deliveredSuppliesPercent: number;
  assignedNgosCount: number;
  severityLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  gapType: 'FOOD' | 'WATER' | 'MEDICAL' | 'SHELTER' | 'NO_NGO_ASSIGNED';
  recommendations: string;
  lastAssessedAt: string;
}

export interface FieldMission {
  id: string;
  sosId: string;
  teamId: string;
  teamName: string;
  title: string;
  priority: 'CRITICAL' | 'HIGH' | 'MODERATE';
  targetAddress: string;
  coordinates: [number, number];
  peopleCount: number;
  status: 'ASSIGNED' | 'ACCEPTED' | 'EN_ROUTE' | 'ON_SCENE' | 'RESCUED' | 'COMPLETED';
  tacticalOrders: string;
  hazards: string[];
  arrivalConfirmedAt?: string | null;
  completedAt?: string | null;
  evidenceNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NgoSurplusItem {
  id: string;
  ngoId: string;
  ngoName: string;
  item: string;
  category: 'FOOD' | 'WATER' | 'MEDICAL' | 'SHELTER' | 'RESCUE_GEAR';
  quantity: number;
  unit: string;
  storageWarehouse: string;
  expiryDate?: string;
  status: 'OFFERED' | 'CLAIMED' | 'IN_TRANSIT' | 'TRANSFERRED';
  contactPerson: string;
  contactPhone: string;
  createdAt: string;
}

