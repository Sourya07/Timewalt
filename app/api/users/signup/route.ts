import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import { Sendemail } from '@/components/nodemailer';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { username, email, password } = body;

        // 1. Check for missing fields
        if (!username || !email || !password) {
            return NextResponse.json({ msg: "All fields are required" }, { status: 400 });
        }

        // 2. Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ msg: "User already exists with this email" }, { status: 400 });
        }

        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Create user
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        // 5. Send verification email
        await Sendemail({
            email,
            emailType: "VERIFY",
            id: newUser.id,
        });

        // 6. Return user (excluding sensitive fields)
        return NextResponse.json({
            msg: "User created successfully",
            user: {
                id: newUser.id,
                email: newUser.email,
                username: newUser.username,
            },
        });

    } catch (error: any) {
        console.error("Signup Error:", error);
        return NextResponse.json(
            { msg: `Error occurred: ${error.message}` },
            { status: 500 }
        );
    }
}