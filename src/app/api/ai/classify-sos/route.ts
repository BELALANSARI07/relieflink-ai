import { NextResponse } from "next/server";
import { classifySosUrgency } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { description, peopleCount, medicalNeeds } = body;

    if (!description) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "SOS description is required" } },
        { status: 400 }
      );
    }

    const result = await classifySosUrgency(description, peopleCount, medicalNeeds);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
