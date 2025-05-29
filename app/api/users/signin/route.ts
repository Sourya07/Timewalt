import jwt from "jsonwebtoken"
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { email, password } = body

    try {
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            return NextResponse.json({
                msg: "no user with email"
            })
        }
        const isMatch = await bcryptjs.compare(password, user.password)
        if (!isMatch) {
            return new Response(JSON.stringify({ message: " check your password" }), {
                status: 404
            })
        }
        const token = jwt.sign(
            { userId: user.id },
            process.env.TOKEN_SECRET! as string, // You must typecast or assert this in TypeScript
            { expiresIn: "1d" } // optional: expires in 1 day
        );
        const response = NextResponse.json({
            mess: "user login",
            success: true,
            token
        })
        const a = response.cookies.set("token", token, {
            httpOnly: true
        })
        console.log(a)

        return response

    } catch {

    }

}