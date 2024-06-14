
"use client"
import { useEffect, useState } from 'react';
import { lusitana } from '@/app/ui/font';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { toast } from 'react-toastify';
import Loader from '@/app/ui/components/loader';



const Page = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/allemployees');

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Error fetching users');
            }

            const data = await res.json();
            const filteredUsers = data.filter((user: any) => user.isAdmin === false);
            setUsers(filteredUsers);
            setIsLoading(false);

        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

    const deleteUser = async (id: string) => {
        try {
            const res = await fetch(`/api/deleteuser/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setUsers(users.filter((user: any) => user._id !== id));
                toast.success("User deleted successfully!", {position: "top-center", theme: "dark"});
            } else {
                const errorData = await res.json();
                toast.error(`Error while deleting user: ${errorData.message}`, {position: "top-center", theme: "dark"});
                console.error("Error deleting user:", errorData);
            }
        } catch (error) {
            toast.error("Error while deleting user!", {position: "top-center", theme: "dark"});
            console.error("Error deleting user:", error);
        }
    }

    return (
        <div className="flex w-full flex-col md:col-span-4">
            <div className='flex-row mb-4 justify-between items-center flex'>
                <h2 className={`${lusitana.className} text-xl md:text-2xl`}>
                    All Employees
                </h2>
                <div className="gap-4 md:flex-row">
                    <Link href="/admin/register" className=" rounded-xl flex h-[48px] grow items-center justify-center gap-2 rounded-m p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3 bg-sky-100 text-blue-600">Add Employee</Link>
                </div>
            </div>

            <div className="relative">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 bg-gray-70:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Employee
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Role
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
                                users.map((user: any, index: any) => (
                                    <tr key={user.email + index} className="bg-white border-b border-gray-100">
                                        <td className="px-6 py-4">{user.email}</td>
                                        <td className="px-6 py-4">{user.isAdmin ? 'Admin' : 'Employee'}</td>
                                        <td className="px-6 gap-4 flex py-4">
                                            <TrashIcon onClick={() => deleteUser(user._id)}  className="w-6 cursor-pointer" />

                                            <Link href=''>
                                                <PencilSquareIcon className="w-6 cursor-pointer" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Page;
