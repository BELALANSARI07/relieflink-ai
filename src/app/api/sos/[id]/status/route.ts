import { NextResponse } from "next/server";
import { db } from "@/lib/data-store";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, assignedTeamId } = body;

    const index = db.sosRequests.findIndex((s) => s.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "SOS request not found" } },
        { status: 404 }
      );
    }

    if (assignedTeamId) {
      const team = db.rescueTeams.find((t) => t.id === assignedTeamId);
      if (team) {
        db.sosRequests[index].assignedTeamId = team.id;
        db.sosRequests[index].assignedTeamName = team.name;
        db.sosRequests[index].status = "ASSIGNED";

        // Mark team status deployed
        const teamIndex = db.rescueTeams.findIndex((t) => t.id === assignedTeamId);
        if (teamIndex !== -1) {
          db.rescueTeams[teamIndex].status = "DEPLOYED";
          db.rescueTeams[teamIndex].activeAssignmentsCount = (db.rescueTeams[teamIndex].activeAssignmentsCount || 0) + 1;
        }
      }
    }

    if (status) {
      db.sosRequests[index].status = status;
    }

    db.sosRequests[index].updatedAt = new Date().toISOString();

    return NextResponse.json({
      success: true,
      data: db.sosRequests[index],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
