import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    const response = NextResponse.json({ success: true });
    
    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Failed to set cookie" }, { status: 500 });
  }
}
