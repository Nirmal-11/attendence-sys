// pages/api/punchstatus.ts
import { getServerSession } from "next-auth";
import {type NextRequest, NextResponse } from 'next/server';
import User from "@/app/lib/models";
import connect from "@/app/lib/utils";

export async function GET(request: NextRequest) {
  const data = await request.json();

  const session = await getServerSession(data);
  await connect();
  if (session) {
    // User is signed in
    const userId = session.user?.email;

    // Get the user's punch-in and punch-out times for today
    const user = await User.findOne({ email: userId });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const punchInTimesToday = user.punchInTimes.filter((time: Date) => time >= today && time < tomorrow);
    const punchOutTimesToday = user.punchOutTimes.filter((time: Date) => time >= today && time < tomorrow);

    // Get the last punch-in and punch-out times for today
    const punchInTime = punchInTimesToday[punchInTimesToday.length - 1];
    const punchOutTime = punchOutTimesToday[punchOutTimesToday.length - 1];

    return NextResponse.json({ punchInTime, punchOutTime }, { status: 200 });
  } else {
    // User is not signed in
    return NextResponse.json({ message: 'Please sign in to check punch status.' }, { status: 401 });
  }
};
