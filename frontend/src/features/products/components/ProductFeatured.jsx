import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectLoggedInUser } from "../../auth/AuthSlice";
import { axiosi } from "../../../config/axios";
import { useNavigate } from "react-router-dom";

const ProductFeatured = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("ALL");
  const [selectedCategoryName, setSelectedCategoryName] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const loggedInUser = useSelector(selectLoggedInUser);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosi.get("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res =
          selectedCategoryId === "ALL"
            ? await axiosi.get("/products")
            : await axiosi.get(`/products?category=${selectedCategoryId}`);
        setProducts(res.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching products", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategoryId]);

  const handleCategoryChange = (id, name) => {
    setSelectedCategoryId(id);
    setSelectedCategoryName(name);
  };

  const displayedProducts = products.slice(0, 8);

  return (
    <section className="px-4 md:px-16 py-12">
      <h2 className="text-2xl md:text-3xl font-serif text-center mb-6">
        OUR PRODUCTS
      </h2>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-6 text-xs md:text-sm font-medium uppercase tracking-wide mb-10">
        <button
          onClick={() => handleCategoryChange("ALL", "ALL")}
          className={`hover:underline ${
            selectedCategoryId === "ALL" ? "underline" : ""
          }`}
        >
          See All
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => handleCategoryChange(cat._id, cat.name)}
            className={`hover:underline ${
              selectedCategoryId === cat._id ? "underline" : ""
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Products */}
      {loading ? (
        <p className="text-center text-gray-400">Loading products...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {displayedProducts.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`product-details/${product._id}`)}
                className="cursor-pointer text-center border border-gray-100 p-4 hover:shadow-lg transition duration-200"
              >
                {product.label && (
                  <p className="text-[10px] text-blue-800 uppercase font-semibold mb-2">
                    {product.label}
                  </p>
                )}
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full h-[360px] object-cover mb-4"
                />
                <h3 className="text-sm font-semibold mb-1">{product.title}</h3>
                <p className="text-xs text-gray-600 mb-1 truncate">
                  {product.description}
                </p>
                <p className="text-[11px] text-gray-500 mb-1">100ML</p>
                <p className="text-sm font-medium mb-4">{product.price} €</p>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="bg-black text-white w-full py-2 text-xs tracking-widest"
                >
                  ADD TO BAG
                </button>
              </div>
            ))}
          </div>

          {/* View All Button */}
          {products.length > 8 && (
            <div className="text-center mt-10">
              <button
                onClick={() =>
                  selectedCategoryName === "ALL"
                    ? navigate("/new-arrivals")
                    : navigate(`/new-arrivals/${selectedCategoryName}`)
                }
                className="underline uppercase text-sm tracking-widest hover:text-gray-600"
              >
                View All
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ProductFeatured;
