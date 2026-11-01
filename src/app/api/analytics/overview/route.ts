import { NextResponse } from "next/server";
import { db } from "@/lib/data-store";

export async function GET() {
  try {
    const metrics = db.getOverviewMetrics();

    // Severity distribution breakdown
    const severityCounts = {
      CRITICAL: db.sosRequests.filter((s) => s.severity === "CRITICAL").length,
      HIGH: db.sosRequests.filter((s) => s.severity === "HIGH").length,
      MEDIUM: db.sosRequests.filter((s) => s.severity === "MEDIUM").length,
      LOW: db.sosRequests.filter((s) => s.severity === "LOW").length,
    };

    // Emergency type distribution
    const emergencyTypeCounts = db.sosRequests.reduce((acc: Record<string, number>, s) => {
      acc[s.type] = (acc[s.type] || 0) + 1;
      return acc;
    }, {});

    // Recent activity log
    const recentActivity = [
      ...db.sosRequests.map((s) => ({
        type: "SOS",
        title: `SOS-${s.id}: ${s.type}`,
        subtitle: `${s.peopleCount} person(s) • ${s.severity}`,
        status: s.status,
        timestamp: s.createdAt,
      })),
      ...db.reliefTasks.map((t) => ({
        type: "TASK",
        title: `Task: ${t.title}`,
        subtitle: `${t.ngoName || "Unassigned"} • ${t.areaName}`,
        status: t.status,
        timestamp: t.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      data: {
        metrics,
        severityCounts,
        emergencyTypeCounts,
        recentActivity,
        aiRecommendationsCount: db.aiRecommendations.length,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
