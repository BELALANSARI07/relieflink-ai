import { NextResponse } from "next/server";
import { db } from "@/lib/data-store";
import { Disaster } from "@/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const severity = searchParams.get("severity");
    const type = searchParams.get("type");
    const search = searchParams.get("search");

    let results = [...db.disasters];

    if (status) {
      results = results.filter((d) => d.status.toLowerCase() === status.toLowerCase());
    }

    if (severity) {
      results = results.filter((d) => d.severity.toLowerCase() === severity.toLowerCase());
    }

    if (type) {
      results = results.filter((d) => d.type.toLowerCase() === type.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          (d.address && d.address.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({
      success: true,
      data: results,
      meta: {
        total: results.length,
      },
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
    const { title, description, type, severity, latitude, longitude, address, affectedRadiusKm } = body;

    if (!title || !description || !type || !latitude || !longitude) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Missing required disaster parameters" } },
        { status: 400 }
      );
    }

    const newDisaster: Disaster = {
      id: `dis-${Date.now().toString().slice(-4)}`,
      title,
      description,
      type,
      severity: severity || "HIGH",
      status: "ACTIVE",
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      address: address || null,
      affectedRadiusKm: parseFloat(affectedRadiusKm) || 15,
      reportedById: "usr-admin-1",
      reportedByName: "Col. Rajesh Verma",
      startedAt: new Date().toISOString(),
      updatesCount: 0,
      sosCount: 0,
      activeTeamsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.disasters.unshift(newDisaster);

    // Create a system notification
    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: "usr-admin-1",
      type: "DISASTER_ALERT",
      title: `New Disaster Declared: ${newDisaster.title}`,
      message: `Severity: ${newDisaster.severity}. Radius: ${newDisaster.affectedRadiusKm} km around ${newDisaster.address || "coordinates"}.`,
      data: { disasterId: newDisaster.id },
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, data: newDisaster }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
