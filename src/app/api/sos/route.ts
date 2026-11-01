import { NextResponse } from "next/server";
import { db } from "@/lib/data-store";
import { SosRequest } from "@/types";
import { classifySosUrgency } from "@/lib/ai";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const severity = searchParams.get("severity");
    const disasterId = searchParams.get("disasterId");
    const type = searchParams.get("type");

    let results = [...db.sosRequests];

    if (status) {
      results = results.filter((s) => s.status.toLowerCase() === status.toLowerCase());
    }

    if (severity) {
      results = results.filter((s) => s.severity.toLowerCase() === severity.toLowerCase());
    }

    if (disasterId) {
      results = results.filter((s) => s.disasterId === disasterId);
    }

    if (type) {
      results = results.filter((s) => s.type.toLowerCase() === type.toLowerCase());
    }

    return NextResponse.json({
      success: true,
      data: results,
      meta: { total: results.length },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      disasterId,
      type,
      description,
      latitude,
      longitude,
      address,
      contactPhone,
      peopleCount,
      medicalNeeds,
      citizenName,
    } = body;

    if (!type || !description || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Emergency type, description, and GPS coordinates are required" } },
        { status: 400 }
      );
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const count = parseInt(peopleCount, 10) || 1;

    // Run AI Urgency Classification
    const aiUrgency = await classifySosUrgency(description, count, medicalNeeds);

    // Run Duplicate SOS Check
    const duplicateCheck = db.detectDuplicates({
      latitude: lat,
      longitude: lng,
      type,
      description,
    });

    const newSos: SosRequest = {
      id: `sos-${Date.now().toString().slice(-4)}`,
      citizenId: "usr-citizen-1",
      citizenName: citizenName || "Citizen (Direct App SOS)",
      disasterId: disasterId || "dis-001",
      disasterTitle: "Cyclone Varuna — Coastal Inundation",
      type,
      description,
      severity: aiUrgency.urgency,
      latitude: lat,
      longitude: lng,
      address: address || "GPS Geo-Tagged Location",
      status: "PENDING",
      assignedTeamId: null,
      assignedTeamName: null,
      contactPhone: contactPhone || "+91-99999-00000",
      peopleCount: count,
      medicalNeeds: medicalNeeds || null,
      isDuplicate: duplicateCheck.isDuplicate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.sosRequests.unshift(newSos);

    // Create immediate push notification to emergency commanders
    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: "usr-admin-1",
      type: "SOS_UPDATE",
      title: `⚡ New SOS Received: ${newSos.type} (${newSos.severity})`,
      message: `${newSos.peopleCount} person(s) at ${newSos.address}. Needs: ${newSos.description.slice(0, 80)}...`,
      data: {
        sosId: newSos.id,
        severity: newSos.severity,
        isDuplicate: newSos.isDuplicate,
        recommendedTeam: aiUrgency.recommendedTeamSpecialization,
      },
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          sos: newSos,
          aiTriage: {
            assignedSeverity: aiUrgency.urgency,
            recommendedTeam: aiUrgency.recommendedTeamSpecialization,
            confidence: aiUrgency.confidence,
            duplicateFlag: duplicateCheck,
          },
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
