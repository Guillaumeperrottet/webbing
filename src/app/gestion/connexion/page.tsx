import { redirect } from "next/navigation";
import { access } from "@/lib/gestion/access";
import { adminEmail } from "@/lib/gestion/auth";
import { AuthForm } from "@/components/gestion/auth-form";
export default async function Login() {
  const current = await access();
  if (current.verified) redirect("/gestion");
  if (current.session) redirect("/gestion/securite");
  return <AuthForm mode="login" email={adminEmail()} />;
}
