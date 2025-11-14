// app/product/[productId]/page.jsx
import Image from "next/image";
import BackButton from "@/components/BackButton";
export default async function ProductPage({ params }) {
    const { productId } = await params;

    console.log("productId:", productId);
    // 🧠 Fetch product details from your backend API using SKU
    // const res = await fetch(`http://127.0.0.1:5000/product`, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ sku }),
    //     cache: "no-store", // ensures fresh data
    // });

    // const data = await res.json();

    // // Handle API errors
    // if (!res.ok || !data) {
    //     return <div className="container mt-5">Product not found.</div>;
    // }

    return (
        <>
            <BackButton />
            <h1>{productId}</h1>
        </>
        // <div className="container mt-5">
        //     <div className="row">
        //         <div className="col-md-6 text-center">
        //             <Image
        //                 src={data.image_url}
        //                 alt={data.name}
        //                 width={500}
        //                 height={400}
        //                 className="rounded-3 object-fit-cover"
        //             />
        //         </div>
        //         <div className="col-md-6">
        //             <h3 className="fw-bold mb-3">{data.name}</h3>
        //             <p className="text-muted">{data.description}</p>
        //             <h4 className="text-success fw-bold mb-4">${data.price}</h4>
        //             <button className="btn btn-primary">Add to Cart</button>
        //         </div>
        //     </div>
        // </div>
    );
}
