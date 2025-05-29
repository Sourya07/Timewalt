import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const token = url.searchParams.get("token");

        if (!token) {
            return NextResponse.json({ error: "Token is required" }, { status: 400 });
        }

        const user = await prisma.user.findFirst({
            where: {
                verifytoken: token,
                verifytokenExpiry: {
                    gt: new Date(),
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
        }

        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                isVerified: true,
                verifytoken: null,
                verifytokenExpiry: null,
            },
        });

        return NextResponse.json({ msg: "Email successfully verified" });
    } catch (error) {
        console.error("Verification error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}