import { NextResponse } from "next/server";
import { db } from "@/lib/data-store";
import { RescueTeam } from "@/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const specialization = searchParams.get("specialization");

    let results = [...db.rescueTeams];

    if (status) {
      results = results.filter((t) => t.status.toLowerCase() === status.toLowerCase());
    }

    if (specialization) {
      results = results.filter((t) => t.specialization.toLowerCase() === specialization.toLowerCase());
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
    const { name, specialization, capacity, contactNumber, equipment, latitude, longitude } = body;

    if (!name || !specialization) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Team name and specialization are required" } },
        { status: 400 }
      );
    }

    const newTeam: RescueTeam = {
      id: `team-${Date.now().toString().slice(-4)}`,
      name,
      leaderId: null,
      leaderName: "Unit Commander",
      status: "AVAILABLE",
      latitude: latitude ? parseFloat(latitude) : 19.0760,
      longitude: longitude ? parseFloat(longitude) : 72.8777,
      capacity: parseInt(capacity, 10) || 8,
      specialization,
      contactNumber: contactNumber || "+91-11-24363260",
      equipment: Array.isArray(equipment) ? equipment : ["Standard Emergency Gear"],
      membersCount: parseInt(capacity, 10) || 8,
      activeAssignmentsCount: 0,
      createdAt: new Date().toISOString(),
    };

    db.rescueTeams.push(newTeam);

    return NextResponse.json({ success: true, data: newTeam }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
