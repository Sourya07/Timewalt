import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import { Sendemail } from '@/components/nodemailer';
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { username, email, password } = body;

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                email: email,
            },
        });

        if (existingUser) {
            return NextResponse.json({
                msg: "User already exists with this email",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,

            },
        });

        await Sendemail({
            email,
            emailType: "VERIFY",
            id: newUser.id
        });

        return NextResponse.json({
            msg: "User created successfully",
            user: {
                id: newUser.id,
                email: newUser.email,
                username: newUser.username,
            },
        });
    } catch (error: any) {
        return NextResponse.json({
            msg: `Error occurred: ${error.message}`,
        });
    }
}