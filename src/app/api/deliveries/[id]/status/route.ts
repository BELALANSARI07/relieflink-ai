import { NextResponse } from "next/server";
import { db } from "@/lib/data-store";
import { DeliveryStatus } from "@/types";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, responsiblePersonnel, vehicleRegistration, deliveryEvidenceUrl, notes } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Status is required" } },
        { status: 400 }
      );
    }

    const updated = db.updateDeliveryStatus(id, status as DeliveryStatus, {
      responsiblePersonnel,
      vehicleRegistration,
      deliveryEvidenceUrl,
      notes,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Delivery record not found" } },
        { status: 404 }
      );
    }

    // When delivery is confirmed, automatically notify authorities and update SOS status if attached
    if (status === "CONFIRMED" && updated.sosId) {
      const sosIndex = db.sosRequests.findIndex((s) => s.id === updated.sosId);
      if (sosIndex !== -1) {
        db.sosRequests[sosIndex].status = "RESOLVED";
        db.sosRequests[sosIndex].updatedAt = new Date().toISOString();
      }

      db.notifications.unshift({
        id: `notif-${Date.now()}`,
        userId: "usr-admin-1",
        type: "RELIEF_UPDATE",
        title: `✅ Relief Delivery Confirmed: ${updated.id}`,
        message: `${updated.ngoName} successfully confirmed hand-over of ${updated.supplies.map(s => `${s.quantity} ${s.unit} ${s.item}`).join(", ")} at ${updated.recipientAddress}.`,
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
