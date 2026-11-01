import { NextResponse } from "next/server";
import { db } from "@/lib/data-store";
import { ResourceItem } from "@/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    let results = [...db.resources];

    if (category) {
      results = results.filter((r) => r.categoryId.toLowerCase().includes(category.toLowerCase()));
    }

    if (status) {
      results = results.filter((r) => r.status.toLowerCase() === status.toLowerCase());
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
    const { name, categoryName, quantity, unit, address, ownerType, ownerName, latitude, longitude } = body;

    if (!name || quantity === undefined || !unit) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Resource name, quantity, and unit are required" } },
        { status: 400 }
      );
    }

    const newResource: ResourceItem = {
      id: `res-${Date.now().toString().slice(-4)}`,
      categoryId: `cat-${(categoryName || "general").toLowerCase().replace(/\s+/g, "-")}`,
      categoryName: categoryName || "Emergency Supplies",
      name,
      quantity: parseFloat(quantity),
      unit,
      address: address || "Forward Relief Stockpile",
      ownerType: ownerType || "GOVERNMENT",
      ownerName: ownerName || "State Disaster Control",
      status: "AVAILABLE",
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      updatedAt: new Date().toISOString(),
    };

    db.resources.unshift(newResource);

    return NextResponse.json({ success: true, data: newResource }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
