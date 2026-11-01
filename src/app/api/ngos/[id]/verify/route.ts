import { NextResponse } from "next/server";
import { db } from "@/lib/data-store";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { verified, operationalStatus } = body;

    const index = db.ngos.findIndex((n) => n.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "NGO organization not found" } },
        { status: 404 }
      );
    }

    db.ngos[index].verified = verified !== undefined ? verified : true;
    db.ngos[index].operationalStatus = operationalStatus || (db.ngos[index].verified ? "ACTIVE" : "PENDING_VERIFICATION");

    return NextResponse.json({
      success: true,
      data: db.ngos[index],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
