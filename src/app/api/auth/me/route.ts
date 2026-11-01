import { NextResponse } from "next/server";
import { db } from "@/lib/data-store";

export async function GET(request: Request) {
  // Check cookie or authorization header
  const cookieHeader = request.headers.get("cookie");
  const authHeader = request.headers.get("authorization");

  let userId: string | null = null;

  if (cookieHeader && cookieHeader.includes("relieflink_session=")) {
    const match = cookieHeader.match(/relieflink_session=([^;]+)/);
    if (match) userId = match[1];
  } else if (authHeader && authHeader.startsWith("Bearer relieflink-jwt-")) {
    const parts = authHeader.replace("Bearer relieflink-jwt-", "").split("-");
    userId = parts.slice(0, 3).join("-"); // usr-admin-1 format
  }

  // Default to authority admin in demo mode if no session provided
  const user = (userId ? db.users.find((u) => u.id === userId) : null) || db.users[0];

  return NextResponse.json({
    success: true,
    data: { user },
  });
}
