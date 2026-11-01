import { NextResponse } from "next/server";
import { classifyDisaster } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { description } = body;

    if (!description || typeof description !== "string") {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Incident description text is required" } },
        { status: 400 }
      );
    }

    const result = await classifyDisaster(description);

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
