import { NextResponse } from "next/server";
import { db } from "@/lib/data-store";
import { NgoSurplusItem } from "@/types";

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: db.ngoSurplus,
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
    const { ngoId, ngoName, item, category, quantity, unit, storageWarehouse, expiryDate, contactPerson, contactPhone } = body;

    if (!item || !quantity || !storageWarehouse) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Item, quantity, and warehouse are required" } },
        { status: 400 }
      );
    }

    const newSurplus: NgoSurplusItem = {
      id: `surplus-${Date.now().toString().slice(-4)}`,
      ngoId: ngoId || "ngo-001",
      ngoName: ngoName || "Oxfam Relief Foundation India",
      item,
      category: category || "FOOD",
      quantity: Number(quantity),
      unit: unit || "units",
      storageWarehouse,
      expiryDate: expiryDate || undefined,
      status: "OFFERED",
      contactPerson: contactPerson || "Logistics Dispatcher",
      contactPhone: contactPhone || "+91-98765-43210",
      createdAt: new Date().toISOString(),
    };

    db.ngoSurplus.unshift(newSurplus);

    return NextResponse.json({
      success: true,
      data: newSurplus,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { surplusId, claimingNgoName } = body;

    const claimed = db.claimSurplus(surplusId, claimingNgoName || "Partner Humanitarian Agency");
    if (!claimed) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Surplus item not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: claimed,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
