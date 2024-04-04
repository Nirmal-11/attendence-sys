import User from "@/app/lib/models"
import connect from "@/app/lib/utils";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (request: any) => {
    const { username, email, password } = await request.json()
    await connect();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return new NextResponse("Email is already in use", {
            status: 400
        })
    }

    const hashedPw = await bcrypt.hash(password, 5);

    const newUser = new User({
        username,
        email,
        password: hashedPw,
        
    })

    try {

        await newUser.save();
        return new NextResponse("User is registered", {
            status: 200
        })

    } catch (error: any) {
        console.log(error);
        return new NextResponse(error, {
            status: 500
            
        })
    }
}