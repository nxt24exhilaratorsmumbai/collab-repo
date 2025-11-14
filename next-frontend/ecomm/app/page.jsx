"use client";
import Navbar from "@/components/Navbar";
import CategoryBar from "@/components/CategoryBar";
import CarouselSection from "@/components/CarouselSection";
import ProductSection from "@/components/ProductSection";
import BundleCard from "@/components/BundleCard";

export default function HomePage() {
  const products = [
    { name: "Target Australian Cotton Seersucker Shirt", price: 20, sizes: "M, XL, XXL", image: "https://storage.googleapis.com/3dmodelsextentia/Blue_Shirts/Target%20Australian%20Cotton%20Seersucker%20Shirt.jpg" },
    { name: "Basic Crew Neck Sweatshirt", price: 8, sizes: "S, M, L", image: "https://kmartau.mo.cloudinary.net/f9c5824a-c753-42a0-9715-f5a968602451.jpg?tx=w_300,h_300,c_pad" },
    { name: "Active Mesh T-Shirt_112on", price: 15, sizes: "S, M, L", image: "https://storage.googleapis.com/3dmodelsextentia/Blue_Shirts/Acitve%20Mens%20Regular%20Training%20T-shirt.jpg" },
    { name: "Oversized Heavyweight T-shirt", price: 18, sizes: "L, XL, XXL", image: "https://storage.googleapis.com/3dmodelsextentia/Blue_Shirts/Oversized%20Heavyweight%20T-shirt.jpg" },
    { name: "Printed T-shirt", price: 20, sizes: "M, L, XL", image: "https://storage.googleapis.com/3dmodelsextentia/Blue_Shirts/Target%20European%20Linen%20SHirt.jpg" },
  ];

  const product = {
    title: "Up to 70% off | Kitchen essentials",
    description:
      "sturdy board for everyday prep || durable spoons & forks || ideal for boiling, simmering & daily cooking",
    price: 327.98,
    images: [
      "https://kmartau.mo.cloudinary.net/05efeeb5-7909-4dc5-ab58-39cadbdae995.jpg?tx=w_300,h_300,c_pad",
      "https://assets.kmart.com.au/transform/5b3d4766-0d64-4e10-a300-4019c047d88e/42334828-1?io=transform:fit,width:3840,height:3840&quality=90",
      "https://kmartau.mo.cloudinary.net/33904ced-7f49-444e-a85e-882361f2d5be.jpg?tx=w_300,h_300,c_pad",
    ],
  };


  return (
    <div>
      <Navbar />

      <CategoryBar />
      <CarouselSection />

      <div className="container mt-5">
        <div className="row">
          <div className="col-6">
            <ProductSection title="Recently Viewed" products={products.slice(0, 3)} />
          </div>
          <div className="col-6">
            <ProductSection title="Recently Purchased" products={products.slice(3)} />
          </div>
        </div>
        <div className="mt-4">
          <h4>Product bundles curated specially for you</h4>
          <BundleCard {...product} />
        </div>
      </div>
    </div>
  );
}
