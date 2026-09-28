import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/server/auth";
import { LoginForm } from "./login-form";

export const metadata = { title: "Admin — Sturnus Flow" };

export default async function AdminLoginPage() {
  if (await getAdminSession()) redirect("/admin/leads");
  return <LoginForm />;
}
