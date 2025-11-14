"use client";
import Image from "next/image";
import { useState } from "react";

export default function BundleCard({ title, description, price, images = [] }) {
    const [selectedImage, setSelectedImage] = useState(images[0]);

    return (
        <div className="card shadow-sm rounded-3 border-0 p-3" style={{ maxWidth: "320px" }}>
            {/* Title */}
            <h5 className="fw-bold mb-3">{title}</h5>

            {/* Main Image */}
            <div className="text-center mb-3">
                <Image
                    src={selectedImage}
                    alt={title}
                    width={250}
                    height={250}
                    className="rounded-2 object-cover"
                    style={{ width: "100%", height: "auto" }}
                />
            </div>

            {/* Description */}
            <p className="text-muted small mb-2" style={{ minHeight: "48px" }}>
                {description}
            </p>

            {/* Price */}
            <h5 className="fw-bold mb-3">${price}</h5>

            {/* Thumbnail Images */}
            <div className="d-flex gap-2 justify-content-start">
                {images.map((img, idx) => (
                    <Image
                        key={idx}
                        src={img}
                        alt={`${title} ${idx}`}
                        width={60}
                        height={60}
                        onClick={() => setSelectedImage(img)}
                        className={`rounded-2 border ${selectedImage === img ? "border-primary" : "border-light"}`}
                        style={{
                            cursor: "pointer",
                            objectFit: "cover",
                            transition: "border 0.2s ease-in-out",
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
