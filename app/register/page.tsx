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

    useEffect(() => {
        if (sessionStatus === "authenticated") {
            router.replace("/dashboard");
        }
    }, [sessionStatus, router]);
    const isValidEmail = (email: string) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(email);
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;


        if (!isValidEmail(email)) {
            toast.error("Email is invalid")
            return;
        }



        if (!password || password.length < 8) {
            toast.error("The password is invalid")
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
                toast.error('This email is already taken');

            }
            if (res.status === 200) {
                toast.success('Registered successfully!');
                router.push("/login")
            }
        } catch (error) {
            setError("Error, try again");
            console.log(error);

        }

    }

    if (sessionStatus === "loading") {
        return <h1>Loading...</h1>;
    }


    return (
        <div className="flex min-h-screen flex-col">
            <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
                <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
                    {sessionStatus !== "authenticated" && (
                        <form onSubmit={handleSubmit} className=" justify-center space-y-10 md:space-y-0 md:space-x-16 items-center my-2 mx-5 md:mx-0 md:my-0">

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
                                        Register
                                    </button>
                                </div>
                                <div className="text-center md:text-left">
                                    <p className="text-center text-red-600">{error && error}</p>

                                </div>
                                <div className="mt-4 font-semibold text-sm text-slate-500 text-center md:text-left">
                                    Already have an account?{" "}
                                    <Link
                                        className="text-red-600 hover:underline hover:underline-offset-4"
                                        href="/login"
                                    >
                                        Login
                                    </Link>
                                </div>
                            </div>
                        </form>
                    )}

                </div>
                <div className="flex items-center justify-center p-6 md:w-3/5 md:px-2 md:py-12">
                    <Image src="https://images.pexels.com/photos/5935787/pexels-photo-5935787.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" priority alt='dashboard desktop image' width={1000} height={850} className='hidden md:block' />
                    <Image src="https://images.pexels.com/photos/5935787/pexels-photo-5935787.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" priority alt='dashboard mobile image' width={560} height={620} className='md:hidden block' />
                </div>
            </div>
        </div>
    );
};
export default Register
