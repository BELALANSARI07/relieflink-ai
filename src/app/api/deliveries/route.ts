import { NextResponse } from "next/server";
import { db } from "@/lib/data-store";
import { DeliveryRecord } from "@/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const ngoId = searchParams.get("ngoId");
    const sosId = searchParams.get("sosId");

    let results = [...db.deliveries];

    if (status) {
      results = results.filter((d) => d.status.toLowerCase() === status.toLowerCase());
    }

    if (ngoId) {
      results = results.filter((d) => d.ngoId === ngoId);
    }

    if (sosId) {
      results = results.filter((d) => d.sosId === sosId);
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
    const {
      sosId,
      disasterId,
      ngoId,
      ngoName,
      recipientName,
      recipientAddress,
      recipientCoords,
      recipientPhone,
      supplies,
      responsiblePersonnel,
      vehicleRegistration,
    } = body;

    if (!recipientAddress || !supplies || supplies.length === 0) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Recipient address and supplies are required" } },
        { status: 400 }
      );
    }

    const newDelivery: DeliveryRecord = {
      id: `del-${Date.now().toString().slice(-4)}`,
      sosId: sosId || "sos-direct",
      disasterId: disasterId || "dis-001",
      ngoId: ngoId || "ngo-001",
      ngoName: ngoName || "Oxfam Relief Foundation India",
      recipientName: recipientName || "Citizen Requester",
      recipientAddress,
      recipientCoords: recipientCoords || [19.0760, 72.8777],
      recipientPhone: recipientPhone || "+91-99999-00000",
      supplies,
      status: "REQUESTED",
      dispatchedAt: null,
      deliveredAt: null,
      confirmedAt: null,
      responsiblePersonnel: responsiblePersonnel || "Dispatched Logistics Officer",
      vehicleRegistration: vehicleRegistration || null,
      deliveryEvidenceUrl: null,
      notes: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.deliveries.unshift(newDelivery);

    return NextResponse.json({ success: true, data: newDelivery }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
