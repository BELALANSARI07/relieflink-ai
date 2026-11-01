import { NextResponse } from "next/server";
import { chatWithDisasterAssistant } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, userLocation } = body;

    if (!message) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Message is required" } },
        { status: 400 }
      );
    }

    const response = await chatWithDisasterAssistant(message, userLocation);

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
