import { NextResponse } from "next/navigation";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Default admin credentials (can be overridden via environment variables)
    const validEmail = process.env.ADMIN_EMAIL || "admin@kinata.com";
    const validPass = process.env.ADMIN_PASSWORD || "kinata2026";

    if ((email === validEmail || email === "kendhikinata24@gmail.com") && password === validPass) {
      return NextResponse.json({
        success: true,
        token: "kinata-session-" + Date.now(),
        user: { name: "Kinata Admin", email },
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid email or passcode. Default is admin@kinata.com / kinata2026" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Server authentication error" },
      { status: 500 }
    );
  }
}
