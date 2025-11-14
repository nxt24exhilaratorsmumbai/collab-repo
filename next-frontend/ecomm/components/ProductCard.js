export default function ProductCard({ product }) {
    return (
        <div className="col-md-4 mb-3">
            <div className="card border-0 shadow-sm h-100">
                <img src={product.image} className="card-img-top" alt={product.name} />
                <div className="card-body">
                    <p className="fw-semibold mb-1">{product.name}</p>
                    <p className="text-muted mb-1">$ {product.price}</p>
                    <p className="text-secondary small">Size Available {product.sizes}</p>
                </div>
            </div>
        </div>
    );
}
