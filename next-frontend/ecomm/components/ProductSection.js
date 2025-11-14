import ProductCard from "./ProductCard";

export default function ProductSection({ title, products }) {
    return (
        <div className="row">
            <h5 className="text-dark fw-bold mb-3">{title}</h5>
            {products.map((p, i) => (
                <ProductCard key={i} product={p} />
            ))}
        </div>
    );
}
