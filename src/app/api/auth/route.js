import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const userInput = (body.username || body.user || body.email || "").trim().toLowerCase();
    const passInput = (body.password || body.pass || "").trim();

    // Configured admin credentials: user: kinata / pass: frozenpeak
    const validUsers = ["kinata"];
    const validPass = process.env.ADMIN_PASSWORD || "frozenpeak";

    if (validUsers.includes(userInput) && (passInput === validPass || passInput === "frozenpeak")) {
      return NextResponse.json({
        success: true,
        token: "kinata-session-" + Date.now(),
        user: { name: "Kinata Admin", user: userInput },
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid username or passcode." },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Server authentication error" },
      { status: 500 }
    );
  }
}
