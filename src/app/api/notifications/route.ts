import { NextResponse } from "next/server";
import { db } from "@/lib/data-store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get("unread");

    let results = [...db.notifications];
    if (unreadOnly === "true") {
      results = results.filter((n) => !n.isRead);
    }

    return NextResponse.json({
      success: true,
      data: results,
      meta: {
        total: results.length,
        unreadCount: db.notifications.filter((n) => !n.isRead).length,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { notificationId, markAllRead } = body;

    if (markAllRead) {
      db.notifications.forEach((n) => {
        n.isRead = true;
      });
    } else if (notificationId) {
      const target = db.notifications.find((n) => n.id === notificationId);
      if (target) {
        target.isRead = true;
      }
    }

    return NextResponse.json({
      success: true,
      data: { unreadCount: db.notifications.filter((n) => !n.isRead).length },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
