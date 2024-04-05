// pages/api/punchin.ts
import { getServerSession } from "next-auth";
import {type NextRequest, NextResponse } from 'next/server';
import User from "@/app/lib/models";
import connect from "@/app/lib/utils";

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  await connect();

  if (session) {
    // User is signed in
    const userId = session.user?.email;
    const punchInTime = new Date();

    // Check if the user has already punched in today
    const user = await User.findOne({ email: userId });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const punchInTimesToday = user.punchInTimes.filter((time: Date) => time >= today && time < tomorrow);

    if (punchInTimesToday.length > 0) {
      // The user has already punched in today
      return NextResponse.json({ message: 'You have already punched in today.' }, { status: 400 });
    } else {
      // The user has not punched in today, so record the punch-in time
      await User.updateOne(
        { email: userId },
        { $push: { punchInTimes: punchInTime } }
      );
      return NextResponse.json({ message: 'Punch in time recorded.', punchInTime }, { status: 200 });
    }
  } else {
    // User is not signed in
    return NextResponse.json({ message: 'Please sign in to punch in time.' }, { status: 401 });
  }
};
