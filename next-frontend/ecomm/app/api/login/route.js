import { cookies } from "next/headers";
import { getDb } from "@/lib/db";

export async function POST(req) {
    const { username, password } = await req.json();
    const db = await getDb("users.db");

    const user = await db.get(
        "SELECT * FROM my_table WHERE email = ? AND password = ?",
        [username, password]
    );


    if (user) {
        console.log(user.name);
        const cookieStore = await cookies();
        // Set cookie for logged-in user
        cookieStore.set("user", user.name, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24, // 1 day
        });

        return Response.json({ message: "Login successful!" });
    } else {
        return Response.json({ message: "Invalid credentials." });
    }
}
