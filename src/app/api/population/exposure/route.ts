import { NextResponse } from "next/server";
import { db } from "@/lib/data-store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const district = searchParams.get("district");

    let records = [...db.populationExposure];

    if (district) {
      records = records.filter((r) => r.district.toLowerCase().includes(district.toLowerCase()));
    }

    // Compute totals across active sectors
    const totalResidential = records.reduce((acc, r) => acc + r.totalResidentialPop, 0);
    const totalEstimatedExposed = records.reduce((acc, r) => acc + r.estimatedExposedPop, 0);
    const totalVerifiedAffected = records.reduce((acc, r) => acc + r.verifiedAffectedPop, 0);
    const totalConfirmedAssisted = records.reduce((acc, r) => acc + r.confirmedAssistedPop, 0);

    return NextResponse.json({
      success: true,
      data: {
        records,
        summary: {
          totalResidential,
          totalEstimatedExposed,
          totalVerifiedAffected,
          totalConfirmedAssisted,
          exposureRatioPercent: totalResidential > 0 ? ((totalEstimatedExposed / totalResidential) * 100).toFixed(2) : "0",
          assistanceCoveragePercent: totalVerifiedAffected > 0 ? ((totalConfirmedAssisted / totalVerifiedAffected) * 100).toFixed(1) : "0",
          methodology: "Census of India 2011/2024 Projections intersected with WorldPop 100m constrained settlement grids and GHSL built-up footprints.",
          distinctionNotice: "Residential Population, Estimated Exposed Population, and Verified Affected Population are distinct metrics. ReliefLink does not treat all residents inside a perimeter as injured.",
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
