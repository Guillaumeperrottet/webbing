import { AuthForm } from "@/components/gestion/auth-form";
import { adminEmail } from "@/lib/gestion/auth";
export default function Verify() { return <AuthForm mode="challenge" email={adminEmail()} />; }
