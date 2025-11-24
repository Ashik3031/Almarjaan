import React, { useEffect, useState } from "react";
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
  const [playingVideo, setPlayingVideo] = useState(null);

  useEffect(() => {
    dispatch(fetchFeaturedProductsAsync({ page: 1, limit: 6 }));
  }, [dispatch]);

  const handleVideoToggle = (productId) => {
    setPlayingVideo(playingVideo === productId ? null : productId);
  };

  return (
    <section className="min-h-screen bg-white">
      {/* Header */}
      <div className="py-8 md:py-10 px-4 md:px-8">
        <h2 className="text-base md:text-lg tracking-[0.2em] md:tracking-[0.3em] text-center font-light uppercase">
          Featured Products
        </h2>
      </div>

      {/* Content */}
      {status === "pending" && (
        <div className="flex justify-center items-center py-16 md:py-24">
          <span className="text-xs tracking-[0.3em] uppercase text-gray-500">Loading…</span>
        </div>
      )}

      {status !== "pending" && featured.length === 0 && (
        <div className="flex justify-center items-center py-16 md:py-24">
          <span className="text-xs tracking-[0.3em] uppercase text-gray-500">
            No featured products
          </span>
        </div>
      )}

      {featured.length > 0 && (
        <div className="space-y-16 md:space-y-24 lg:space-y-32 pb-16 md:pb-24 lg:pb-32">
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
            const isVideoPlaying = playingVideo === id;

            return (
              <div
                key={id || index}
                className={`flex flex-col ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                } items-center gap-6 md:gap-8 lg:gap-12 px-4 md:px-8 lg:px-20`}
              >
                {/* Image / Video Section */}
                <div className="w-full lg:w-1/2">
                  {/* Desktop: Clickable link with hover video */}
                  <Link
                    to={detailPath}
                    aria-label={`Open ${product?.title} details`}
                    title={product?.title}
                    className="hidden lg:block cursor-pointer"
                  >
                    <div className="relative group w-full h-[400px] xl:h-[500px] overflow-hidden">
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

                      {/* Video overlay on hover (desktop only) */}
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

                      {/* Play Button - Top Right */}
                      {product?.video && (
                        <div className="absolute top-4 xl:top-6 right-4 xl:right-6 group-hover:opacity-0 transition-opacity duration-300">
                          <div className="w-10 h-10 rounded-full border border-white bg-black/40 backdrop-blur-sm flex items-center justify-center">
                            <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-0.5"></div>
                          </div>
                        </div>
                      )}

                      {/* Progress Dots */}
                      {product?.video && (
                        <div className="absolute bottom-4 xl:bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                          <div className="w-2 h-2 rounded-full bg-white opacity-100 group-hover:animate-pulse"></div>
                          <div className="w-2 h-2 rounded-full bg-white opacity-60"></div>
                          <div className="w-2 h-2 rounded-full bg-white opacity-40"></div>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Mobile/Tablet: Non-clickable with play button */}
                  <div className="lg:hidden">
                    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[450px] overflow-hidden">
                      {!isVideoPlaying ? (
                        <>
                          {/* Base Image */}
                          {cover ? (
                            <img
                              src={cover}
                              alt={product.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 grid place-items-center text-gray-400 text-xs tracking-widest">
                              No image
                            </div>
                          )}

                          {/* Play Button Overlay (mobile) */}
                          {product?.video && (
                            <button
                              onClick={() => handleVideoToggle(id)}
                              className="absolute top-4 right-4 z-10"
                              aria-label="Play video"
                            >
                              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors">
                                <div className="w-0 h-0 border-t-[6px] sm:border-t-[7px] border-t-transparent border-l-[10px] sm:border-l-[12px] border-l-white border-b-[6px] sm:border-b-[7px] border-b-transparent ml-0.5"></div>
                              </div>
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          {/* Video Player (mobile) */}
                          <video
                            className="w-full h-full object-cover"
                            controls
                            playsInline
                            autoPlay
                            preload="metadata"
                            poster={cover || undefined}
                            src={product.video}
                            onEnded={() => setPlayingVideo(null)}
                          />

                          {/* Close button */}
                          <button
                            onClick={() => setPlayingVideo(null)}
                            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white"
                            aria-label="Close video"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="w-full lg:w-1/2 flex flex-col items-start space-y-4 md:space-y-6">
                  {product.isFeatured && (
                    <span className="text-[9px] tracking-[0.25em] uppercase text-gray-500 font-light">
                      FEATURED
                    </span>
                  )}

                  {/* Title (Always clickable) */}
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-2xl font-light tracking-wide">
                    <Link
                      to={detailPath}
                      className="hover:opacity-70 transition-opacity"
                      aria-label={`Open ${product?.title} details`}
                      title={product?.title}
                    >
                      {product.title}
                    </Link>
                  </h3>

                  <p className="text-sm sm:text-base lg:text-sm leading-relaxed text-gray-600 font-light max-w-md">
                    {product.description}
                  </p>

                  <div className="flex flex-wrap items-baseline gap-3 md:gap-4">
                    {discount > 0 ? (
                      <>
                        <span className="text-lg sm:text-xl lg:text-lg font-light">{discounted} AED</span>
                        <span className="text-sm sm:text-base lg:text-sm line-through text-gray-400">{price} AED</span>
                        <span className="text-[10px] tracking-widest text-gray-400 uppercase">
                          {discount}% off
                        </span>
                      </>
                    ) : (
                      <span className="text-lg sm:text-xl lg:text-lg font-light">{price} €</span>
                    )}
                    <span className="text-[10px] tracking-widest text-gray-400 uppercase">
                      100ML
                    </span>
                  </div>

                  <button
                    className="mt-2 md:mt-4 w-full sm:w-auto border border-black px-8 sm:px-10 md:px-12 py-3 md:py-3.5 text-[10px] tracking-[0.25em] md:tracking-[0.3em] uppercase font-light hover:bg-black hover:text-white transition-all duration-300 active:scale-95"
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
      <div className="text-center pb-12 md:pb-16 lg:pb-20">
        <Link
          to="/products"
          className="text-[10px] tracking-[0.25em] md:tracking-[0.3em] uppercase font-light border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors"
        >
          View All Products
        </Link>
      </div>
    </section>
  );
};

export default ProductFeatured;