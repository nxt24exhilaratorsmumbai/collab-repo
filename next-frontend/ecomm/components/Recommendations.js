"use client";
import { useEffect, useState } from "react";

export default function Recommendations() {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecs = async () => {
            const res = await fetch("/api/recommend");
            const data = await res.json();
            setRecommendations(Array.isArray(data) ? data : []);
            setLoading(false);
        };
        fetchRecs();
    }, []);

    if (loading) return <p className="text-muted mt-3">Loading recommendations...</p>;

    return (
        <div className="container mt-5">
            <h3>Recommended for You</h3>
            {recommendations.length > 0 ? (
                <ul className="list-group mt-3">
                    {recommendations.map((r, i) => (
                        <li key={i} className="list-group-item">
                            <strong>{r.product_name}</strong> — Category: {r.variant}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted mt-3">No recommendations found.</p>
            )}
        </div>
    );
}
