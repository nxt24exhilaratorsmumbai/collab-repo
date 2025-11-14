"use client";
import { useRouter } from "next/navigation";

export default function BackButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className="btn btn-outline-secondary mb-3"
        >
            ← Back to results
        </button>
    );
}
