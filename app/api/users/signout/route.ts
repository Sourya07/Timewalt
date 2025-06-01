import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const response = NextResponse.json({
            message: "Logout successful",
            success: true,
        });

        // Clear the token cookie by setting it to expire
        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0), // expires immediately
            path: "/"
        });

        return response; // ✅ You MUST return a response
    } catch (error: any) {
        console.error("Logout Error:", error);
        return NextResponse.json(
            { message: "Logout failed", error: error.message },
            { status: 500 }
        );
    }
}