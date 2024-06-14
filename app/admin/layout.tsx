import { getServerSession } from "next-auth";
import SessionProvider from "@/app/lib/SessionProvider";
import AdminNav from '../ui/dashboard/adminnav';

export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession();

    return (
        <SessionProvider session={session}>
            <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
                <div className="w-full flex-none md:w-64">
                    <AdminNav />
                </div>
                <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
            </div>
        </SessionProvider>
    );
}