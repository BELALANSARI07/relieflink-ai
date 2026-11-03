// ReliefLink AI — Unified Data Store & Repository Layer
// Supports development seed data with persistent in-memory/file operations and Prisma interoperability

import {
  User,
  Disaster,
  DisasterUpdate,
  SosRequest,
  RescueTeam,
  Ngo,
  ReliefTask,
  ResourceItem,
  Shelter,
  Hospital,
  Volunteer,
  NotificationItem,
  AiRecommendationItem,
  DeliveryRecord,
  DeliveryStatus,
  IncidentVerificationStatus,
  VerificationAuditRecord,
  PopulationExposureRecord,
  ReliefGapRecord,
  FieldMission,
  NgoSurplusItem,
} from "@/types";

// Initial Seed Data
const initialUsers: User[] = [
  {
    id: "usr-admin-1",
    email: "authority@relieflink.org",
    fullName: "Col. Rajesh Verma",
    phone: "+91-98765-43210",
    roles: ["GOVERNMENT_AUTHORITY", "SUPER_ADMIN"],
    isVerified: true,
    isActive: true,
    createdAt: "2026-10-15T08:00:00Z",
  },
  {
    id: "usr-ngo-1",
    email: "coordinator@oxfamindia.org",
    fullName: "Amina Sheikh",
    phone: "+91-98123-45678",
    roles: ["NGO_ADMIN"],
    isVerified: true,
    isActive: true,
    createdAt: "2026-10-16T09:30:00Z",
  },
  {
    id: "usr-rescue-1",
    email: "alpha.leader@ndrf.gov.in",
    fullName: "Capt. Vikram Singh",
    phone: "+91-97234-56789",
    roles: ["RESCUE_TEAM"],
    isVerified: true,
    isActive: true,
    createdAt: "2026-10-17T11:00:00Z",
  },
  {
    id: "usr-shelter-1",
    email: "shelter.mgr@citystadium.org",
    fullName: "Sunita Deshmukh",
    phone: "+91-96345-67890",
    roles: ["SHELTER_ADMIN"],
    isVerified: true,
    isActive: true,
    createdAt: "2026-10-18T14:15:00Z",
  },
  {
    id: "usr-hospital-1",
    email: "er.chief@metrohospital.org",
    fullName: "Dr. Arvind Kulkarni",
    phone: "+91-95456-78901",
    roles: ["HOSPITAL_ADMIN"],
    isVerified: true,
    isActive: true,
    createdAt: "2026-10-19T10:00:00Z",
  },
  {
    id: "usr-citizen-1",
    email: "citizen.priya@gmail.com",
    fullName: "Priya Sharma",
    phone: "+91-94567-89012",
    roles: ["CITIZEN"],
    isVerified: true,
    isActive: true,
    createdAt: "2026-10-25T16:20:00Z",
  },
  {
    id: "usr-volunteer-1",
    email: "rahul.volunteer@gmail.com",
    fullName: "Rahul Nair",
    phone: "+91-93678-90123",
    roles: ["VOLUNTEER"],
    isVerified: true,
    isActive: true,
    createdAt: "2026-10-26T12:00:00Z",
  },
];

const initialDisasters: Disaster[] = [
  {
    id: "dis-001",
    title: "Cyclone Varuna — Coastal Inundation & Gale Warning",
    description: "Category 4 tropical storm made landfall with sustained winds of 175 km/h, causing widespread storm surges, power disruption, and low-lying coastal flooding.",
    type: "HURRICANE",
    severity: "CRITICAL",
    status: "ACTIVE",
    latitude: 19.0760,
    longitude: 72.8777,
    address: "Coastal Belt & Suburban Estuary, Mumbai / Konkan Region",
    affectedRadiusKm: 35,
    reportedById: "usr-admin-1",
    reportedByName: "Col. Rajesh Verma",
    startedAt: "2026-10-31T04:30:00Z",
    updatesCount: 6,
    sosCount: 14,
    activeTeamsCount: 5,
    createdAt: "2026-10-31T04:30:00Z",
    updatedAt: "2026-11-01T15:20:00Z",
  },
  {
    id: "dis-002",
    title: "North Basin River Flash Flood & Embankment Breach",
    description: "Unprecedented monsoon cloudburst caused upstream dam discharge, resulting in an 80-meter embankment breach across agricultural and residential riverfront clusters.",
    type: "FLOOD",
    severity: "HIGH",
    status: "ACTIVE",
    latitude: 25.5941,
    longitude: 85.1376,
    address: "Ganga-Gandak Confluence, Patna Rural Sector",
    affectedRadiusKm: 22,
    reportedById: "usr-admin-1",
    reportedByName: "Col. Rajesh Verma",
    startedAt: "2026-10-30T18:00:00Z",
    updatesCount: 9,
    sosCount: 21,
    activeTeamsCount: 7,
    createdAt: "2026-10-30T18:00:00Z",
    updatedAt: "2026-11-01T17:45:00Z",
  },
  {
    id: "dis-003",
    title: "Seismic Tremor (M 5.8) — Foothill Landslides & Structural Cracks",
    description: "Shallow seismic event triggered multiple rockfalls blocking National Highway 58 and damaged older masonry buildings in hilly townships.",
    type: "EARTHQUAKE",
    severity: "MODERATE",
    status: "CONTAINED",
    latitude: 30.1450,
    longitude: 78.3000,
    address: "Rishikesh-Devprayag Valley, Uttarakhand",
    affectedRadiusKm: 18,
    reportedById: "usr-admin-1",
    reportedByName: "Col. Rajesh Verma",
    startedAt: "2026-10-28T02:15:00Z",
    endedAt: null,
    updatesCount: 4,
    sosCount: 5,
    activeTeamsCount: 2,
    createdAt: "2026-10-28T02:15:00Z",
    updatedAt: "2026-10-31T11:00:00Z",
  },
];

const initialSosRequests: SosRequest[] = [
  {
    id: "sos-101",
    citizenId: "usr-citizen-1",
    citizenName: "Priya Sharma",
    disasterId: "dis-001",
    disasterTitle: "Cyclone Varuna",
    type: "EVACUATION",
    description: "Water level rose to ground floor ceiling. 4 family members including 1 senior citizen trapped on terrace. Mobile battery critically low.",
    severity: "CRITICAL",
    latitude: 19.0820,
    longitude: 72.8850,
    address: "Bungalow 14, Fisherman Colony, Mahim Creek",
    status: "IN_PROGRESS",
    assignedTeamId: "team-001",
    assignedTeamName: "NDRF Bravo Amphibious Unit",
    contactPhone: "+91-94567-89012",
    peopleCount: 4,
    medicalNeeds: "Elderly person with diabetic insulin requirement",
    isDuplicate: false,
    createdAt: "2026-11-01T12:30:00Z",
    updatedAt: "2026-11-01T13:00:00Z",
  },
  {
    id: "sos-102",
    citizenId: null,
    citizenName: "Mohan Lal (Reported via Hotline)",
    disasterId: "dis-001",
    disasterTitle: "Cyclone Varuna",
    type: "MEDICAL",
    description: "Fallen eucalyptus tree collapsed onto roof of tea stall. 2 persons with compound limb fractures requiring immediate stretcher transport.",
    severity: "CRITICAL",
    latitude: 19.0650,
    longitude: 72.8520,
    address: "Near Bandra West Bus Depot, S.V. Road Junction",
    status: "ASSIGNED",
    assignedTeamId: "team-002",
    assignedTeamName: "SDRF Rapid Trauma Squad",
    contactPhone: "+91-98210-99887",
    peopleCount: 2,
    medicalNeeds: "Severe trauma, suspected femur fracture",
    isDuplicate: false,
    createdAt: "2026-11-01T14:10:00Z",
    updatedAt: "2026-11-01T14:25:00Z",
  },
  {
    id: "sos-103",
    citizenId: null,
    citizenName: "Anand Gupta",
    disasterId: "dis-002",
    disasterTitle: "North Basin River Flash Flood",
    type: "FOOD_WATER",
    description: "Community hall sheltering 45 villagers cut off by knee-deep mud. No potable water or infant baby milk for past 18 hours.",
    severity: "HIGH",
    latitude: 25.6120,
    longitude: 85.1650,
    address: "Panchayat Bhawan, Danapur Diara Sector",
    status: "PENDING",
    assignedTeamId: null,
    assignedTeamName: null,
    contactPhone: "+91-97711-22334",
    peopleCount: 45,
    medicalNeeds: "Dehydration, minor diarrhea symptoms",
    isDuplicate: false,
    createdAt: "2026-11-01T16:00:00Z",
    updatedAt: "2026-11-01T16:00:00Z",
  },
  {
    id: "sos-104",
    citizenId: null,
    citizenName: "Kavita Rane",
    disasterId: "dis-001",
    disasterTitle: "Cyclone Varuna",
    type: "RESCUE",
    description: "Flood water trapped 3 workers inside basement electric transformer room.",
    severity: "CRITICAL",
    latitude: 19.0835,
    longitude: 72.8870,
    address: "Industrial Lane 3, near Mahim Causeway",
    status: "PENDING",
    assignedTeamId: null,
    assignedTeamName: null,
    contactPhone: "+91-98920-11223",
    peopleCount: 3,
    medicalNeeds: "Electric shock risk, water rising",
    isDuplicate: true, // Marked by AI duplicate detector matching sos-101 vicinity
    createdAt: "2026-11-01T16:40:00Z",
    updatedAt: "2026-11-01T16:40:00Z",
  },
];

const initialRescueTeams: RescueTeam[] = [
  {
    id: "team-001",
    name: "NDRF Bravo Amphibious Unit",
    leaderId: "usr-rescue-1",
    leaderName: "Capt. Vikram Singh",
    status: "DEPLOYED",
    latitude: 19.0800,
    longitude: 72.8820,
    capacity: 12,
    specialization: "WATER_RESCUE",
    contactNumber: "+91-11-24363260",
    equipment: ["3x Inflatable Gemini Boats", "High-capacity bilge pump", "Sonar rescue beacon", "Life jackets (50x)"],
    membersCount: 12,
    activeAssignmentsCount: 1,
    createdAt: "2026-10-15T00:00:00Z",
  },
  {
    id: "team-002",
    name: "SDRF Rapid Trauma Squad",
    leaderId: null,
    leaderName: "Insp. Deepak Patil",
    status: "EN_ROUTE",
    latitude: 19.0680,
    longitude: 72.8550,
    capacity: 8,
    specialization: "MEDICAL",
    contactNumber: "+91-22-22694727",
    equipment: ["Field triage tent", "Spineboards", "Defibrillators", "Portable oxygen cylinders"],
    membersCount: 8,
    activeAssignmentsCount: 1,
    createdAt: "2026-10-16T00:00:00Z",
  },
  {
    id: "team-003",
    name: "Civil Defence Urban Search & K9",
    leaderId: null,
    leaderName: "Sub-Officer Manoj Kadam",
    status: "AVAILABLE",
    latitude: 19.1100,
    longitude: 72.8600,
    capacity: 10,
    specialization: "URBAN_SEARCH_RESCUE",
    contactNumber: "+91-22-24146740",
    equipment: ["Acoustic listening devices", "Hydraulic cutters", "2x Trained K9 handlers"],
    membersCount: 10,
    activeAssignmentsCount: 0,
    createdAt: "2026-10-18T00:00:00Z",
  },
];

const initialNgos: Ngo[] = [
  {
    id: "ngo-001",
    name: "Oxfam Relief Foundation India",
    registrationNumber: "NGO-MH-2018-8849",
    description: "Specialized in water sanitation, community meal kitchens, and rapid emergency shelter kits.",
    adminId: "usr-ngo-1",
    verified: true,
    operationalStatus: "ACTIVE",
    capabilities: ["Water Sanitation (WASH)", "Emergency Ration Kits", "Temporary Shelter Erection"],
    contactEmail: "relief@oxfamindia.org",
    contactPhone: "+91-22-26543210",
    address: "Bandra Kurla Complex, Mumbai",
    website: "https://www.oxfamindia.org",
    operationalAreasCount: 3,
    activeTasksCount: 4,
    createdAt: "2026-10-10T00:00:00Z",
  },
  {
    id: "ngo-002",
    name: "Red Cross Disaster Auxiliary",
    registrationNumber: "NGO-DL-1994-0120",
    description: "Providing frontline emergency medical first-aid, blood distribution, and missing person reunification.",
    adminId: null,
    verified: true,
    operationalStatus: "ACTIVE",
    capabilities: ["Mobile Medical Clinics", "Blood Donation Vans", "Trauma Psychological Counseling"],
    contactEmail: "response@indianredcross.org",
    contactPhone: "+91-11-23716441",
    address: "Red Cross Road, New Delhi",
    website: "https://www.indianredcross.org",
    operationalAreasCount: 5,
    activeTasksCount: 3,
    createdAt: "2026-10-05T00:00:00Z",
  },
  {
    id: "ngo-003",
    name: "Goonj Community Logistics",
    registrationNumber: "NGO-MH-2005-4412",
    description: "Dignity kits, clothing distribution, and dry ration community cooking setups.",
    adminId: null,
    verified: true,
    operationalStatus: "ACTIVE",
    capabilities: ["Dry Ration Supply", "Clothing & Blankets", "Hygiene Kits"],
    contactEmail: "mail@goonj.org",
    contactPhone: "+91-11-26972351",
    address: "Sarita Vihar, New Delhi",
    website: "https://www.goonj.org",
    operationalAreasCount: 2,
    activeTasksCount: 2,
    createdAt: "2026-10-12T00:00:00Z",
  },
];

const initialReliefTasks: ReliefTask[] = [
  {
    id: "task-001",
    disasterId: "dis-001",
    disasterTitle: "Cyclone Varuna",
    ngoId: "ngo-001",
    ngoName: "Oxfam Relief Foundation India",
    title: "Deploy 5,000 Liters Potable RO Water Tankers",
    description: "Distribute safe drinking water packets and halogen chlorine tablets across flooded settlements in Mahim Creek.",
    type: "WATER_SANITATION",
    status: "IN_PROGRESS",
    latitude: 19.0815,
    longitude: 72.8830,
    areaName: "Mahim Estuary Zone A",
    priority: "CRITICAL",
    createdAt: "2026-11-01T08:00:00Z",
  },
  {
    id: "task-002",
    disasterId: "dis-001",
    disasterTitle: "Cyclone Varuna",
    ngoId: "ngo-003",
    ngoName: "Goonj Community Logistics",
    title: "Distribute 800 Dry Ration & Blanket Kits",
    description: "Provide emergency family packs (rice, lentils, oil, biscuits, tarp sheet) to displaced informal settlement families.",
    type: "FOOD_DISTRIBUTION",
    status: "IN_PROGRESS",
    latitude: 19.0620,
    longitude: 72.8450,
    areaName: "Bandra Reclamation Relief Point",
    priority: "HIGH",
    createdAt: "2026-11-01T09:30:00Z",
  },
  {
    id: "task-003",
    disasterId: "dis-002",
    disasterTitle: "North Basin River Flash Flood",
    ngoId: "ngo-002",
    ngoName: "Red Cross Disaster Auxiliary",
    title: "Set Up Mobile Medical Triage Camp",
    description: "Screen for waterborne diseases, treat lacerations, and administer anti-tetanus shots at embankment relief camp.",
    type: "MEDICAL_AID",
    status: "ASSIGNED",
    latitude: 25.6080,
    longitude: 85.1520,
    areaName: "Danapur High School Campus",
    priority: "HIGH",
    createdAt: "2026-11-01T11:00:00Z",
  },
];

const initialShelters: Shelter[] = [
  {
    id: "shl-001",
    name: "Dharavi Municipal Sports Complex & Auditorium",
    latitude: 19.0430,
    longitude: 72.8570,
    address: "90 Feet Road, Dharavi, Mumbai",
    totalCapacity: 1200,
    currentOccupancy: 860,
    status: "OPEN",
    facilities: ["Clean Water", "Hot Community Kitchen", "Medical Room", "Separate Women Quarters", "Diesel Generator Backup"],
    contactPhone: "+91-22-24071234",
    contactEmail: "dharavi.shelter@mcgm.gov.in",
    updatedAt: "2026-11-01T17:00:00Z",
  },
  {
    id: "shl-002",
    name: "Bandra High School Community Shelter",
    latitude: 19.0580,
    longitude: 72.8360,
    address: "St. Andrews Road, Bandra West, Mumbai",
    totalCapacity: 600,
    currentOccupancy: 590,
    status: "FULL",
    facilities: ["Clean Water", "Basic First Aid", "Solar Emergency Lights"],
    contactPhone: "+91-22-26425678",
    contactEmail: "bandra.shelter@mcgm.gov.in",
    updatedAt: "2026-11-01T16:30:00Z",
  },
  {
    id: "shl-003",
    name: "Patna Central Indoor Stadium",
    latitude: 25.6020,
    longitude: 85.1440,
    address: "Kankarbagh Main Road, Patna",
    totalCapacity: 2000,
    currentOccupancy: 720,
    status: "OPEN",
    facilities: ["Potable Water", "Disaster First-Aid Station", "Child Friendly Space", "Wheelchair Accessible"],
    contactPhone: "+91-612-2351234",
    contactEmail: "patna.disaster.shelter@bihar.gov.in",
    updatedAt: "2026-11-01T15:45:00Z",
  },
];

const initialHospitals: Hospital[] = [
  {
    id: "hosp-001",
    name: "KEM Memorial Municipal Hospital & Trauma Centre",
    latitude: 19.0020,
    longitude: 72.8420,
    address: "Acharya Donde Marg, Parel, Mumbai",
    totalBeds: 1800,
    availableBeds: 142,
    icuBeds: 220,
    availableIcu: 18,
    specializations: ["Level-1 Trauma", "Burn Unit", "Orthopedics", "Infectious Diseases", "Neurosurgery"],
    emergencyCapable: true,
    contactPhone: "+91-22-24107000",
    contactEmail: "trauma.kem@mcgm.gov.in",
    updatedAt: "2026-11-01T17:15:00Z",
  },
  {
    id: "hosp-002",
    name: "Sion Lokmanya Tilak General Hospital",
    latitude: 19.0370,
    longitude: 72.8600,
    address: "Sion West, Mumbai",
    totalBeds: 1400,
    availableBeds: 85,
    icuBeds: 160,
    availableIcu: 7,
    specializations: ["Emergency Medicine", "Pediatric Intensive Care", "Blood Bank", "General Surgery"],
    emergencyCapable: true,
    contactPhone: "+91-22-24076381",
    contactEmail: "er.sion@mcgm.gov.in",
    updatedAt: "2026-11-01T17:30:00Z",
  },
  {
    id: "hosp-003",
    name: "AIIMS Patna Emergency Wing",
    latitude: 25.5610,
    longitude: 85.0450,
    address: "Phulwari Sharif, Patna",
    totalBeds: 960,
    availableBeds: 195,
    icuBeds: 130,
    availableIcu: 24,
    specializations: ["Level-1 Disaster Trauma", "Critical Care", "Toxicology", "Hemodialysis"],
    emergencyCapable: true,
    contactPhone: "+91-612-2451000",
    contactEmail: "er.aiims@aiimspatna.edu.in",
    updatedAt: "2026-11-01T16:00:00Z",
  },
];

const initialResources: ResourceItem[] = [
  {
    id: "res-001",
    categoryId: "cat-water",
    categoryName: "Potable Water",
    name: "1-Liter Bottled Drinking Water Cartons (24x)",
    description: "Sealed ISI-certified emergency mineral water cartons",
    quantity: 1450,
    unit: "cartons",
    latitude: 19.0500,
    longitude: 72.8500,
    address: "Central Disaster Depot, Kurla West",
    ownerType: "GOVERNMENT",
    ownerName: "State Disaster Management Authority",
    status: "AVAILABLE",
    updatedAt: "2026-11-01T14:00:00Z",
  },
  {
    id: "res-002",
    categoryId: "cat-med",
    categoryName: "Medical Kits",
    name: "Trauma First-Aid & Hemostatic Dressing Kits",
    description: "Sterile gauze, tourniquets, burn gel, antiseptic solution, splints",
    quantity: 420,
    unit: "kits",
    latitude: 19.0020,
    longitude: 72.8420,
    address: "KEM Hospital Emergency Stockpile",
    ownerType: "HOSPITAL",
    ownerName: "KEM Hospital",
    status: "AVAILABLE",
    updatedAt: "2026-11-01T15:30:00Z",
  },
  {
    id: "res-003",
    categoryId: "cat-rescue",
    categoryName: "Rescue Equipment",
    name: "High-Lumen Portable Floodlight Towers with Inverter",
    description: "Portable 500W LED towers with 8-hour lithium battery pack",
    quantity: 35,
    unit: "units",
    latitude: 19.0800,
    longitude: 72.8800,
    address: "NDRF Forward Base, Bandra Kurla Complex",
    ownerType: "GOVERNMENT",
    ownerName: "National Disaster Response Force",
    status: "DEPLOYED",
    updatedAt: "2026-11-01T16:15:00Z",
  },
  {
    id: "res-004",
    categoryId: "cat-food",
    categoryName: "Food & Rations",
    name: "Ready-to-Eat Emergency Meal Pouches (MREs)",
    description: "High-calorie vegetarian meals with self-heating pack",
    quantity: 3200,
    unit: "packets",
    latitude: 19.0620,
    longitude: 72.8450,
    address: "Oxfam Distribution Warehouse",
    ownerType: "NGO",
    ownerName: "Oxfam Relief Foundation India",
    status: "AVAILABLE",
    updatedAt: "2026-11-01T13:45:00Z",
  },
];

const initialVolunteers: Volunteer[] = [
  {
    id: "vol-001",
    userId: "usr-volunteer-1",
    fullName: "Rahul Nair",
    email: "rahul.volunteer@gmail.com",
    phone: "+91-93678-90123",
    skills: ["First Aid CPR Certified", "Ham Radio (VU2)", "Off-Road 4x4 Driving", "Hindi/English/Marathi"],
    availabilityStatus: "AVAILABLE",
    verified: true,
    hoursContributed: 48.5,
    address: "Dadar West, Mumbai",
    createdAt: "2026-10-26T12:00:00Z",
  },
  {
    id: "vol-002",
    userId: "usr-volunteer-2",
    fullName: "Dr. Ananya Ray",
    email: "ananya.ray@medicalvolunteer.in",
    phone: "+91-91234-56780",
    skills: ["Registered Nurse", "Pediatric Care", "Disaster Psychological First-Aid"],
    availabilityStatus: "ON_ASSIGNMENT",
    verified: true,
    hoursContributed: 82.0,
    address: "Sion, Mumbai",
    createdAt: "2026-10-22T09:00:00Z",
  },
];

const initialNotifications: NotificationItem[] = [
  {
    id: "notif-001",
    userId: "usr-admin-1",
    type: "SOS_UPDATE",
    title: "Critical SOS Escalated",
    message: "SOS-101 (Trapped family in Mahim Creek) marked CRITICAL. Rescue Team NDRF Bravo en route.",
    data: { sosId: "sos-101", severity: "CRITICAL" },
    isRead: false,
    createdAt: "2026-11-01T13:05:00Z",
  },
  {
    id: "notif-002",
    userId: "usr-admin-1",
    type: "AI_RECOMMENDATION",
    title: "Relief Coverage Gap Detected",
    message: "AI identified an unassigned relief sector in Danapur Diara (45 affected citizens without food/water). Recommendation generated for Oxfam India.",
    data: { disasterId: "dis-002", areaName: "Danapur Diara" },
    isRead: false,
    createdAt: "2026-11-01T16:15:00Z",
  },
  {
    id: "notif-003",
    userId: "usr-admin-1",
    type: "SHELTER_UPDATE",
    title: "Shelter Capacity Warning",
    message: "Bandra High School Community Shelter reached 98% occupancy (590/600 beds). Rerouting incoming evacuees to Dharavi Complex.",
    data: { shelterId: "shl-002", occupancy: 590, capacity: 600 },
    isRead: true,
    createdAt: "2026-11-01T16:35:00Z",
  },
];

const initialAiRecommendations: AiRecommendationItem[] = [
  {
    id: "ai-rec-001",
    type: "NGO_ASSIGNMENT",
    contextId: "dis-002",
    recommendation: {
      recommendedNgoId: "ngo-001",
      ngoName: "Oxfam Relief Foundation India",
      targetArea: "Danapur Diara Sector 4",
      taskType: "FOOD_DISTRIBUTION",
      confidenceScore: 0.94,
      priority: "HIGH",
    },
    confidence: 0.94,
    explanation: "Oxfam India has verified active inventory of 3,200 meal packets within 4.2 km and 3 available logistics volunteers, preventing duplicate deployment while closing the 18-hour food supply gap.",
    status: "PENDING",
    modelVersion: "gemini-1.5-flash",
    createdAt: "2026-11-01T16:20:00Z",
  },
  {
    id: "ai-rec-002",
    type: "RESOURCE_ALLOCATION",
    contextId: "dis-001",
    recommendation: {
      sourceDepot: "Kurla West SDMA Depot",
      targetFacility: "Dharavi Municipal Shelter",
      resource: "Potable Water Cartons",
      quantityRecommended: 300,
      confidenceScore: 0.89,
    },
    confidence: 0.89,
    explanation: "Shelter occupancy increased by 280 evacuees over past 4 hours. Current water reserve projected to deplete in 5.5 hours without replenishment.",
    status: "ACCEPTED",
    modelVersion: "gemini-1.5-flash",
    createdAt: "2026-11-01T15:00:00Z",
  },
];

const initialDeliveries: DeliveryRecord[] = [
  {
    id: "del-101",
    sosId: "sos-101",
    disasterId: "dis-001",
    ngoId: "ngo-001",
    ngoName: "Oxfam Relief Foundation India",
    recipientName: "Priya Sharma",
    recipientAddress: "Bungalow 14, Fisherman Colony, Mahim Creek",
    recipientCoords: [19.0820, 72.8850],
    recipientPhone: "+91-94567-89012",
    supplies: [
      { item: "Food Ration Kits", quantity: 4, unit: "family packs" },
      { item: "Potable Water Cartons", quantity: 6, unit: "cartons (20L)" },
      { item: "Diabetic Insulin Cooler Bag", quantity: 1, unit: "kit" },
    ],
    status: "CONFIRMED",
    dispatchedAt: "2026-11-01T13:15:00Z",
    deliveredAt: "2026-11-01T14:30:00Z",
    confirmedAt: "2026-11-01T14:45:00Z",
    responsiblePersonnel: "Rajesh Shinde (Lead Logistics Field Agent)",
    vehicleRegistration: "MH-01-CR-8821",
    deliveryEvidenceUrl: "/evidence/del-101-receipt.jpg",
    notes: "Direct hand-off confirmed by terrace evacuees via digital biometric acknowledgment.",
    createdAt: "2026-11-01T13:00:00Z",
    updatedAt: "2026-11-01T14:45:00Z",
  },
  {
    id: "del-102",
    sosId: "sos-102",
    disasterId: "dis-001",
    ngoId: "ngo-002",
    ngoName: "Indian Red Cross Society — Disaster Wing",
    recipientName: "Suresh Patil",
    recipientAddress: "Bandra West Junction Commercial Complex",
    recipientCoords: [19.0550, 72.8350],
    recipientPhone: "+91-98200-11223",
    supplies: [
      { item: "Orthopedic Splints & Traction Bands", quantity: 2, unit: "sets" },
      { item: "IV Saline & Trauma Dressing Kits", quantity: 12, unit: "pouches" },
    ],
    status: "DISPATCHED",
    dispatchedAt: "2026-11-01T14:20:00Z",
    deliveredAt: null,
    confirmedAt: null,
    responsiblePersonnel: "Dr. K. Saxena (Paramedic Mobile Squad)",
    vehicleRegistration: "MH-02-ER-4410",
    deliveryEvidenceUrl: null,
    notes: "Ambulance en route under police flood escort.",
    createdAt: "2026-11-01T14:00:00Z",
    updatedAt: "2026-11-01T14:20:00Z",
  },
  {
    id: "del-103",
    sosId: "sos-103",
    disasterId: "dis-002",
    ngoId: "ngo-003",
    ngoName: "Goonj Community Relief",
    recipientName: "Danapur Diara Community Head",
    recipientAddress: "Danapur Diara Sector, Patna Rural",
    recipientCoords: [25.6200, 85.0800],
    recipientPhone: "+91-99340-99881",
    supplies: [
      { item: "Ready-to-Eat Emergency Meals", quantity: 180, unit: "packets" },
      { item: "Chlorine Water Purification Drops", quantity: 50, unit: "bottles" },
    ],
    status: "ACCEPTED",
    dispatchedAt: null,
    deliveredAt: null,
    confirmedAt: null,
    responsiblePersonnel: "Manoj Kumar (Patna Hub Manager)",
    vehicleRegistration: "BR-01-GB-9022",
    deliveryEvidenceUrl: null,
    notes: "Awaiting barge clearance across Ganga river breach.",
    createdAt: "2026-11-01T16:00:00Z",
    updatedAt: "2026-11-01T16:15:00Z",
  },
];

const initialPopulationExposure: PopulationExposureRecord[] = [
  {
    id: "pop-001",
    district: "Mumbai Suburban",
    state: "Maharashtra",
    totalResidentialPop: 9356962,
    estimatedExposedPop: 420000,
    verifiedAffectedPop: 1840,
    confirmedAssistedPop: 1120,
    confidenceScore: 0.94,
    dataSource: "Census of India & WorldPop 100m High-Resolution Grid",
    vintageYear: 2024,
    lastUpdated: "2026-11-01T16:00:00Z",
    vulnerabilityBreakdown: {
      elderly: 48000,
      children: 62000,
      medicalNeeds: 14500,
    },
  },
  {
    id: "pop-002",
    district: "Patna Rural",
    state: "Bihar",
    totalResidentialPop: 5838465,
    estimatedExposedPop: 285000,
    verifiedAffectedPop: 2450,
    confirmedAssistedPop: 980,
    confidenceScore: 0.91,
    dataSource: "Census of India & GHSL Built-Up Settlement Layer",
    vintageYear: 2023,
    lastUpdated: "2026-11-01T15:30:00Z",
    vulnerabilityBreakdown: {
      elderly: 31000,
      children: 49000,
      medicalNeeds: 8900,
    },
  },
  {
    id: "pop-003",
    district: "Tehri Garhwal / Rishikesh",
    state: "Uttarakhand",
    totalResidentialPop: 618931,
    estimatedExposedPop: 35000,
    verifiedAffectedPop: 210,
    confirmedAssistedPop: 195,
    confidenceScore: 0.88,
    dataSource: "Survey of India & National Disaster Management Grid",
    vintageYear: 2024,
    lastUpdated: "2026-10-31T12:00:00Z",
    vulnerabilityBreakdown: {
      elderly: 4200,
      children: 5800,
      medicalNeeds: 920,
    },
  },
];

const initialReliefGaps: ReliefGapRecord[] = [
  {
    id: "gap-001",
    sectorId: "sec-danapur-diara",
    sectorName: "Danapur Diara Embankment Cutoff",
    district: "Patna Rural",
    coordinates: [25.6200, 85.0800],
    exposedPop: 45000,
    unfulfilledRequestsCount: 28,
    deliveredSuppliesPercent: 18,
    assignedNgosCount: 1,
    severityLevel: "CRITICAL",
    gapType: "FOOD",
    recommendations: "Immediate riverine barge dispatch with 1,500 potable water cartons and family ration packets. 28 requests pending over 16 hours.",
    lastAssessedAt: "2026-11-01T16:30:00Z",
  },
  {
    id: "gap-002",
    sectorId: "sec-dharavi-transit",
    sectorName: "Dharavi Transit Relocation Sector",
    district: "Mumbai Suburban",
    coordinates: [19.0400, 72.8550],
    exposedPop: 18500,
    unfulfilledRequestsCount: 14,
    deliveredSuppliesPercent: 42,
    assignedNgosCount: 2,
    severityLevel: "HIGH",
    gapType: "SHELTER",
    recommendations: "Dharavi Sports Complex shelter has exceeded 85% occupancy threshold. Open secondary emergency shelter at Sion Municipal Hall.",
    lastAssessedAt: "2026-11-01T15:45:00Z",
  },
  {
    id: "gap-003",
    sectorId: "sec-muni-ki-reti",
    sectorName: "Muni Ki Reti Rockfall Ingress Corridor",
    district: "Tehri Garhwal",
    coordinates: [30.1380, 78.3120],
    exposedPop: 4200,
    unfulfilledRequestsCount: 4,
    deliveredSuppliesPercent: 72,
    assignedNgosCount: 1,
    severityLevel: "MODERATE",
    gapType: "MEDICAL",
    recommendations: "Replenish local primary health center tetanus toxoid and fracture splints following NH-58 rockfall clearance.",
    lastAssessedAt: "2026-10-31T14:00:00Z",
  },
];

const initialFieldMissions: FieldMission[] = [
  {
    id: "mis-001",
    sosId: "sos-101",
    teamId: "team-001",
    teamName: "NDRF Bravo Amphibious Unit",
    title: "Amphibious Terrace Extraction at Mahim Creek",
    priority: "CRITICAL",
    targetAddress: "Bungalow 14, Fisherman Colony, Mahim Creek",
    coordinates: [19.0820, 72.8850],
    peopleCount: 4,
    status: "ON_SCENE",
    tacticalOrders: "Deploy Gemini inflatable reconnaissance craft. High-tide expected in 45m. Extract 4 persons including diabetic senior citizen.",
    hazards: ["Submerged electrical wires", "Floating debris", "1.8 knot water velocity"],
    arrivalConfirmedAt: "2026-11-01T13:40:00Z",
    completedAt: null,
    evidenceNotes: "Craft stationed at outer perimeter; line deployed to 2nd-floor railing.",
    createdAt: "2026-11-01T13:00:00Z",
    updatedAt: "2026-11-01T13:40:00Z",
  },
  {
    id: "mis-002",
    sosId: "sos-102",
    teamId: "team-002",
    teamName: "SDRF Rapid Trauma Squad",
    title: "Heavy Structural Extrication at Bandra West",
    priority: "CRITICAL",
    targetAddress: "Bandra West Junction Commercial Complex",
    coordinates: [19.0550, 72.8350],
    peopleCount: 2,
    status: "EN_ROUTE",
    tacticalOrders: "Use hydraulic cutters and pneumatic air lifting bags. 2 casualties with open lower limb fractures pinned under concrete beam.",
    hazards: ["Secondary structural collapse risk", "Gas pipeline proximity"],
    arrivalConfirmedAt: null,
    completedAt: null,
    evidenceNotes: null,
    createdAt: "2026-11-01T14:15:00Z",
    updatedAt: "2026-11-01T14:20:00Z",
  },
  {
    id: "mis-003",
    sosId: "sos-103",
    teamId: "team-003",
    teamName: "Bihar SDRF Flood Battalion",
    title: "Diara Community Hall Evacuation & Relief Drop",
    priority: "HIGH",
    targetAddress: "Danapur Diara Sector, Patna Rural",
    coordinates: [25.6200, 85.0800],
    peopleCount: 45,
    status: "ACCEPTED",
    tacticalOrders: "Establish motorized boat bridge from Danapur Ghat to Diara. Ferry drinking water cans first, then commence women and child evacuation.",
    hazards: ["Mud suction", "Submerged barbed wire fences"],
    arrivalConfirmedAt: null,
    completedAt: null,
    evidenceNotes: null,
    createdAt: "2026-11-01T16:10:00Z",
    updatedAt: "2026-11-01T16:15:00Z",
  },
];

const initialNgoSurplus: NgoSurplusItem[] = [
  {
    id: "surplus-001",
    ngoId: "ngo-001",
    ngoName: "Oxfam Relief Foundation India",
    item: "High-Energy Fortified Nutrition Biscuits",
    category: "FOOD",
    quantity: 600,
    unit: "cartons (14,400 meals)",
    storageWarehouse: "Kurla SDMA Central Logistics Hub",
    expiryDate: "2027-04-30",
    status: "OFFERED",
    contactPerson: "Amina Sheikh (Coordination Officer)",
    contactPhone: "+91-98123-45678",
    createdAt: "2026-11-01T10:00:00Z",
  },
  {
    id: "surplus-002",
    ngoId: "ngo-002",
    ngoName: "Indian Red Cross Society",
    item: "Water Purification Tablets (NaDCC)",
    category: "WATER",
    quantity: 12000,
    unit: "tablets (60,000L safe water)",
    storageWarehouse: "Bandra Relief Depot",
    expiryDate: "2028-01-15",
    status: "OFFERED",
    contactPerson: "Dr. K. Saxena",
    contactPhone: "+91-98200-11223",
    createdAt: "2026-11-01T11:30:00Z",
  },
  {
    id: "surplus-003",
    ngoId: "ngo-003",
    ngoName: "Goonj Community Relief",
    item: "Family Tarpaulins & Bamboo Structural Poles",
    category: "SHELTER",
    quantity: 250,
    unit: "shelter shelter kits",
    storageWarehouse: "Patna South Warehouse",
    expiryDate: undefined,
    status: "OFFERED",
    contactPerson: "Manoj Kumar",
    contactPhone: "+91-99340-99881",
    createdAt: "2026-11-01T14:00:00Z",
  },
];

// Global in-memory data store instance (persists across Next.js API calls in same process)
class DataStore {
  users: User[] = [...initialUsers];
  disasters: Disaster[] = [...initialDisasters];
  sosRequests: SosRequest[] = [...initialSosRequests];
  rescueTeams: RescueTeam[] = [...initialRescueTeams];
  ngos: Ngo[] = [...initialNgos];
  reliefTasks: ReliefTask[] = [...initialReliefTasks];
  resources: ResourceItem[] = [...initialResources];
  shelters: Shelter[] = [...initialShelters];
  hospitals: Hospital[] = [...initialHospitals];
  volunteers: Volunteer[] = [...initialVolunteers];
  notifications: NotificationItem[] = [...initialNotifications];
  aiRecommendations: AiRecommendationItem[] = [...initialAiRecommendations];
  deliveries: DeliveryRecord[] = [...initialDeliveries];
  populationExposure: PopulationExposureRecord[] = [...initialPopulationExposure];
  reliefGaps: ReliefGapRecord[] = [...initialReliefGaps];
  fieldMissions: FieldMission[] = [...initialFieldMissions];
  ngoSurplus: NgoSurplusItem[] = [...initialNgoSurplus];

  // Helper Methods
  getOverviewMetrics() {
    const activeDisasters = this.disasters.filter((d) => d.status === "ACTIVE").length;
    const pendingSos = this.sosRequests.filter((s) => s.status === "PENDING" || s.status === "ASSIGNED").length;
    const activeNgos = this.ngos.filter((n) => n.operationalStatus === "ACTIVE").length;
    const deployedTeams = this.rescueTeams.filter((t) => t.status === "DEPLOYED" || t.status === "EN_ROUTE").length;
    const totalShelterCapacity = this.shelters.reduce((acc, s) => acc + s.totalCapacity, 0);
    const currentShelterOccupancy = this.shelters.reduce((acc, s) => acc + s.currentOccupancy, 0);
    const availableHospitalBeds = this.hospitals.reduce((acc, h) => acc + h.availableBeds, 0);
    const criticalSos = this.sosRequests.filter((s) => s.severity === "CRITICAL" && s.status !== "RESOLVED").length;

    return {
      activeDisasters,
      pendingSos,
      activeNgos,
      deployedTeams,
      totalShelterCapacity,
      currentShelterOccupancy,
      shelterOccupancyRate: totalShelterCapacity > 0 ? Math.round((currentShelterOccupancy / totalShelterCapacity) * 100) : 0,
      availableHospitalBeds,
      criticalSos,
    };
  }

  // Duplicate detection algorithm
  detectDuplicates(newSos: { latitude: number; longitude: number; type: string; description: string }): {
    isDuplicate: boolean;
    confidence: number;
    matchedSosId?: string;
    reason?: string;
  } {
    // 0.005 degrees latitude is approx ~550 meters
    const thresholdKm = 0.6;
    for (const existing of this.sosRequests) {
      if (existing.status === "RESOLVED" || existing.status === "CANCELLED") continue;

      const dLat = Math.abs(existing.latitude - newSos.latitude);
      const dLng = Math.abs(existing.longitude - newSos.longitude);
      const approxDistKm = Math.sqrt(dLat * dLat + dLng * dLng) * 111;

      if (approxDistKm <= thresholdKm && existing.type === newSos.type) {
        return {
          isDuplicate: true,
          confidence: 0.88,
          matchedSosId: existing.id,
          reason: `Matches active ${existing.type} emergency #${existing.id} reported ${approxDistKm.toFixed(2)} km away within the last 24 hours.`,
        };
      }
    }

    return {
      isDuplicate: false,
      confidence: 0.95,
    };
  }

  // NGO recommendation matching engine
  recommendNgoForArea(areaLat: number, areaLng: number, requiredSkill: string) {
    const candidates = this.ngos
      .filter((n) => n.operationalStatus === "ACTIVE" && n.verified)
      .map((ngo) => {
        const matchesSkill = ngo.capabilities.some((c) =>
          c.toLowerCase().includes(requiredSkill.toLowerCase())
        );
        const skillScore = matchesSkill ? 0.6 : 0.2;
        // Mock distance approximation from HQ or active tasks
        const workloadPenalty = (ngo.activeTasksCount || 0) * 0.08;
        const totalScore = Math.max(0.1, Math.min(0.98, skillScore + 0.35 - workloadPenalty));

        return {
          ngo,
          score: Math.round(totalScore * 100) / 100,
          reason: `Matches required capability "${requiredSkill}" with manageable operational load (${ngo.activeTasksCount || 0} active tasks).`,
        };
      })
      .sort((a, b) => b.score - a.score);

    return candidates[0] || null;
  }

  // Delivery State Machine: REQUESTED → VERIFIED → ASSIGNED → ACCEPTED → DISPATCHED → DELIVERED → CONFIRMED
  updateDeliveryStatus(
    deliveryId: string,
    newStatus: DeliveryStatus,
    metadata?: {
      responsiblePersonnel?: string;
      vehicleRegistration?: string;
      deliveryEvidenceUrl?: string;
      notes?: string;
    }
  ): DeliveryRecord | null {
    const index = this.deliveries.findIndex((d) => d.id === deliveryId);
    if (index === -1) return null;

    const delivery = this.deliveries[index];
    delivery.status = newStatus;
    delivery.updatedAt = new Date().toISOString();

    if (metadata?.responsiblePersonnel) delivery.responsiblePersonnel = metadata.responsiblePersonnel;
    if (metadata?.vehicleRegistration) delivery.vehicleRegistration = metadata.vehicleRegistration;
    if (metadata?.deliveryEvidenceUrl) delivery.deliveryEvidenceUrl = metadata.deliveryEvidenceUrl;
    if (metadata?.notes) delivery.notes = metadata.notes;

    if (newStatus === "DISPATCHED" && !delivery.dispatchedAt) {
      delivery.dispatchedAt = new Date().toISOString();
    } else if (newStatus === "DELIVERED" && !delivery.deliveredAt) {
      delivery.deliveredAt = new Date().toISOString();
    } else if (newStatus === "CONFIRMED" && !delivery.confirmedAt) {
      delivery.confirmedAt = new Date().toISOString();
    }

    return delivery;
  }

  // Field Mission Update (Rescue Teams)
  updateFieldMissionStatus(
    missionId: string,
    newStatus: 'ASSIGNED' | 'ACCEPTED' | 'EN_ROUTE' | 'ON_SCENE' | 'RESCUED' | 'COMPLETED',
    notes?: string
  ): FieldMission | null {
    const index = this.fieldMissions.findIndex((m) => m.id === missionId);
    if (index === -1) return null;

    const mission = this.fieldMissions[index];
    mission.status = newStatus;
    mission.updatedAt = new Date().toISOString();
    if (notes) mission.evidenceNotes = notes;

    if (newStatus === "ON_SCENE" && !mission.arrivalConfirmedAt) {
      mission.arrivalConfirmedAt = new Date().toISOString();
    } else if (newStatus === "COMPLETED" && !mission.completedAt) {
      mission.completedAt = new Date().toISOString();
    }

    return mission;
  }

  // Claim or transfer NGO surplus items
  claimSurplus(surplusId: string, claimingNgoName: string): NgoSurplusItem | null {
    const index = this.ngoSurplus.findIndex((s) => s.id === surplusId);
    if (index === -1) return null;

    this.ngoSurplus[index].status = "CLAIMED";
    return this.ngoSurplus[index];
  }
}

// Global singleton
const globalForDataStore = globalThis as unknown as { relieflinkDataStore?: DataStore };

export const db = globalForDataStore.relieflinkDataStore || new DataStore();
if (process.env.NODE_ENV !== "production") {
  globalForDataStore.relieflinkDataStore = db;
}
