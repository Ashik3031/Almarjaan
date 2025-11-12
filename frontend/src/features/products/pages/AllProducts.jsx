import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Stack,
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
  Pagination,
  IconButton,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";

import {
  fetchProductsAsync,
  selectProducts,
  selectProductFetchStatus,
  selectProductTotalResults,
  selectProductIsFilterOpen,
  toggleFilters,
} from "../ProductSlice";

import { ProductCard } from "../components/ProductCard"; // <- named export
import { Navbar } from "../../navigation/components/Navbar";

// ---- helpers ----
const DEFAULT_LIMIT = 24;

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },       // API default
  { value: "newest", label: "Newest" },             // maps to createdAt desc
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating_desc", label: "Rating" },
];

function useDebounced(value, delay = 350) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

// Map select value -> your API sort shape { sort, order }
function mapSortToApi(sortValue) {
  switch (sortValue) {
    case "newest":      return { sort: "createdAt", order: "desc" };
    case "price_asc":   return { sort: "price",     order: "asc"  };
    case "price_desc":  return { sort: "price",     order: "desc" };
    case "rating_desc": return { sort: "rating",    order: "desc" };
    default:            return undefined; // let backend use default relevance
  }
}

const AllProducts = () => {
  const dispatch = useDispatch();
  const [params, setParams] = useSearchParams();

  // URL state
  const page  = Number(params.get("page")  || 1);
  const limit = Number(params.get("limit") || DEFAULT_LIMIT);
  const sortValue = params.get("sort") || "relevance";
  const initialSearch = params.get("search") || "";
  const [search, setSearch] = useState(initialSearch);
  const debouncedSearch = useDebounced(search, 350);

  // Redux state
  const products = useSelector(selectProducts);
  const status = useSelector(selectProductFetchStatus);
  const totalResults = useSelector(selectProductTotalResults);
  const isFilterOpen = useSelector(selectProductIsFilterOpen);

  // Build filters for your ProductApi.fetchProducts()
  useEffect(() => {
    const filters = {
      pagination: { page, limit },
      search: debouncedSearch || undefined,
      // map sort for your API (your ProductApi expects { sort, order })
      sort: mapSortToApi(sortValue),
      // OPTIONAL: if you later use these, keep URL → API names consistent
      // category: params.getAll("category"),
      // subcategory: params.getAll("subCategory") || params.getAll("subcategory"),
      // brand: params.getAll("brand"),
      // minPrice: params.get("minPrice") || undefined,
      // maxPrice: params.get("maxPrice") || undefined,
      // inStock: params.get("inStock") || undefined,
      // rating: params.get("rating") || undefined,
    };

    dispatch(fetchProductsAsync(filters));
  }, [dispatch, page, limit, sortValue, debouncedSearch]); // eslint-disable-line

  const totalPages = useMemo(() => {
    if (!totalResults) return 1;
    return Math.max(1, Math.ceil(totalResults / limit));
  }, [totalResults, limit]);

  const loading = status === "pending";

  const updateParam = (key, value, resetPage = false) => {
    const next = new URLSearchParams(params);
    if (value === undefined || value === "" || value === null) next.delete(key);
    else next.set(key, String(value));
    if (resetPage) next.set("page", "1");
    setParams(next, { replace: true });
  };

  return (
    <>
    <Navbar />
    <Box sx={{ width: "100%", maxWidth: 1400, mx: "auto", px: { xs: 2, md: 4 }, py: 4 }}>
      {/* Top bar */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        gap={2}
        alignItems={{ xs: "stretch", md: "center" }}
        justifyContent="space-between"
        mb={3}
      >
        <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif" }}>
          All Products
        </Typography>

        <Stack direction="row" gap={2} alignItems="center" justifyContent="flex-end" flex={1}>
          <TextField
            size="small"
            placeholder="Search products…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              updateParam("search", e.target.value, true);
            }}
            sx={{ minWidth: 220 }}
          />

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="sort-label">Sort</InputLabel>
            <Select
              labelId="sort-label"
              label="Sort"
              value={sortValue}
              onChange={(e) => updateParam("sort", e.target.value, true)}
            >
              {SORT_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <IconButton onClick={() => dispatch(toggleFilters())} aria-label="filters">
            <FilterListIcon />
          </IconButton>
        </Stack>
      </Stack>

      {/* Count */}
      <Typography variant="body2" color="text.secondary" mb={2}>
        {loading ? "Loading…" : `${totalResults || 0} items`}
      </Typography>

      {/* Grid */}
      <Grid container spacing={3}>
        {loading
          ? Array.from({ length: 12 }).map((_, i) => (
              <Grid key={i} item xs={12} sm={6} md={4} lg={3}>
                <Skeleton variant="rectangular" height={280} />
                <Skeleton variant="text" />
                <Skeleton variant="text" width="60%" />
              </Grid>
            ))
          : (products || []).map((p) => {
              // --- map your product shape to ProductCard props ---
              const primaryImg =
                p?.images?.[0] ??
                p?.defaultImages?.[0] ??
                p?.thumbnail ??
                "";

              const price =
                p?.price ??
                p?.variants?.[0]?.price ??
                0;

              const stockQuantity = p?.stockQuantity
                ? Object.values(p.stockQuantity).reduce((a, b) => a + Number(b || 0), 0)
                : (p?.variants?.reduce((a, v) => a + Number(v?.stock || 0), 0) || 0);

              return (
                <Grid key={p?._id} item xs={12} sm={6} md={4} lg={3}>
                  <ProductCard
                    id={p?._id}
                    title={p?.title}
                    price={price}
                    thumbnail={primaryImg}              // <- ensures image shows
                    description={p?.brand || p?.category}
                    stockQuantity={stockQuantity}
                    // Optional: if you want wishlist toggle wired from here, pass a handler:
                    // handleAddRemoveFromWishlist={(e, id) => { ...dispatch create/delete... }}
                  />
                </Grid>
              );
            })}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Stack alignItems="center" mt={4}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => updateParam("page", value)}
            color="primary"
          />
        </Stack>
      )}
    </Box>
    </>
  );
};

export default AllProducts;
