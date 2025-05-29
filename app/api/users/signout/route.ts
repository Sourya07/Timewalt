import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    try {
        const response = NextResponse.json({
            message: "logout",
            status: 200

        })
        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0)
        })


    }
    catch (error: any) {
        console.log(error)

    }

}