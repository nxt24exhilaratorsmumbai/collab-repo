import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
    const cookieStore = await cookies();
    const user = cookieStore.get("user");
    console.log(user);
    if (user) {
        redirect("/");
    }

    return <LoginForm />;
}
