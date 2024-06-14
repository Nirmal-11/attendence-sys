import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const AdminDashboard = async () => {

  const session = await getServerSession();
  

  if (!session) {
    redirect('/')
  }

  return (
    <div>
      <div className="flex items-center flex-row gap-5">
        Welcome {session.user?.email} 
      </div>
    </div>
  )
}

export default AdminDashboard