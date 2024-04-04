import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import PunchInButton from "@/app/ui/dashboard/punchin"
const Dashboard = async () => {

  const session = await getServerSession();

  if (!session) {
    redirect('/')
  }


  return (
    <div>
      <div className="flex items-center flex-row gap-5">
        Welcome {session.user?.email}
        {<PunchInButton />}
      </div>
    </div>
  )
}

export default Dashboard