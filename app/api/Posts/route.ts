import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { getDataFromToken } from "@/components/jwthelper/datahelper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    try {
        const UserId = await getDataFromToken(req)
        const { bussiness, occupation, address } = await req.json()
        const user = await prisma.user.findUnique({
            where: {
                id: UserId
            }
        })




        const Posts = await prisma.posts.create({
            data: {

                bussiness,
                occupation,
                address,
                userId: UserId

            },

        })

        console.log(Posts)
        return NextResponse.json({
            Posts,
            name: user?.username
        })

    }
    catch (error: any) {
        return NextResponse.json({
            status: false,
            message: error.message,
            data: null,
        })
    }
}
