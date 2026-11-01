import { NextResponse } from "next/server";
import { db } from "@/lib/data-store";
import { ReliefTask } from "@/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const disasterId = searchParams.get("disasterId");
    const ngoId = searchParams.get("ngoId");
    const status = searchParams.get("status");

    let results = [...db.reliefTasks];

    if (disasterId) {
      results = results.filter((t) => t.disasterId === disasterId);
    }

    if (ngoId) {
      results = results.filter((t) => t.ngoId === ngoId);
    }

    if (status) {
      results = results.filter((t) => t.status.toLowerCase() === status.toLowerCase());
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
    const { disasterId, ngoId, title, description, type, priority, areaName, latitude, longitude } = body;

    if (!disasterId || !title || !description || !type) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Disaster ID, title, description, and task type are required" } },
        { status: 400 }
      );
    }

    const disaster = db.disasters.find((d) => d.id === disasterId);
    const ngo = ngoId ? db.ngos.find((n) => n.id === ngoId) : null;

    const newTask: ReliefTask = {
      id: `task-${Date.now().toString().slice(-4)}`,
      disasterId,
      disasterTitle: disaster?.title || "Active Incident",
      ngoId: ngo?.id || null,
      ngoName: ngo?.name || null,
      title,
      description,
      type,
      status: ngo ? "ASSIGNED" : "PENDING",
      priority: priority || "MEDIUM",
      areaName: areaName || "Designated Sector",
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      createdAt: new Date().toISOString(),
    };

    db.reliefTasks.unshift(newTask);

    if (ngo) {
      const ngoIdx = db.ngos.findIndex((n) => n.id === ngo.id);
      if (ngoIdx !== -1) {
        db.ngos[ngoIdx].activeTasksCount = (db.ngos[ngoIdx].activeTasksCount || 0) + 1;
      }
    }

    return NextResponse.json({ success: true, data: newTask }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
