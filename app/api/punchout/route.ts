// pages/api/punchout.ts
import { getServerSession } from "next-auth";
import {type NextRequest, NextResponse } from 'next/server';
import User from "@/app/lib/models";
import connect from "@/app/lib/utils";

export async function POST(request: NextRequest) {
    const data = await request.json();
    const session = await getServerSession(data);
    await connect();
    if (session) {
        // User is signed in
        const userId = session.user?.email;
        const punchOutTime = new Date();

        // Check if the user has already punched out today
        const user = await User.findOne({ email: userId });
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const punchOutTimesToday = user.punchOutTimes.filter((time: Date) => time >= today && time < tomorrow);

        if (punchOutTimesToday.length > 0) {
            // The user has already punched out today
            return NextResponse.json({ message: 'You have already punched out today.' }, { status: 400 });
        } else {
            // The user has not punched out today, so record the punch-out time
            await User.updateOne(
                { email: userId },
                { $push: { punchOutTimes: punchOutTime } }
            );
            return NextResponse.json({ message: 'Punch out time recorded.', punchOutTime }, { status: 200 });
        }
    } else {
        // User is not signed in
        return NextResponse.json({ message: 'Please sign in to punch out time.' }, { status: 401 });
    }
};
