"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../app/context/CartContext";


export default function Navbar() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [greeting, setGreeting] = useState("");
    const { cartCount } = useCart();

    const [username, setUsername] = useState(null);

    useEffect(() => {
        async function loadUser() {
            const res = await fetch("/api/session", { cache: "no-store" });
            const data = await res.json();
            if (data.user) {
                setUsername(data.user);
            }
            else {
                router.replace("/login");
            }
        }

        loadUser();
    }, []);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good morning");
        else if (hour < 18) setGreeting("Good afternoon");
        else setGreeting("Good evening");
    }, []);
    const fileInputRef = useRef(null);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;
        router.push(`/results?q=${encodeURIComponent(searchTerm.trim())}`);
    };

    const handleLogout = async () => {
        await fetch("/api/logout", { method: "POST" });
        router.push("/login");
    };

    // Trigger hidden file input
    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            setLoading(true);
            const res = await fetch("http://127.0.0.1:5001/search-image", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Image search failed");
            const data = await res.json();

            // Redirect to results page with image search data
            const encodedResults = encodeURIComponent(JSON.stringify(data));
            setLoading(false);
            router.push(`/results?image=1&data=${encodedResults}`);
        } catch (err) {
            console.error("Upload error:", err);
            alert("Image search failed");
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
            <div className="container">
                <a className="navbar-brand fw-bold text-gold" href="/">
                    XHilara
                </a>

                <form
                    className="d-flex mx-auto w-50 position-relative"
                    role="search"
                    onSubmit={handleSearch}
                >
                    <span
                        className="position-absolute top-50 translate-middle-y ps-2 text-muted"
                        style={{ left: "10px", pointerEvents: "none" }}
                    >
                        <i className="bi bi-search"></i>
                    </span>
                    <input
                        className="form-control me-2 search-input ps-5"
                        type="search"
                        placeholder="Search products..."
                        aria-label="Search"
                        value={searchTerm}
                        disabled={loading}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {/* 🖼️ image upload button */}
                    <button
                        type="button"
                        className="btn position-absolute top-50 translate-middle-y text-muted"
                        style={{ right: "40px" }}
                        onClick={handleImageClick}
                    >
                        {loading ? (
                            <div className="spinner-border spinner-border-sm" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        ) : <i className="bi bi-image fs-5"></i>}
                    </button>

                    {/* hidden file input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: "none" }}
                    />
                    <button className="btn btn-outline-dark" type="submit">
                        {/* Search */}
                    </button>
                </form>
                {username ? (
                    <div className="d-flex align-items-center mx-3">
                        <i className="bi bi-cart fs-4 position-relative mx-2 text-white">
                            {cartCount > 0 && (
                                <span
                                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                    style={{ fontSize: "0.7rem" }}
                                >
                                    {cartCount}
                                </span>
                            )}
                        </i>
                    </div>) : ""}
                <div className="dropdown">
                    <a
                        className="nav-link dropdown-toggle"
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <i className="bi bi-person-circle fs-3 text-white"></i>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end">
                        {username ? (
                            <>
                                <li>
                                    <span className="dropdown-item-text">
                                        {greeting}, {username}
                                    </span>
                                </li>
                                <li>
                                    <button
                                        className="dropdown-item text-danger"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li>
                                <a className="dropdown-item" href="/login">
                                    Login
                                </a>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
