"use client"
import { lusitana } from '@/app/ui/font';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import Loader from '@/app/ui/components/loader';

const Page = () => {
    const [allUsers, setAllUsers] = useState([]);
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/punchreport');

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || 'Error fetching users');
                }

                const data = await res.json();

                setAllUsers(data.users);
                setIsLoading(false);

            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    const users = allUsers.filter((user: any) => user.email === session?.user?.email);

    return (
        <div className="flex w-full flex-col md:col-span-4">
            <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Attendance Report
            </h2>

            <div className="relative">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 bg-gray-70:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Date
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Punched In Time
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Punched Out Time
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <Loader />
                        ) : (
                            users.length === 0 ? (
                                <tr>
                                    <td className="py-4 text-center">
                                        No attendance report found
                                    </td>
                                </tr>
                            ) : (
                                users.map((user: any) => (
                                    user.punchInTimes.map((punchInTime: any, index: any) => (
                                        <tr key={user.email + index} className="bg-white border-b border-gray-100">
                                            <td className="px-6 py-4">
                                                {new Date(punchInTime).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                {new Date(punchInTime).toLocaleTimeString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.punchOutTimes.length > index ? new Date(user.punchOutTimes[index]).toLocaleTimeString() : 'N/A'}
                                            </td>
                                        </tr>
                                    ))
                                ))
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Page;
