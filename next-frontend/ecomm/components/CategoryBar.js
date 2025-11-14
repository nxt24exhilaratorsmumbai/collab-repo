export default function CategoryBar() {
  const categories = [
    "Flash Sale Zone",
    "Electronics",
    "Home & Kitchen",
    "Fashion",
    "Beauty & Personal Care",
    "Baby & Kids",
    "Grocery & Essentials",
    "Sports & Fitness",
    "Pet Supplies",
  ];

  return (
    <div className="bg-secondary text-white py-2">
      <div className="container d-flex justify-content-center flex-wrap gap-4">
        {categories.map((cat, i) => (
          <span key={i} className="text-center small">
            {cat}
          </span>
        ))}
      </div>
    </div>
  );
}
