import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFeaturedProductsAsync,
  selectFeaturedProducts,
  selectFeaturedMeta,
  selectProductStatus,
} from "../../products/ProductSlice";
import { Link } from "react-router-dom";

const ProductFeatured = () => {
  const dispatch = useDispatch();
  const featured = useSelector(selectFeaturedProducts) || [];
  const meta = useSelector(selectFeaturedMeta);
  const status = useSelector(selectProductStatus);

  useEffect(() => {
    dispatch(fetchFeaturedProductsAsync({ page: 1, limit: 6 }));
  }, [dispatch]);

  return (
    <section className="min-h-screen bg-white">
      {/* Header */}
      <div className="py-10 px-8">
        <h2 className="text-lg tracking-[0.3em] text-center font-light uppercase">
          Featured Products
        </h2>
      </div>

      {/* Content */}
      {status === "pending" && (
        <div className="flex justify-center items-center py-24">
          <span className="text-xs tracking-[0.3em] uppercase text-gray-500">Loading…</span>
        </div>
      )}

      {status !== "pending" && featured.length === 0 && (
        <div className="flex justify-center items-center py-24">
          <span className="text-xs tracking-[0.3em] uppercase text-gray-500">
            No featured products
          </span>
        </div>
      )}

      {featured.length > 0 && (
        <div className="space-y-32 pb-32">
          {featured.map((product, index) => {
            const id = product?._id || product?.id;
            const detailPath = `/product-details/${id}`;
            const cover =
              product?.thumbnail ||
              (Array.isArray(product?.images) ? product.images[0] : "") ||
              "";
            const price = Number(product?.price) || 0;
            const discount = Number(product?.discountPercentage) || 0;
            const discounted =
              discount > 0 ? Math.round((price * (100 - discount)) / 100) : price;

            return (
              <div
                key={id || index}
                className={`flex flex-col ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } items-center gap-12 px-8 md:px-20`}
              >
                {/* Image / Video hover (CLICKABLE) */}
                <div className="w-full md:w-1/2">
                  <Link
                    to={detailPath}
                    aria-label={`Open ${product?.title} details`}
                    title={product?.title}
                    className="block cursor-pointer"
                  >
                    <div className="relative group w-full h-[500px] overflow-hidden">
                      {/* Base Image */}
                      {cover ? (
                        <img
                          src={cover}
                          alt={product.title}
                          className="w-full h-full object-cover transition-opacity duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 grid place-items-center text-gray-400 text-xs tracking-widest">
                          No image
                        </div>
                      )}

                      {/* Video overlay (only if product.video exists) */}
                      {product?.video && (
                        <video
                          className="absolute inset-0 w-full h-full object-cover hidden group-hover:block"
                          muted
                          playsInline
                          loop
                          autoPlay
                          preload="metadata"
                          poster={cover || undefined}
                          src={product.video}
                        />
                      )}

                      {/* Play Button - Top Right (hidden on hover) */}
                      {product?.video && (
                        <div className="absolute top-6 right-6 group-hover:opacity-0 transition-opacity duration-300">
                          <div className="w-10 h-10 rounded-full border border-white bg-black/40 backdrop-blur-sm flex items-center justify-center">
                            <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-0.5"></div>
                          </div>
                        </div>
                      )}

                      {/* Bottom Dots - Video Progress Indicator */}
                      {product?.video && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                          <div className="w-2 h-2 rounded-full bg-white opacity-100 group-hover:animate-pulse"></div>
                          <div className="w-2 h-2 rounded-full bg-white opacity-60"></div>
                          <div className="w-2 h-2 rounded-full bg-white opacity-40"></div>
                        </div>
                      )}
                    </div>
                  </Link>
                </div>

                {/* Content */}
                <div className="w-full md:w-1/2 flex flex-col items-start space-y-6">
                  {product.isFeatured && (
                    <span className="text-[9px] tracking-[0.25em] uppercase text-gray-500 font-light">
                      FEATURED
                    </span>
                  )}

                  {/* Title (CLICKABLE) */}
                  <h3 className="text-2xl font-light tracking-wide">
                    <Link
                      to={detailPath}
                      className="hover:opacity-70 transition-opacity"
                      aria-label={`Open ${product?.title} details`}
                      title={product?.title}
                    >
                      {product.title}
                    </Link>
                  </h3>

                  <p className="text-sm leading-relaxed text-gray-600 font-light max-w-md">
                    {product.description}
                  </p>

                  <div className="flex items-baseline gap-4">
                    {discount > 0 ? (
                      <>
                        <span className="text-lg font-light">{discounted} €</span>
                        <span className="text-sm line-through text-gray-400">{price} €</span>
                        <span className="text-[10px] tracking-widest text-gray-400 uppercase">
                          {discount}% off
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-light">{price} €</span>
                    )}
                    <span className="text-[10px] tracking-widest text-gray-400 uppercase">
                      100ML
                    </span>
                  </div>

                  <button
                    className="mt-4 border border-black px-12 py-3 text-[10px] tracking-[0.3em] uppercase font-light hover:bg-black hover:text-white transition-all duration-300"
                    onClick={() => {
                      console.log("Add to Bag clicked for", id);
                    }}
                  >
                    Add to Bag
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View All */}
      <div className="text-center pb-20">
        <Link
          to="/collections"
          className="text-[10px] tracking-[0.3em] uppercase font-light border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors"
        >
          View All Products
        </Link>
      </div>
    </section>
  );
};

export default ProductFeatured;
