
import { lusitana } from '@/app/ui/font';
import { fetchUsers } from "@/app/lib/data"
import connect from "@/app/lib/utils";
import { getServerSession } from "next-auth";



const page = async () => {
    await connect();
    const session = await getServerSession();
    const allUsers = await fetchUsers();
    const users = allUsers.filter(user => user.email === session?.user?.email);
    console.log("users", users);

    return (
        <div className="flex w-full flex-col md:col-span-4">
            <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Attendence Report
            </h2>

            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50bg-gray-70:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Date
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Punched In Time
                            </th>
                            <th scope="col" className="px-6 py-3">
                                punched out time
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
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
                        ))}
                    </tbody>

                </table>
            </div>

        </div>
    )
}

export default page