import { NextResponse } from "next/server";
import { db } from "@/lib/data-store";
import { Volunteer } from "@/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const availability = searchParams.get("availability");

    let results = [...db.volunteers];
    if (availability) {
      results = results.filter((v) => v.availabilityStatus.toLowerCase() === availability.toLowerCase());
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
    const { fullName, email, phone, skills, address } = body;

    if (!fullName || !email) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Full name and email are required" } },
        { status: 400 }
      );
    }

    const newVolunteer: Volunteer = {
      id: `vol-${Date.now().toString().slice(-4)}`,
      userId: `usr-${Date.now().toString().slice(-4)}`,
      fullName,
      email,
      phone: phone || null,
      skills: Array.isArray(skills) ? skills : ["General Relief Support"],
      availabilityStatus: "AVAILABLE",
      verified: true,
      hoursContributed: 0,
      address: address || null,
      createdAt: new Date().toISOString(),
    };

    db.volunteers.push(newVolunteer);

    return NextResponse.json({ success: true, data: newVolunteer }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
