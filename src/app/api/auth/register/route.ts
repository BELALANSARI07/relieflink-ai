import { NextResponse } from "next/server";
import { db } from "@/lib/data-store";
import { UserRole } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, fullName, phone, role } = body;

    if (!email || !fullName) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Full name and email are required" } },
        { status: 400 }
      );
    }

    const existingUser = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: { code: "CONFLICT", message: "User with this email already exists" } },
        { status: 409 }
      );
    }

    const assignedRole: UserRole = role && ["CITIZEN", "VOLUNTEER", "NGO_ADMIN"].includes(role) ? role : "CITIZEN";

    const newUser = {
      id: `usr-${Date.now()}`,
      email,
      fullName,
      phone: phone || null,
      avatarUrl: null,
      roles: [assignedRole],
      isVerified: true,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);

    const response = NextResponse.json(
      {
        success: true,
        data: {
          user: newUser,
          token: `relieflink-jwt-${newUser.id}-${Date.now()}`,
        },
      },
      { status: 201 }
    );

    response.cookies.set("relieflink_session", newUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
