import React from "react";
import {
  Stack,
  Typography,
  Checkbox,
  FormHelperText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { selectWishlistItems } from "../../wishlist/WishlistSlice";
import { selectLoggedInUser } from "../../auth/AuthSlice";
import { addToCartAsync, selectCartItems } from "../../cart/CartSlice";
import { useToast } from "../../../components/ToastProvider";

export const ProductCard = ({
  id,
  title,
  price,
  thumbnail,
  description,
  stockQuantity,
  handleAddRemoveFromWishlist,
  isWishlistCard,
  isAdminCard,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlistItems = useSelector(selectWishlistItems);
  const cartItems = useSelector(selectCartItems);
  const loggedInUser = useSelector(selectLoggedInUser);
  const { showToast } = useToast();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const isInWishlist = wishlistItems.some((item) => item?.product?._id === id);
  const isInCart = cartItems.some((item) => item?.product?._id === id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!loggedInUser) return navigate("/login");

    // Optional: prevent adding if out of stock
    if (stockQuantity <= 0) {
      showToast("This item is out of stock", "error");
      return;
    }

    dispatch(
      addToCartAsync({
        user: loggedInUser?._id,
        product: id,
        quantity: 1, // ✅ fixed: no size, just quantity 1
      })
    );
    showToast("Item added to cart successfully!", "success");
  };

  return (
    <Stack
      width="100%"
      spacing={1}
      sx={{
        cursor: "pointer",
        overflow: "hidden",
      }}
      onClick={() => navigate(`/product-details/${id}`)}
    >
      {/* Full-cover image */}
      <img
        src={thumbnail}
        alt={`${title} `}
        style={{
          width: "100%",
          height: "300px",
          objectFit: "cover",
        }}
      />

      {/* Title + Wishlist */}
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle1" fontWeight="bold" noWrap>
          {title}
        </Typography>
        {!isAdminCard && (
          <motion.div
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Checkbox
              checked={isInWishlist}
              onChange={(e) => handleAddRemoveFromWishlist(e, id)}
              icon={<FavoriteBorder />}
              checkedIcon={<Favorite sx={{ color: "red" }} />}
            />
          </motion.div>
        )}
      </Stack>

      {/* Brand / description (1-line only) */}
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {description}
      </Typography>

      {/* Price + CTA */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography fontWeight={600}>AED {price}</Typography>
        {!isWishlistCard && !isAdminCard && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            disabled={isInCart || stockQuantity <= 0}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: "none",
              backgroundColor:
                isInCart || stockQuantity <= 0 ? "#e5e7eb" : "black",
              color:
                isInCart || stockQuantity <= 0 ? "#6b7280" : "white",
              fontSize: ".85rem",
              cursor:
                isInCart || stockQuantity <= 0
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {stockQuantity <= 0
              ? "Out of Stock"
              : isInCart
              ? "In Cart"
              : "Add to Cart"}
          </motion.button>
        )}
      </Stack>

      {/* Low stock warning */}
      {stockQuantity > 0 && stockQuantity <= 20 && (
        <FormHelperText error sx={{ fontSize: ".85rem" }}>
          {stockQuantity === 1
            ? "Only 1 stock is left"
            : "Only few are left"}
        </FormHelperText>
      )}
    </Stack>
  );
};
