import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest) => {
    try {
        const token = request.cookies.get("token")?.value || '';
        const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);

        return decodedToken.userId;

    } catch (error: any) {
        return NextResponse.json({
            message: "Invalid token no user found"
        })


    }

}