import User from "@/app/lib/models";
import connect from "@/app/lib/utils";
import { NextResponse } from "next/server";

export const GET = async (request: any) => {
    await connect();

    try {
        const users = await User.find({});

        if (!users) {
            return new NextResponse("No employees found", {
                status: 404
            });
        }

        return new NextResponse(JSON.stringify(users), {
            status: 200,
        });

    } catch (error: any) {
        console.log(error);
        return new NextResponse(error, {
            status: 500
        });
    }
};
