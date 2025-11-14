"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import Navbar from "@/components/Navbar";

export default function ResultsPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";

    const isImageSearch = searchParams.get("image") === "1";
    const rawData = searchParams.get("data");

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    const { addToCart, removeFromCart, getProductCount } = useCart();
    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                if (isImageSearch && rawData) {
                    const parsedData = JSON.parse(decodeURIComponent(rawData));
                    setResults(parsedData);
                } else if (query) {
                    const res = await fetch("http://127.0.0.1:5000/search", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ query }),
                    });

                    if (!res.ok) throw new Error("Search failed");
                    const data = await res.json();
                    setResults(data);
                } else {
                    setResults([]);
                }
            } catch (err) {
                console.error(err);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query, isImageSearch, rawData]);

    const titleText = isImageSearch ? "Image Search Results" : `Results for "${query}"`;

    return (
        <>
            <Navbar></Navbar>
            <div className="container mt-4">
                <h3>{titleText}</h3>

                {!loading && results.length > 0 && (
                    <p className="text-muted mb-3">
                        Found <strong>{results.length}</strong>{" "}
                        {results.length > 1 ? "results" : "result"}
                    </p>
                )}

                {loading ? (
                    <p>Loading results...</p>
                ) : results.length > 0 ? (
                    <div className="row mt-3">
                        {results.map((item, index) => {
                            const productId = item.sku_id || index;
                            const count = getProductCount(productId);
                            return (<div key={index} className="col-md-3 mb-4">
                                <div className="card shadow-sm border-0 rounded-4 overflow-hidden position-relative h-100">
                                    {/* Discount Badge */}
                                    {item.discount && (
                                        <span
                                            className="badge bg-primary position-absolute top-2 start-2"
                                            style={{ top: "10px", left: "10px", fontSize: "0.8rem" }}
                                        >
                                            {item.discount}% Off
                                        </span>
                                    )}

                                    {/* Product Image */}
                                    <Image
                                        src={item.image_url}
                                        alt={item.product_name}
                                        className="card-img-top"
                                        style={{ objectFit: "cover" }}
                                        width={100}
                                        height={220}
                                        unoptimized
                                    />

                                    {/* Product Info */}
                                    <div className="card-body text-center">
                                        <Link href={`/product/${productId}`} className="link">
                                            <h6 className="fw-semibold mb-2">{item.product_name}</h6>
                                        </Link>

                                        {/* Rating */}
                                        <div className="d-flex justify-content-center align-items-center mb-2">
                                            <span className="text-warning me-1">
                                                {"★".repeat(Math.floor(item.rating || 0))}
                                                {"☆".repeat(5 - Math.floor(item.rating || 0))}
                                            </span>
                                            {/* <small className="text-muted ms-1">
                                            {(item.rating || 0).toFixed(1)} ({item.reviews || 0})
                                        </small> */}
                                        </div>

                                        {/* Description */}
                                        <p className="text-muted small mb-2 text-truncate" title={item.description}>
                                            {item.description || "No description available."}
                                        </p>

                                        {/* Price */}
                                        <h5 className="fw-bold mb-3 text-dark">
                                            ${item.price ? item.price.toFixed(2) : "—"}
                                        </h5>

                                        {count === 0 ? (
                                            <button
                                                className="btn btn-outline-primary w-100"
                                                onClick={() => addToCart({ ...item, id: productId })}
                                            >
                                                Add to Cart
                                            </button>
                                        ) : (
                                            <div className="d-flex justify-content-between align-items-center">
                                                <button
                                                    className="btn btn-outline-danger"
                                                    onClick={() => removeFromCart({ ...item, id: productId })}
                                                >
                                                    -
                                                </button>
                                                <span className="fw-bold">{count}</span>
                                                <button
                                                    className="btn btn-outline-success"
                                                    onClick={() => addToCart({ ...item, id: productId })}
                                                    disabled={count >= 10}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>)
                        })}
                    </div>
                ) : (
                    <p>No results found.</p>
                )}
            </div>
        </>
    );
}
