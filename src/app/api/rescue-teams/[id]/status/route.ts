import { NextResponse } from "next/server";
import { db } from "@/lib/data-store";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, latitude, longitude } = body;

    const index = db.rescueTeams.findIndex((t) => t.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Rescue team not found" } },
        { status: 404 }
      );
    }

    if (status) db.rescueTeams[index].status = status;
    if (latitude !== undefined) db.rescueTeams[index].latitude = parseFloat(latitude);
    if (longitude !== undefined) db.rescueTeams[index].longitude = parseFloat(longitude);

    return NextResponse.json({
      success: true,
      data: db.rescueTeams[index],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
