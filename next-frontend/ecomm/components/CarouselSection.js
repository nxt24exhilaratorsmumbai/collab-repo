"use client";
import { useEffect } from "react";
import Image from "next/image";

export default function CarouselSection() {
    useEffect(() => {
        import("bootstrap/dist/js/bootstrap.bundle.min.js");
    }, []);

    const carouselImages = [
        "https://images.unsplash.com/photo-1612817288484-6f916006741a",
        "https://plus.unsplash.com/premium_photo-1672954170389-d0af54ba261e",
        "https://images.unsplash.com/photo-1627257058769-0a99529e4312",
        "https://images.unsplash.com/photo-1573408301185-9146fe634ad0",
        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9",
        "https://images.unsplash.com/photo-1678097338862-7f682d54a421",
        "https://images.unsplash.com/photo-1530711654140-23ef9ad45094",
    ];

    return (
        <div id="carouselExampleIndicators" className="carousel slide mt-3" data-bs-ride="carousel">
            {/* Carousel indicators */}
            <div className="carousel-indicators">
                {carouselImages.map((_, i) => (
                    <button
                        key={i}
                        type="button"
                        data-bs-target="#carouselExampleIndicators"
                        data-bs-slide-to={i}
                        className={i === 0 ? "active" : ""}
                        aria-current={i === 0 ? "true" : undefined}
                        aria-label={`Slide ${i + 1}`}
                    ></button>
                ))}
            </div>

            {/* Carousel inner */}
            <div className="carousel-inner rounded shadow" style={{ height: "480px" }}>
                {carouselImages.map((src, i) => (
                    <div key={i} className={`carousel-item ${i === 0 ? "active" : ""} h-100`}>
                        <Image
                            src={src}
                            className="d-block w-100"
                            alt={`Banner ${i + 1}`}
                            width={1200}
                            height={400}
                            style={{ objectFit: "cover" }}
                            priority={i === 0}
                            unoptimized
                        />
                    </div>
                ))}
            </div>

            {/* Navigation controls */}
            <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide="prev"
            >
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>

            <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide="next"
            >
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    );
}
