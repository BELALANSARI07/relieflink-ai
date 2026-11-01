import { NextResponse } from "next/server";
import { db } from "@/lib/data-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { latitude, longitude, taskType } = body;

    const lat = latitude ? parseFloat(latitude) : 19.0760;
    const lng = longitude ? parseFloat(longitude) : 72.8777;
    const skill = taskType || "General Relief";

    const recommendation = db.recommendNgoForArea(lat, lng, skill);

    if (!recommendation) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "No eligible verified NGOs found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: recommendation,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
