import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  clearSelectedProduct,
  fetchProductByIdAsync,
  resetProductUpdateStatus,
  selectProductUpdateStatus,
  selectSelectedProduct,
  updateProductByIdAsync,
} from "../../products/ProductSlice";
import {
  Button,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Box,
  IconButton,
  Avatar,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";

export const ProductUpdate = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const is1100 = useMediaQuery(theme.breakpoints.down(1100));
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  const selectedProduct = useSelector(selectSelectedProduct);
  const productUpdateStatus = useSelector(selectProductUpdateStatus);

  // media state
  const [currentThumbnail, setCurrentThumbnail] = useState("");
  const [currentImages, setCurrentImages] = useState([]);
  const [newThumbnail, setNewThumbnail] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);

  // video state
  const [currentVideo, setCurrentVideo] = useState("");
  const [newVideo, setNewVideo] = useState(null);
  const [removeVideo, setRemoveVideo] = useState(false);

  // Fetch product
  useEffect(() => {
    if (id) dispatch(fetchProductByIdAsync(id));
  }, [id, dispatch]);

  // Hydrate form when product arrives
  useEffect(() => {
    if (!selectedProduct) return;

    reset({
      title: selectedProduct.title || "",
      description: selectedProduct.description || "",
      price: selectedProduct.price ?? "",
      discountPercentage: selectedProduct.discountPercentage ?? "",
      stockQuantity: selectedProduct.stockQuantity ?? "",
    });

    setCurrentThumbnail(
      selectedProduct.thumbnail ||
        selectedProduct.images?.[0] ||
        selectedProduct.defaultImages?.[0] ||
        ""
    );
    setCurrentImages(selectedProduct.images || selectedProduct.defaultImages || []);
    setCurrentVideo(selectedProduct.video || "");
    setNewThumbnail(null);
    setNewImages([]);
    setRemovedImages([]);
    setNewVideo(null);
    setRemoveVideo(false);
  }, [selectedProduct, reset]);

  // success/error toasts
  useEffect(() => {
    if (productUpdateStatus === "fullfilled") {
      toast.success("Product Updated");
      navigate("/admin/dashboard");
    } else if (productUpdateStatus === "rejected") {
      toast.error("Error updating product, please try again later");
    }
  }, [productUpdateStatus, navigate]);

  // cleanup
  useEffect(() => {
    return () => {
      dispatch(clearSelectedProduct());
      dispatch(resetProductUpdateStatus());
    };
  }, [dispatch]);

  // handlers
  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewThumbnail(file);
    const reader = new FileReader();
    reader.onload = () => setCurrentThumbnail(reader.result);
    reader.readAsDataURL(file);
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) setNewImages((prev) => [...prev, ...files]);
  };

  const removeExistingImage = (index) => {
    setRemovedImages((prev) => [...prev, currentImages[index]]);
    setCurrentImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0] || null;
    setNewVideo(file);
    if (file) setRemoveVideo(false);
  };

  const handleRemoveCurrentVideo = () => {
    setRemoveVideo(true);
    setNewVideo(null);
  };

  // submit
  const handleProductUpdate = (data) => {
    const formData = new FormData();

    // basics
    formData.append("_id", selectedProduct._id);
    formData.append("title", data.title);
    formData.append("description", data.description || "");
    formData.append("price", data.price);
    formData.append("discountPercentage", data.discountPercentage || 0);

    // stockQuantity (number OR map)
    if (typeof data.stockQuantity === "object" && data.stockQuantity !== null) {
      Object.entries(data.stockQuantity).forEach(([size, quantity]) => {
        formData.append(`stockQuantity[${size}]`, quantity);
      });
    } else if (data.stockQuantity !== undefined) {
      formData.append("stockQuantity", data.stockQuantity);
    }

    // thumbnail
    if (newThumbnail) {
      formData.append("thumbnail", newThumbnail);
    } else if (!currentThumbnail) {
      // explicit removal
      formData.append("thumbnail", "");
    }

    // existing images kept
    (currentImages || [])
      .filter((img) => !removedImages.includes(img))
      .forEach((img) => formData.append("existingImages", img));

    // images to remove
    (removedImages || []).forEach((img) => formData.append("removedImages", img));

    // new images
    (newImages || []).forEach((file) => formData.append("images", file));

    // video
    if (newVideo) formData.append("video", newVideo);
    if (removeVideo) formData.append("removeVideo", "true");

    dispatch(updateProductByIdAsync(formData));
  };

  return (
    <Stack p={2} justifyContent="center" alignItems="center">
      {selectedProduct && (
        <Stack
          width={is1100 ? "100%" : "60rem"}
          spacing={4}
          mt={is480 ? 4 : 6}
          mb={6}
          component="form"
          noValidate
          onSubmit={handleSubmit(handleProductUpdate)}
        >
          <TextField
            label="Product Name"
            {...register("title", { required: "Title is required" })}
            error={!!errors.title}
            helperText={errors.title?.message}
          />

          <TextField
            label="Description"
            multiline
            rows={4}
            {...register("description", { required: "Description is required" })}
            error={!!errors.description}
            helperText={errors.description?.message}
          />

          <Stack direction={is480 ? "column" : "row"} spacing={2}>
            <TextField
              label="Price"
              type="number"
              {...register("price", { required: "Price is required" })}
              error={!!errors.price}
              helperText={errors.price?.message}
            />
            <TextField
              label="Discount Percentage"
              type="number"
              {...register("discountPercentage", { required: "Discount is required" })}
              error={!!errors.discountPercentage}
              helperText={errors.discountPercentage?.message}
            />
          </Stack>

          {/* Stock (single number version) */}
          <TextField
            label="Stock Quantity"
            type="number"
            {...register("stockQuantity", {
              required: "Stock quantity is required",
              min: { value: 0, message: "Stock cannot be negative" },
            })}
            error={!!errors.stockQuantity}
            helperText={errors.stockQuantity?.message}
          />

          {/* Thumbnail */}
          <Box>
            <Typography gutterBottom>Current Thumbnail</Typography>
            {currentThumbnail && (
              <Box sx={{ position: "relative", width: "fit-content" }}>
                <Avatar
                  src={currentThumbnail}
                  alt="Thumbnail preview"
                  sx={{ width: 100, height: 100 }}
                  variant="rounded"
                />
                <IconButton
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bgcolor: "rgba(255,255,255,0.7)",
                  }}
                  onClick={() => {
                    setCurrentThumbnail("");
                    setNewThumbnail(null);
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
            <input type="file" accept="image/*" onChange={handleThumbnailChange} style={{ marginTop: 8 }} />
          </Box>

          {/* Images */}
          <Box>
            <Typography gutterBottom>Product Images</Typography>
            <Stack direction="row" flexWrap="wrap" gap={2}>
              {currentImages.map((image, index) => (
                <Box key={`existing-${index}`} sx={{ position: "relative" }}>
                  <Avatar
                    src={image}
                    alt={`Product image ${index + 1}`}
                    sx={{ width: 100, height: 100 }}
                    variant="rounded"
                  />
                  <IconButton
                    onClick={() => removeExistingImage(index)}
                    sx={{ position: "absolute", top: -10, right: -10, bgcolor: "white" }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}

              {newImages.map((image, index) => (
                <Box key={`new-${index}`} sx={{ position: "relative" }}>
                  <Avatar
                    src={URL.createObjectURL(image)}
                    alt={`New image ${index + 1}`}
                    sx={{ width: 100, height: 100 }}
                    variant="rounded"
                  />
                  <IconButton
                    onClick={() => removeNewImage(index)}
                    sx={{ position: "absolute", top: -10, right: -10, bgcolor: "white" }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Stack>

            <input type="file" accept="image/*" multiple onChange={handleImagesChange} style={{ marginTop: 16 }} />
          </Box>

          {/* Video */}
          <Box>
            <Typography gutterBottom>Product Video (optional)</Typography>

            {currentVideo && !removeVideo && !newVideo && (
              <Box sx={{ mb: 1 }}>
                <video
                  src={currentVideo}
                  controls
                  style={{ width: "100%", maxWidth: 420, borderRadius: 8, display: "block" }}
                />
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={handleRemoveCurrentVideo}
                >
                  Remove current video
                </Button>
              </Box>
            )}

            {newVideo && (
              <Box sx={{ mb: 1 }}>
                <video
                  src={URL.createObjectURL(newVideo)}
                  controls
                  style={{ width: "100%", maxWidth: 420, borderRadius: 8, display: "block" }}
                />
                <Typography variant="caption">
                  {newVideo.name} ({Math.round((newVideo.size / 1024 / 1024) * 10) / 10} MB)
                </Typography>
              </Box>
            )}

            <input type="file" accept="video/*" onChange={handleVideoChange} style={{ marginTop: 8 }} />
          </Box>

          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button variant="contained" type="submit">
              Update Product
            </Button>
            <Button variant="outlined" color="error" component={Link} to="/admin/dashboard">
              Cancel
            </Button>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};
