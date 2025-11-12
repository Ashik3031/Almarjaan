import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  addProductAsync,
  resetProductAddStatus,
  selectProductAddStatus,
} from "../../products/ProductSlice";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { selectCategories } from "../../categories/CategoriesSlice";
import { toast } from "react-toastify";

export const AddProduct = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const categories = useSelector(selectCategories) || [];
  const productAddStatus = useSelector(selectProductAddStatus);
  const navigate = useNavigate();
  const theme = useTheme();
  const is1100 = useMediaQuery(theme.breakpoints.down(1100));
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [subCategories, setSubCategories] = useState([]);

  // media state
  const [thumbnail, setThumbnail] = useState(null);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [video, setVideo] = useState(null); // NEW

  const isLoading = productAddStatus === "pending";

  useEffect(() => {
    if (productAddStatus === "fullfilled") {
      reset();
      setThumbnail(null);
      setUploadedImageUrls([]);
      setVideo(null);
      toast.success("New product added");
      navigate("/admin/dashboard");
    } else if (productAddStatus === "rejected") {
      toast.error("Error adding product, please try again later");
    }
  }, [productAddStatus, navigate, reset]);

  useEffect(() => {
    return () => {
      dispatch(resetProductAddStatus());
    };
  }, [dispatch]);

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategoryId(categoryId);
    const category = categories.find((cat) => cat._id === categoryId);
    setSubCategories(category?.subCategory || []);
  };

  const handleAddProduct = (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("discountPercentage", data.discountPercentage);
    formData.append("category", data.category || "");
    formData.append("subCategory", data.subCategory || "");
    formData.append("stockQuantity", data.stockQuantity);

    if (thumbnail) formData.append("thumbnail", thumbnail);
    uploadedImageUrls.forEach((imageFile) => {
      formData.append("images", imageFile);
    });

    // NEW: append video (optional)
    if (video) {
      formData.append("video", video);
    }

    dispatch(addProductAsync(formData));
  };

  return (
    <Stack p={2} justifyContent="center" alignItems="center">
      <Stack
        width={is1100 ? "100%" : "60rem"}
        spacing={4}
        mt={is480 ? 4 : 6}
        mb={6}
        component="form"
        noValidate
        onSubmit={handleSubmit(handleAddProduct)}
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
            {...register("discountPercentage", {
              required: "Discount is required",
            })}
            error={!!errors.discountPercentage}
            helperText={errors.discountPercentage?.message}
          />
        </Stack>

        <TextField
          label="Stock Quantity"
          type="number"
          {...register("stockQuantity", {
            required: "Stock Quantity is required",
            min: { value: 0, message: "Stock Quantity must be greater than 0" },
          })}
          error={!!errors.stockQuantity}
          helperText={errors.stockQuantity?.message}
        />

        <Typography>Upload Thumbnail</Typography>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
        />

        <Typography>Upload Images (up to 4)</Typography>
        {[1, 2, 3, 4].map((index) => (
          <Stack key={index} direction="row" alignItems="center" spacing={2}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setUploadedImageUrls((prev) => [...prev, file]);
              }}
            />
          </Stack>
        ))}

        {/* NEW: Video upload */}
        <Typography>Upload Product Video (optional)</Typography>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files?.[0] || null)}
        />
        {video && (
          <Typography variant="caption">
            Selected video: {video.name} ({Math.round((video.size / 1024 / 1024) * 10) / 10} MB)
          </Typography>
        )}

        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button variant="contained" type="submit" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Product"}
          </Button>
          <Button
            variant="outlined"
            color="error"
            component={Link}
            to="/admin/dashboard"
          >
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};
