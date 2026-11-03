import { NextResponse } from "next/server";
import { db } from "@/lib/data-store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get("teamId");

    let missions = [...db.fieldMissions];
    if (teamId) {
      missions = missions.filter((m) => m.teamId === teamId);
    }

    return NextResponse.json({
      success: true,
      data: missions,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { missionId, status, evidenceNotes } = body;

    if (!missionId || !status) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Mission ID and status are required" } },
        { status: 400 }
      );
    }

    const updated = db.updateFieldMissionStatus(missionId, status, evidenceNotes);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Mission not found" } },
        { status: 404 }
      );
    }

    // If mission completed, resolve the linked SOS
    if (status === "COMPLETED" && updated.sosId) {
      const sosIndex = db.sosRequests.findIndex((s) => s.id === updated.sosId);
      if (sosIndex !== -1) {
        db.sosRequests[sosIndex].status = "RESOLVED";
        db.sosRequests[sosIndex].updatedAt = new Date().toISOString();
      }
    }

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
