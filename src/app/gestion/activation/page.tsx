import { AuthForm } from "@/components/gestion/auth-form";
import { adminEmail } from "@/lib/gestion/auth";
export default function Activation() { return <AuthForm mode="activate" email={adminEmail()} />; }
