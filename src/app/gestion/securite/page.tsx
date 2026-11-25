import { redirect } from "next/navigation";
import { access } from "@/lib/gestion/access";
import { AuthForm } from "@/components/gestion/auth-form";
export default async function Security() {
  const current = await access();
  if (!current.session) redirect("/gestion/connexion");
  if (current.verified) redirect("/gestion?vue=securite");
  if (current.session.user.twoFactorEnabled) redirect("/gestion/verification");
  return <AuthForm mode="enroll" email={current.session.user.email} />;
}
