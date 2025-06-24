import React, { useState } from "react";
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
  const [selectedSize, setSelectedSize] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const isInWishlist = wishlistItems.some((item) => item?.product?._id === id);
  const isInCart = cartItems.some((item) => item?.product?._id === id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!loggedInUser) return navigate("/login");
    if (!selectedSize) {
      showToast("Please select a size before adding to cart", "error");
      return;
    }
    dispatch(addToCartAsync({ user: loggedInUser?._id, product: id }));
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

      {/* Brand (1-line only) */}
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
            onClick={(e) => handleAddToCart(e)}
            disabled={isInCart}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: isInCart ? "#e5e7eb" : "black",
              color: isInCart ? "#6b7280" : "white",
              fontSize: ".85rem",
              cursor: isInCart ? "not-allowed" : "pointer",
            }}
          >
            {isInCart ? "In Cart" : "Add to Cart"}
          </motion.button>
        )}
      </Stack>

      {/* Low stock warning */}
      {stockQuantity <= 20 && (
        <FormHelperText error sx={{ fontSize: ".85rem" }}>
          {stockQuantity === 1 ? "Only 1 stock is left" : "Only few are left"}
        </FormHelperText>
      )}
    </Stack>
  );
};
