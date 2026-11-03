import { NextResponse } from "next/server";
import { db } from "@/lib/data-store";

export async function GET() {
  try {
    const gaps = [...db.reliefGaps];
    const criticalGaps = gaps.filter((g) => g.severityLevel === "CRITICAL").length;
    const totalUnfulfilledInGaps = gaps.reduce((acc, g) => acc + g.unfulfilledRequestsCount, 0);

    return NextResponse.json({
      success: true,
      data: {
        gaps,
        metrics: {
          totalIdentifiedGaps: gaps.length,
          criticalGaps,
          totalUnfulfilledInGaps,
          highestPrioritySector: gaps.length > 0 ? gaps[0].sectorName : "None",
          gapDetectionRule: "Evaluates verified assistance requests vs delivered supply logs. Locality is served ONLY to the extent that actual deliveries have been verified.",
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
