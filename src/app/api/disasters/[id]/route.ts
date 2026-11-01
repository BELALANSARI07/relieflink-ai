import { NextResponse } from "next/server";
import { db } from "@/lib/data-store";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const disaster = db.disasters.find((d) => d.id === id);

    if (!disaster) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Disaster incident not found" } },
        { status: 404 }
      );
    }

    const linkedSos = db.sosRequests.filter((s) => s.disasterId === id);
    const linkedTasks = db.reliefTasks.filter((t) => t.disasterId === id);

    return NextResponse.json({
      success: true,
      data: {
        ...disaster,
        sosRequests: linkedSos,
        reliefTasks: linkedTasks,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const index = db.disasters.findIndex((d) => d.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Disaster incident not found" } },
        { status: 404 }
      );
    }

    const body = await request.json();
    db.disasters[index] = {
      ...db.disasters[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: db.disasters[index],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
