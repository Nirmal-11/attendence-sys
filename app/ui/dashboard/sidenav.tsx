"use client";
import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import { PowerIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react'
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';


export default function SideNav() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  

  useEffect(() => {
    console.log("Session status 1:", status);

    if (status !== 'loading') {
      setIsLoading(false);
    }
  }, [status]);


  useEffect(() => {
    console.log("UserSession data 1:", session);
    if (session) {
      console.log("User is authenticated");
    } else {
      console.log("User is not authenticated");
    }
  }, [session]);

  useEffect(() => {
    console.log("Session status 2:", status);
    console.log("User session data 2:", session);
  }, [status, session]);

  const handleSignOut = () => {
    toast.success('You have been logged out!!', { position: "top-center", theme: "dark" });
    const callbackUrl = process.env.NODE_ENV === 'production'
      ? process.env.NEXTAUTH_URL
      : "http://localhost:3000";
    signOut({ callbackUrl });
  };

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-20"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          Logo Here...
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <div>
          {status === 'loading' && <p>Loading...</p>}
          {session && (
            <button onClick={handleSignOut} className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
              <PowerIcon className="w-6" /> Sign Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
