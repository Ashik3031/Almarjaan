// ProductDetails.jsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  clearSelectedProduct,
  fetchProductByIdAsync,
  resetProductFetchStatus,
  selectProductFetchStatus,
  selectSelectedProduct,
} from "../ProductSlice";
import {
  Box,
  Checkbox,
  Rating,
  Stack,
  Typography,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  addToCartAsync,
  resetCartItemAddStatus,
  selectCartItemAddStatus,
  selectCartItems,
} from "../../cart/CartSlice";
import { selectLoggedInUser } from "../../auth/AuthSlice";
import {
  fetchReviewsByProductIdAsync,
  resetReviewFetchStatus,
  selectReviewFetchStatus,
  selectReviews,
} from "../../review/ReviewSlice";
import { Reviews } from "../../review/components/Reviews";
import { toast } from "react-toastify";
import { MotionConfig, motion } from "framer-motion";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CachedOutlinedIcon from "@mui/icons-material/CachedOutlined";
import Favorite from "@mui/icons-material/Favorite";
import InventoryIcon from "@mui/icons-material/Inventory";
import {
  createWishlistItemAsync,
  deleteWishlistItemByIdAsync,
  resetWishlistItemAddStatus,
  resetWishlistItemDeleteStatus,
  selectWishlistItemAddStatus,
  selectWishlistItemDeleteStatus,
  selectWishlistItems,
} from "../../wishlist/WishlistSlice";
import { useTheme } from "@mui/material";
import Lottie from "lottie-react";
import { loadingAnimation } from "../../../assets";
import ImageSlider from "../../../components/ImageSlider";
import FeaturedProduct from "./FeaturedProduct";

export const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const product = useSelector(selectSelectedProduct);
  const loggedInUser = useSelector(selectLoggedInUser);
  const cartItems = useSelector(selectCartItems);
  const cartItemAddStatus = useSelector(selectCartItemAddStatus);
  const reviews = useSelector(selectReviews);
  const wishlistItems = useSelector(selectWishlistItems);

  const productFetchStatus = useSelector(selectProductFetchStatus);
  const reviewFetchStatus = useSelector(selectReviewFetchStatus);
  const wishlistItemAddStatus = useSelector(selectWishlistItemAddStatus);
  const wishlistItemDeleteStatus = useSelector(selectWishlistItemDeleteStatus);

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const theme = useTheme();
  const is480 = useMediaQuery(theme.breakpoints.down(480));
  const is840 = useMediaQuery(theme.breakpoints.down(840));
  const is990 = useMediaQuery(theme.breakpoints.down(990));
  const is1420 = useMediaQuery(theme.breakpoints.down(1420));
  const is387 = useMediaQuery(theme.breakpoints.down(387));

  const totalReviewRating = reviews.reduce((acc, review) => acc + review.rating, 0);
  const totalReviews = reviews.length;
  const averageRating = Math.ceil(totalReviewRating / (totalReviews || 1));

  const isProductAlreadyInCart = cartItems.some(
    (item) => item?.product?._id === id
  );

  const isProductAlreadyinWishlist = wishlistItems.some(
    (item) => item?.product?._id === id
  );

  const totalStock = Object.values(product?.stockQuantity || {}).reduce(
    (acc, qty) => acc + qty,
    0
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    if (id) {
      dispatch(fetchProductByIdAsync(id));
      dispatch(fetchReviewsByProductIdAsync(id));
    }

    return () => {
      dispatch(clearSelectedProduct());
      dispatch(resetProductFetchStatus());
      dispatch(resetReviewFetchStatus());
      dispatch(resetWishlistItemDeleteStatus());
      dispatch(resetWishlistItemAddStatus());
      dispatch(resetCartItemAddStatus());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (cartItemAddStatus === "fulfilled") toast.success("Product added to cart");
    else if (cartItemAddStatus === "rejected") toast.error("Error adding product to cart");
  }, [cartItemAddStatus]);

  useEffect(() => {
    if (wishlistItemAddStatus === "fulfilled") toast.success("Product added to wishlist");
    else if (wishlistItemAddStatus === "rejected") toast.error("Error adding to wishlist");
  }, [wishlistItemAddStatus]);

  useEffect(() => {
    if (wishlistItemDeleteStatus === "fulfilled") toast.success("Product removed from wishlist");
    else if (wishlistItemDeleteStatus === "rejected") toast.error("Error removing from wishlist");
  }, [wishlistItemDeleteStatus]);

  const handleAddToCart = () => {
    if (!loggedInUser) return navigate("/login");
    if (totalStock <= 0) return toast.error("Product is out of stock");

    const item = { user: loggedInUser._id, product: id, quantity };
    dispatch(addToCartAsync(item));
    setQuantity(1);
  };

  const handleDecreaseQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncreaseQty = () => {
    if (quantity < 20 && quantity < totalStock) {
      setQuantity(quantity + 1);
    } else {
      toast.warn("Maximum quantity reached");
    }
  };

  const handleAddRemoveFromWishlist = (e) => {
    if (e.target.checked) {
      dispatch(createWishlistItemAsync({ user: loggedInUser?._id, product: id }));
    } else {
      const index = wishlistItems.findIndex((item) => item?.product?._id === id);
      dispatch(deleteWishlistItemByIdAsync(wishlistItems[index]._id));
    }
  };

  return (
    <>
      {(productFetchStatus !== "rejected" || reviewFetchStatus !== "rejected") && (
        <Stack alignItems="center" mb="2rem" rowGap="2rem">
          {(productFetchStatus || reviewFetchStatus) === "pending" ? (
            <Stack height="calc(100vh - 4rem)" justifyContent="center" alignItems="center">
              <Lottie animationData={loadingAnimation} style={{ width: "20rem" }} />
            </Stack>
          ) : (
            <Stack>
              <Stack
                width={is480 ? "auto" : is1420 ? "auto" : "88rem"}
                height={is840 ? "auto" : "50rem"}
                p={is480 ? 2 : 0}
                mt={is840 ? 0 : 5}
                mb={5}
                flexDirection={is840 ? "column" : "row"}
                columnGap={is990 ? "2rem" : "5rem"}
              >
                {/* Image Section */}
                <Stack flexDirection="row" columnGap="2.5rem">
                  {!is1420 && (
                    <Stack rowGap="1.5rem" overflowY="scroll">
                      {product?.images.map((img, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.1 }}
                          onClick={() => setSelectedImageIndex(i)}
                          style={{ width: "200px", cursor: "pointer" }}
                        >
                          <img src={img} alt={product.title} style={{ width: "100%" }} />
                        </motion.div>
                      ))}
                    </Stack>
                  )}

                  <Stack mt={is480 ? 0 : "5rem"}>
                    {is1420 ? (
                      <Stack width={is480 ? "100%" : is990 ? "400px" : "500px"}>
                        <ImageSlider images={product?.images || []} />
                      </Stack>
                    ) : (
                      <div style={{ width: "70%" }}>
                        <img
                          src={product?.images[selectedImageIndex]}
                          alt={product?.title}
                          style={{
                            width: "100%",
                            objectFit: "contain",
                            aspectRatio: 1 / 0.8,
                            maxHeight: "650px",
                            margin: "0 auto",
                            display: "block",
                          }}
                        />
                      </div>
                    )}
                  </Stack>
                </Stack>

                {/* Product Info */}
                <Stack rowGap="1.5rem" width={is480 ? "100%" : "25rem"}>
                  <Stack rowGap=".5rem">
                    <Typography variant="h4" fontWeight={600}>{product?.title}</Typography>
                    <Stack direction="row" gap="1rem" flexWrap="wrap" alignItems="center">
                      <Rating value={averageRating} readOnly />
                      <Typography>
                        ({totalReviews === 0 ? "No reviews" : `${totalReviews} Reviews`})
                      </Typography>
                      <Typography color={totalStock === 0 ? "error" : totalStock <= 10 ? "orange" : "green"}>
                        {totalStock === 0
                          ? "Out of Stock"
                          : totalStock <= 10
                          ? `Only ${totalStock} left`
                          : "In Stock"}
                      </Typography>
                    </Stack>
                    <Typography variant="h5">AED {product?.price}</Typography>
                  </Stack>

                  <Typography>{product?.description}</Typography>

                  {!loggedInUser?.isAdmin && (
                    <Stack rowGap="1.3rem" width="fit-content">
                      <Stack direction="row" gap="1.5rem" alignItems="center">
                        <MotionConfig whileHover={{ scale: 1.05 }} whileTap={{ scale: 1 }}>
                          <motion.button
                            onClick={handleDecreaseQty}
                            style={{
                              padding: "10px 15px",
                              border: "1px solid black",
                              borderRadius: "8px",
                              background: "white",
                            }}
                          >
                            -
                          </motion.button>
                          <p style={{ fontSize: "1.1rem", margin: "0 1rem" }}>{quantity}</p>
                          <motion.button
                            onClick={handleIncreaseQty}
                            style={{
                              padding: "10px 15px",
                              backgroundColor: "black",
                              color: "white",
                              border: "none",
                              borderRadius: "8px",
                            }}
                          >
                            +
                          </motion.button>
                        </MotionConfig>

                        {isProductAlreadyInCart ? (
                          <button style={{ padding: "10px 15px", backgroundColor: "black", color: "white", borderRadius: "8px" }}>
                            In Cart
                          </button>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 1 }}
                            onClick={handleAddToCart}
                            disabled={totalStock <= 0}
                            style={{
                              padding: "10px 15px",
                              backgroundColor: totalStock <= 0 ? "gray" : "black",
                              color: "white",
                              borderRadius: "8px",
                              border: "none",
                              cursor: totalStock <= 0 ? "not-allowed" : "pointer",
                            }}
                          >
                            {totalStock <= 0 ? "Out of Stock" : "Add to Cart"}
                          </motion.button>
                        )}

                        <Checkbox
                          checked={isProductAlreadyinWishlist}
                          onChange={handleAddRemoveFromWishlist}
                          icon={<FavoriteBorder />}
                          checkedIcon={<Favorite sx={{ color: "red" }} />}
                        />
                      </Stack>
                    </Stack>
                  )}

                  {loggedInUser?.isAdmin ? (
                    <Stack mt={3} border="1px solid gray" borderRadius="7px">
                      <Stack p={2}>
                        <Typography variant="h6" display="flex" alignItems="center" mb={2}>
                          <InventoryIcon sx={{ mr: 1 }} /> Stock Per Variant
                        </Typography>
                        <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Size</TableCell>
                                <TableCell align="right">Available Stock</TableCell>
                                <TableCell align="right">Status</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {Object.entries(product?.stockQuantity || {}).map(([size, qty]) => (
                                <TableRow key={size}>
                                  <TableCell>{size}</TableCell>
                                  <TableCell align="right">{qty}</TableCell>
                                  <TableCell align="right" sx={{
                                    color: qty <= 0 ? "error.main" : qty <= 5 ? "warning.main" : "success.main"
                                  }}>
                                    {qty <= 0 ? "Out of Stock" : qty <= 5 ? "Low Stock" : "In Stock"}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Stack>
                    </Stack>
                  ) : (
                    <Stack mt={3} border="1px solid gray" borderRadius="7px">
                      <Stack p={2} direction="row" gap="1rem" alignItems="center">
                        <LocalShippingOutlinedIcon />
                        <Stack>
                          <Typography>Free Delivery</Typography>
                          <Typography>Enter your postal code for delivery availability</Typography>
                        </Stack>
                      </Stack>
                      <hr />
                      <Stack p={2} direction="row" gap="1rem" alignItems="center">
                        <CachedOutlinedIcon />
                        <Stack>
                          <Typography>Return Delivery</Typography>
                          <Typography>Free 30 Days Delivery Returns</Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  )}
                </Stack>
              </Stack>

              {/* Reviews */}
              <Stack width={is1420 ? "auto" : "88rem"} p={is480 ? 2 : 0}>
                <Reviews productId={id} averageRating={averageRating} />
              </Stack>
            </Stack>
          )}
        </Stack>
      )}
      <FeaturedProduct />
    </>
  );
};
