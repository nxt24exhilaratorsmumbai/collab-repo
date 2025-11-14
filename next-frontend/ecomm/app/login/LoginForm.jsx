"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginForm() {
    const [form, setForm] = useState({ username: "", password: "" });
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        const data = await res.json();

        if (data.message === "Login successful!") {
            router.push("/");
        } else {
            setMessage(data.message);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-6">
                    <div className="row">
                        <form onSubmit={handleSubmit} className="w-75 mx-auto mb-3">
                            <div className="card shadow">
                                <div className="card-body border-0">
                                    <div className="mb-3">
                                        <h3 className="mb-4 text-gold text-center">Welcome to XHilara</h3>
                                        <label className="form-label">Username</label>
                                        <input
                                            name="username"
                                            className="form-control form-control-sm"
                                            value={form.username}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Password</label>
                                        <input
                                            name="password"
                                            type="password"
                                            className="form-control form-control-sm"
                                            value={form.password}
                                            placeholder="*******"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {message && <small className="text-danger">{message}</small>
                                    }
                                    <div className="text-center">
                                        <button className="btn btn-sm btn-gold px-5 my-3" type="submit">
                                            Login
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="row text-center mt-5">
                        <Image
                            src="/login-1.jpg"
                            alt="Login visual"
                            width={450}
                            height={300}
                            className="w-100 h-100 object-fit-cover rounded"
                        />
                    </div>
                </div>
                <div className="col-4 offset-1">
                    <Image
                        src="https://images.unsplash.com/photo-1618244972963-dbee1a7edc95"
                        alt="Login visual"
                        width={450}
                        height={700}
                        className="w-100 h-100 object-fit-cover rounded"
                    />
                </div>
            </div>
        </div>
    );
}
