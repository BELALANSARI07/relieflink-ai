import { NextResponse } from "next/server";
import { db } from "@/lib/data-store";
import { Hospital } from "@/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const emergencyOnly = searchParams.get("emergency");

    let results = [...db.hospitals];
    if (emergencyOnly === "true") {
      results = results.filter((h) => h.emergencyCapable);
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
    const { name, latitude, longitude, address, totalBeds, availableBeds, icuBeds, availableIcu, specializations, contactPhone, contactEmail } = body;

    if (!name || latitude === undefined || longitude === undefined || !totalBeds) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Hospital name, coordinates, and total beds are required" } },
        { status: 400 }
      );
    }

    const newHospital: Hospital = {
      id: `hosp-${Date.now().toString().slice(-4)}`,
      name,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      address: address || "Emergency Care Facility",
      totalBeds: parseInt(totalBeds, 10),
      availableBeds: availableBeds !== undefined ? parseInt(availableBeds, 10) : parseInt(totalBeds, 10),
      icuBeds: icuBeds !== undefined ? parseInt(icuBeds, 10) : 10,
      availableIcu: availableIcu !== undefined ? parseInt(availableIcu, 10) : 5,
      specializations: Array.isArray(specializations) ? specializations : ["General Emergency"],
      emergencyCapable: true,
      contactPhone: contactPhone || null,
      contactEmail: contactEmail || null,
      updatedAt: new Date().toISOString(),
    };

    db.hospitals.push(newHospital);

    return NextResponse.json({ success: true, data: newHospital }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
