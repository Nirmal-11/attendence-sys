import { NextRequest, NextResponse } from 'next/server';
import User from '@/app/lib/models';
import connect from '@/app/lib/utils';

connect();

export async function GET(req: NextRequest) {
    try {
        console.log("GET handler called");

        const users = await User.find({}, '-password'); // Exclude password field

        console.log("Users fetched:", users);

        if (!users || users.length === 0) {
            return NextResponse.json({ message: 'No users found' }, { status: 404 });
        }

        return NextResponse.json({ users }, { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ message: 'Error fetching users' }, { status: 500 });
    }
}
