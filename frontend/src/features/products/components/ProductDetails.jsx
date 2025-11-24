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
  Divider,
  Collapse,
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
import { motion } from "framer-motion";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import InventoryIcon from "@mui/icons-material/Inventory";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
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
  const [expandedSection, setExpandedSection] = useState(null);

  const theme = useTheme();
  const is480 = useMediaQuery(theme.breakpoints.down(480));
  const is840 = useMediaQuery(theme.breakpoints.down(840));
  const is1420 = useMediaQuery(theme.breakpoints.down(1420));

  const totalReviewRating = reviews.reduce(
    (acc, review) => acc + review.rating,
    0
  );
  const totalReviews = reviews.length;
  const averageRating = Math.ceil(totalReviewRating / (totalReviews || 1));

  const isProductAlreadyInCart = cartItems.some(
    (item) => item?.product?._id === id
  );

  const isProductAlreadyinWishlist = wishlistItems.some(
    (item) => item?.product?._id === id
  );

  // ✅ CORRECT: use the Number field stockQuantity from schema
  const totalStock =
    typeof product?.stockQuantity === "number" ? product.stockQuantity : 0;

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
    if (cartItemAddStatus === "fulfilled")
      toast.success("Product added to cart");
    else if (cartItemAddStatus === "rejected")
      toast.error("Error adding product to cart");
  }, [cartItemAddStatus]);

  useEffect(() => {
    if (wishlistItemAddStatus === "fulfilled")
      toast.success("Product added to wishlist");
    else if (wishlistItemAddStatus === "rejected")
      toast.error("Error adding to wishlist");
  }, [wishlistItemAddStatus]);

  useEffect(() => {
    if (wishlistItemDeleteStatus === "fulfilled")
      toast.success("Product removed from wishlist");
    else if (wishlistItemDeleteStatus === "rejected")
      toast.error("Error removing from wishlist");
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
      dispatch(
        createWishlistItemAsync({ user: loggedInUser?._id, product: id })
      );
    } else {
      const index = wishlistItems.findIndex(
        (item) => item?.product?._id === id
      );
      dispatch(deleteWishlistItemByIdAsync(wishlistItems[index]._id));
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const ExpandableSection = ({ title, children }) => {
    const isExpanded = expandedSection === title;

    return (
      <Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          onClick={() => toggleSection(title)}
          sx={{
            cursor: "pointer",
            py: 2,
            "&:hover": { opacity: 0.7 },
            transition: "opacity 0.2s",
          }}
        >
          <Typography variant="body1">{title}</Typography>
          <KeyboardArrowRightIcon
            sx={{
              transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 0.3s",
            }}
          />
        </Stack>
        <Collapse in={isExpanded}>
          <Box pb={2}>{children}</Box>
        </Collapse>
        <Divider />
      </Box>
    );
  };

  const isLoading =
    productFetchStatus === "pending" || reviewFetchStatus === "pending";

  return (
    <>
      {(productFetchStatus !== "rejected" ||
        reviewFetchStatus !== "rejected") && (
        <Stack alignItems="center" mb="4rem">
          {isLoading ? (
            <Stack
              height="calc(100vh - 4rem)"
              justifyContent="center"
              alignItems="center"
            >
              <Lottie
                animationData={loadingAnimation}
                style={{ width: "20rem" }}
              />
            </Stack>
          ) : (
            <Stack width="100%">
              <Stack
                width="100%"
                maxWidth="1400px"
                margin="0 auto"
                p={is480 ? 2 : 4}
                mt={is840 ? 0 : 2}
                mb={8}
                flexDirection={is840 ? "column" : "row"}
                columnGap="4rem"
              >
                {/* Image Section */}
                <Stack
                  flex={is840 ? "1" : "0 0 55%"}
                  flexDirection="row"
                  columnGap="1rem"
                  position="relative"
                >
                  <Stack
                    width="100%"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {is1420 ? (
                      <Box width="100%" maxWidth="600px">
                        <ImageSlider images={product?.images || []} />
                      </Box>
                    ) : (
                      <Box
                        width="100%"
                        maxWidth="600px"
                        display="flex"
                        justifyContent="center"
                      >
                        <img
                          src={product?.images?.[selectedImageIndex]}
                          alt={product?.title}
                          style={{
                            width: "100%",
                            height: "auto",
                            objectFit: "contain",
                            maxHeight: "700px",
                          }}
                        />
                      </Box>
                    )}

                    {!is1420 && product?.images?.length > 1 && (
                      <Stack
                        direction="row"
                        gap="0.5rem"
                        mt={3}
                        justifyContent="center"
                      >
                        {product?.images.map((_, i) => (
                          <Box
                            key={i}
                            onClick={() => setSelectedImageIndex(i)}
                            sx={{
                              width: "10px",
                              height: "10px",
                              borderRadius: "50%",
                              backgroundColor:
                                selectedImageIndex === i ? "black" : "#ddd",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                            }}
                          />
                        ))}
                      </Stack>
                    )}
                  </Stack>
                </Stack>

                {/* Product Info */}
                <Stack
                  flex={is840 ? "1" : "0 0 40%"}
                  rowGap="2rem"
                  mt={is840 ? 4 : 0}
                >
                  {/* Title and Product Info */}
                  <Stack rowGap="1rem">
                    <Typography
                      variant={is480 ? "h5" : "h4"}
                      fontWeight={400}
                      letterSpacing="0.02em"
                      sx={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {product?.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontStyle: "italic" }}
                    >
                      {product?.category?.name ||
                        product?.category ||
                        product?.brand}
                    </Typography>
                  </Stack>

                  {/* Price and Stock */}
                  <Stack direction="row" alignItems="center" gap={2}>
                    <Typography variant="h6" fontWeight={400}>
                      AED {product?.price}
                    </Typography>
                    <Typography
                      variant="body2"
                      color={
                        totalStock === 0
                          ? "error"
                          : totalStock <= 10
                          ? "orange"
                          : "success.main"
                      }
                    >
                      {totalStock === 0
                        ? "Out of Stock"
                        : totalStock <= 10
                        ? `Only ${totalStock} left`
                        : "In Stock"}
                    </Typography>
                  </Stack>

                  {!loggedInUser?.isAdmin && (
                    <>
                      {/* Add to Cart Section */}
                      <Stack
                        direction="row"
                        gap={2}
                        alignItems="center"
                        flexWrap="wrap"
                      >
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleAddToCart}
                          disabled={totalStock <= 0 || isProductAlreadyInCart}
                          style={{
                            padding: "14px 40px",
                            backgroundColor:
                              totalStock <= 0 || isProductAlreadyInCart
                                ? "#e0e0e0"
                                : "black",
                            color:
                              totalStock <= 0 || isProductAlreadyInCart
                                ? "#999"
                                : "white",
                            border: "none",
                            cursor:
                              totalStock <= 0 || isProductAlreadyInCart
                                ? "not-allowed"
                                : "pointer",
                            fontSize: "0.95rem",
                            letterSpacing: "0.5px",
                            transition: "all 0.3s ease",
                          }}
                        >
                          {isProductAlreadyInCart
                            ? "In Cart"
                            : totalStock <= 0
                            ? "Out of Stock"
                            : `Add to bag · AED ${product?.price}`}
                        </motion.button>

                        <Checkbox
                          checked={isProductAlreadyinWishlist}
                          onChange={handleAddRemoveFromWishlist}
                          icon={<FavoriteBorder sx={{ fontSize: "1.8rem" }} />}
                          checkedIcon={
                            <Favorite
                              sx={{ color: "red", fontSize: "1.8rem" }}
                            />
                          }
                        />
                      </Stack>

                      {/* Features */}
                      <Stack gap={1.5} mt={2}>
                        <Stack direction="row" gap={1.5} alignItems="center">
                          <KeyboardArrowRightIcon fontSize="small" />
                          <Typography variant="body2">
                            Free Returns
                          </Typography>
                        </Stack>
                        <Stack direction="row" gap={1.5} alignItems="center">
                          <KeyboardArrowRightIcon fontSize="small" />
                          <Typography variant="body2">
                            2 free samples of your choice with every order
                          </Typography>
                        </Stack>
                      </Stack>

                      {/* Expandable Sections */}
                      <Stack mt={3}>
                        <ExpandableSection title="Description">
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            lineHeight={1.8}
                          >
                            {product?.description}
                          </Typography>
                        </ExpandableSection>

                        <ExpandableSection title="Refillable bottle">
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            lineHeight={1.8}
                          >
                            Our iconic fragrance bottles can be refilled at
                            certain stores. Simply take your empty bottle to a
                            participating Diptyque store to refill it.
                          </Typography>
                        </ExpandableSection>

                        <ExpandableSection title="Ingredients">
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            lineHeight={1.8}
                          >
                            {product?.ingredients ||
                              "Premium ingredients carefully selected for quality and performance."}
                          </Typography>
                        </ExpandableSection>
                      </Stack>
                    </>
                  )}

                  {loggedInUser?.isAdmin && (
                    <Stack
                      mt={3}
                      border="1px solid #e0e0e0"
                      borderRadius="0px"
                    >
                      <Stack p={3}>
                        <Typography
                          variant="h6"
                          display="flex"
                          alignItems="center"
                          mb={2}
                        >
                          <InventoryIcon sx={{ mr: 1 }} /> Stock Information
                        </Typography>
                        <TableContainer
                          component={Paper}
                          sx={{ maxHeight: 200, boxShadow: "none" }}
                        >
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell align="right">
                                  Available Stock
                                </TableCell>
                                <TableCell align="right">Status</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell>Total</TableCell>
                                <TableCell align="right">
                                  {totalStock}
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{
                                    color:
                                      totalStock <= 0
                                        ? "error.main"
                                        : totalStock <= 5
                                        ? "warning.main"
                                        : "success.main",
                                  }}
                                >
                                  {totalStock <= 0
                                    ? "Out of Stock"
                                    : totalStock <= 5
                                    ? "Low Stock"
                                    : "In Stock"}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Stack>
                    </Stack>
                  )}
                </Stack>
              </Stack>

              {/* Reviews */}
              <Stack
                width="100%"
                maxWidth="1400px"
                margin="0 auto"
                p={is480 ? 2 : 4}
              >
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
