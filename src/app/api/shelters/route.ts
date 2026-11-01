import { NextResponse } from "next/server";
import { db } from "@/lib/data-store";
import { Shelter } from "@/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let results = [...db.shelters];
    if (status) {
      results = results.filter((s) => s.status.toLowerCase() === status.toLowerCase());
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
    const { name, latitude, longitude, address, totalCapacity, facilities, contactPhone, contactEmail } = body;

    if (!name || latitude === undefined || longitude === undefined || !totalCapacity) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Shelter name, coordinates, and total capacity are required" } },
        { status: 400 }
      );
    }

    const newShelter: Shelter = {
      id: `shl-${Date.now().toString().slice(-4)}`,
      name,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      address: address || "Emergency Shelter Center",
      totalCapacity: parseInt(totalCapacity, 10),
      currentOccupancy: 0,
      status: "OPEN",
      facilities: Array.isArray(facilities) ? facilities : ["Clean Water", "Basic First Aid"],
      contactPhone: contactPhone || null,
      contactEmail: contactEmail || null,
      updatedAt: new Date().toISOString(),
    };

    db.shelters.push(newShelter);

    return NextResponse.json({ success: true, data: newShelter }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
