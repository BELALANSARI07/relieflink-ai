import { NextResponse } from "next/server";
import { db } from "@/lib/data-store";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { occupancyChange, currentOccupancy, status } = body;

    const index = db.shelters.findIndex((s) => s.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Shelter not found" } },
        { status: 404 }
      );
    }

    if (currentOccupancy !== undefined) {
      db.shelters[index].currentOccupancy = Math.max(0, parseInt(currentOccupancy, 10));
    } else if (occupancyChange !== undefined) {
      db.shelters[index].currentOccupancy = Math.max(
        0,
        db.shelters[index].currentOccupancy + parseInt(occupancyChange, 10)
      );
    }

    if (db.shelters[index].currentOccupancy >= db.shelters[index].totalCapacity) {
      db.shelters[index].status = "FULL";
    } else if (status) {
      db.shelters[index].status = status;
    } else if (db.shelters[index].status === "FULL") {
      db.shelters[index].status = "OPEN";
    }

    db.shelters[index].updatedAt = new Date().toISOString();

    return NextResponse.json({
      success: true,
      data: db.shelters[index],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
