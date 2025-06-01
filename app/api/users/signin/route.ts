import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return NextResponse.json({ message: "No user found with this email" }, { status: 404 });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ message: "Incorrect password" }, { status: 401 });
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.TOKEN_SECRET!, // assumes TOKEN_SECRET is defined
            { expiresIn: "1d" }
        );

        const response = NextResponse.json({
            message: "User logged in successfully",
            success: true,
            token,
        });

        // Set the token in an HttpOnly cookie
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24, // 1 day
        });

        return response;
    } catch (error) {
        console.error("Signin Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}