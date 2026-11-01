import { NextResponse } from "next/server";
import { db } from "@/lib/data-store";
import { Ngo } from "@/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const verified = searchParams.get("verified");
    const status = searchParams.get("status");

    let results = [...db.ngos];

    if (verified !== null && verified !== undefined && verified !== "") {
      const isV = verified === "true";
      results = results.filter((n) => n.verified === isV);
    }

    if (status) {
      results = results.filter((n) => n.operationalStatus.toLowerCase() === status.toLowerCase());
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
    const { name, registrationNumber, description, capabilities, contactEmail, contactPhone, address, website } = body;

    if (!name || !registrationNumber || !contactEmail) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "NGO name, registration number, and email are required" } },
        { status: 400 }
      );
    }

    const newNgo: Ngo = {
      id: `ngo-${Date.now().toString().slice(-4)}`,
      name,
      registrationNumber,
      description: description || null,
      adminId: "usr-ngo-1",
      verified: false, // Requires government verification
      operationalStatus: "PENDING_VERIFICATION",
      capabilities: Array.isArray(capabilities) ? capabilities : (capabilities ? [capabilities] : ["General Relief Distribution"]),
      contactEmail,
      contactPhone: contactPhone || null,
      address: address || null,
      website: website || null,
      operationalAreasCount: 0,
      activeTasksCount: 0,
      createdAt: new Date().toISOString(),
    };

    db.ngos.push(newNgo);

    return NextResponse.json({ success: true, data: newNgo }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
