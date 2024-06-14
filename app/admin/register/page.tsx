"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from 'react-toastify';



const Register = () => {
    const [error, setError] = useState("");
    const router = useRouter();
    const { data: session, status: sessionStatus } = useSession();

    const isValidEmail = (email: string) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(email);
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;


        if (!isValidEmail(email)) {
            toast.error("Email is invalid", {position: "top-center", theme: "dark"})
            return;
        }


        if (!password || password.length < 8) {
            toast.error("The password is invalid", {position: "top-center", theme: "dark"})
            return
        }

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    email, password
                })
            })
            if (res.status === 400) {
                toast.error('This email is already taken', {position: "top-center", theme: "dark"});

            }
            if (res.status === 200) {
                toast.success('Registered successfully!', {position: "top-center", theme: "dark"});
                router.push("/admin/employees")
            }
        } catch (error) {
            setError("Error, try again");
            console.log(error);

        }

    }

    if (sessionStatus === "loading") {
        return <h1 className="min-h-screen flex justify-center items-center flex-row ">Loading...</h1>;
    }


    return (
        <div className="flex min-h-screen flex-col">
            <div className="mt-4  gap-4">
                <div className="flex flex-col justify-center gap-4 rounded-lg bg-gray-50 px-6 py-10  md:px-20">
                <h1 className="text-lg md:text-center font-semibold">Create New Employee</h1>
                    <form onSubmit={handleSubmit} className="flex justify-center">

                        <div className="md:w-3/3 max-w-sm">

                            <input
                                className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded"
                                type="text"
                                placeholder="Email Address"
                            />
                            <input
                                className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
                                type="password"
                                placeholder="Password"
                            />

                            <div className="text-center md:text-left">
                                <button
                                    className="mt-4 w-full mb-3 bg-blue-600 hover:bg-blue-700 px-4 py-3 text-white uppercase rounded text-xs tracking-wider"
                                    type="submit"
                                >
                                    Register Employee
                                </button>
                            </div>
                            <div className="text-center md:text-left">
                                <p className="text-center text-red-600">{error && error}</p>

                            </div>

                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
};
export default Register
