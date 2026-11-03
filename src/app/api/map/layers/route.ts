import { NextResponse } from "next/server";
import { db } from "@/lib/data-store";

export async function GET() {
  try {
    const disasters = db.disasters.map((d) => ({
      id: d.id,
      title: d.title,
      type: d.type,
      severity: d.severity,
      status: d.status,
      latitude: d.latitude,
      longitude: d.longitude,
      affectedRadiusKm: d.affectedRadiusKm,
      address: d.address,
    }));

    const sosMarkers = db.sosRequests.map((s) => ({
      id: s.id,
      type: s.type,
      severity: s.severity,
      status: s.status,
      latitude: s.latitude,
      longitude: s.longitude,
      address: s.address,
      description: s.description,
      peopleCount: s.peopleCount,
      medicalNeeds: s.medicalNeeds,
      citizenName: s.citizenName,
      contactPhone: s.contactPhone,
      assignedTeamId: s.assignedTeamId,
      assignedTeamName: s.assignedTeamName,
      isDuplicate: s.isDuplicate,
      disasterId: s.disasterId,
      disasterTitle: s.disasterTitle,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }));

    const rescueTeams = db.rescueTeams
      .filter((t) => t.latitude !== null && t.longitude !== null)
      .map((t) => ({
        id: t.id,
        name: t.name,
        status: t.status,
        specialization: t.specialization,
        latitude: t.latitude,
        longitude: t.longitude,
        capacity: t.capacity,
      }));

    const shelters = db.shelters.map((s) => ({
      id: s.id,
      name: s.name,
      status: s.status,
      latitude: s.latitude,
      longitude: s.longitude,
      totalCapacity: s.totalCapacity,
      currentOccupancy: s.currentOccupancy,
      occupancyPercent: Math.round((s.currentOccupancy / s.totalCapacity) * 100),
      facilities: s.facilities,
    }));

    const hospitals = db.hospitals.map((h) => ({
      id: h.id,
      name: h.name,
      latitude: h.latitude,
      longitude: h.longitude,
      totalBeds: h.totalBeds,
      availableBeds: h.availableBeds,
      icuBeds: h.icuBeds,
      availableIcu: h.availableIcu,
      emergencyCapable: h.emergencyCapable,
    }));

    return NextResponse.json({
      success: true,
      data: {
        disasters,
        sos: sosMarkers,
        rescueTeams,
        allRescueTeams: db.rescueTeams.map((t) => ({
          id: t.id,
          name: t.name,
          specialization: t.specialization,
          status: t.status,
          contactNumber: t.contactNumber,
        })),
        shelters,
        hospitals,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
