import connect from "@/app/lib/utils";
import User from "@/app/lib/models";
import { NextResponse } from "next/server";

export const DELETE = async (request: any) => {
    await connect();

    try {
        const id = request.nextUrl.pathname.split('/').pop();
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User not found" }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        return new NextResponse(JSON.stringify({ message: "User deleted successfully" }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (error: any) {
        console.log(error);
        return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};
