import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminSession } from "@/lib/server/auth";

export const metadata = { title: "Admin | Sturnus Flow" };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return <AdminShell user={{ name: session.user.name, email: session.user.email }}>{children}</AdminShell>;
}
