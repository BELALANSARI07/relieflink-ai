import { NextResponse } from "next/server";
import { db } from "@/lib/data-store";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { availableBeds, availableIcu, bedsChange, icuChange } = body;

    const index = db.hospitals.findIndex((h) => h.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Hospital not found" } },
        { status: 404 }
      );
    }

    if (availableBeds !== undefined) {
      db.hospitals[index].availableBeds = Math.max(0, parseInt(availableBeds, 10));
    } else if (bedsChange !== undefined) {
      db.hospitals[index].availableBeds = Math.max(
        0,
        Math.min(db.hospitals[index].totalBeds, db.hospitals[index].availableBeds + parseInt(bedsChange, 10))
      );
    }

    if (availableIcu !== undefined) {
      db.hospitals[index].availableIcu = Math.max(0, parseInt(availableIcu, 10));
    } else if (icuChange !== undefined) {
      db.hospitals[index].availableIcu = Math.max(
        0,
        Math.min(db.hospitals[index].icuBeds, db.hospitals[index].availableIcu + parseInt(icuChange, 10))
      );
    }

    db.hospitals[index].updatedAt = new Date().toISOString();

    return NextResponse.json({
      success: true,
      data: db.hospitals[index],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
