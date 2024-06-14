// pages/punchin.tsx
"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from "next-auth/react";
import { toast } from "react-toastify"

export default function PunchIn() {
  const { data: session }: any = useSession();
  const [punchInTime, setPunchInTime] = useState<Date | null>(null);
  const [punchOutTime, setPunchOutTime] = useState<Date | null>(null);

  useEffect(() => {
    // Check if the user has already punched in today
    const checkPunchStatus = async () => {
      try {
        const response = await axios.get('/api/punchstatus', { params: { userId: session?.user.id } });
        
        if (response.data.punchInTime) {
          setPunchInTime(new Date(response.data.punchInTime));
        }
        if (response.data.punchOutTime) {
          setPunchOutTime(new Date(response.data.punchOutTime));
        }
      } catch (error) {
        console.error('Error checking punch status:', error);
      }
    };

    checkPunchStatus();
  }, [session]);

  const handlePunchIn = async () => {
    try {
      const response = await axios.post('/api/punchin', { userId: session.user.id });
      if (response.data.punchInTime) {
        setPunchInTime(new Date(response.data.punchInTime));
        toast.success("Punched In", {position: "top-center", theme: "dark"});
      } else {
        toast.error("No punch-in time received", {position: "top-center", theme: "dark"});
      }
    } catch (error) {
      console.error('Error punching in:', error);
      toast.error("You have already punched In for today", {position: "top-center", theme: "dark"});
    }
  };

  const handlePunchOut = async () => {
    try {
      const response = await axios.post('/api/punchout', { userId: session?.user.id });
      if (response.data.punchOutTime) {
        setPunchOutTime(new Date(response.data.punchOutTime));
        toast.success("Punched Out", {position: "top-center", theme: "dark"});
      } else {
        toast.error("No punch-out time received", {position: "top-center", theme: "dark"});
      }
    } catch (error) {
      console.error('Error punching out:', error);
      toast.error("You have already punched Out for today", {position: "top-center", theme: "dark"});
    }
  };

  

  return (
    <>
      {punchInTime ? (
        <p className='flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3 bg-sky-100 text-blue-600'>Punched in today at: {punchInTime.toLocaleTimeString()}</p>
      ) : (
        <button className='flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3 bg-sky-100 text-blue-600' onClick={handlePunchIn}>Punch In</button>
      )}
      {punchOutTime ? (
        <p className='flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3 bg-sky-100 text-blue-600'>Punched out today at: {punchOutTime.toLocaleTimeString()}</p>
      ) : punchInTime && !punchOutTime ? (
        <button className='flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3 bg-sky-100 text-blue-600' onClick={handlePunchOut}>Punch Out</button>
      ) : null}
    </>
  );
}
