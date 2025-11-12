/* eslint-disable array-callback-return */
import { axiosi } from "../../config/axios";

export const addProduct = async (data) => {
  try {
    const res = await axiosi.post("/products", data);
    return res.data;
  } catch (error) {
    throw (error.response?.data || error.message);
  }
};

// export const fetchProducts = async (filters = {}) => {
//   let queryString = "";

//   if (filters.isFeatured !== undefined) {
//     queryString += `isFeatured=${filters.isFeatured}&`;
//   }

//   if (filters.category) {
//     filters.category.forEach((cat) => {
//       queryString += `category=${cat}&`;
//     });
//   }

//   if (filters.subcategory) {
//     filters.subcategory.forEach((subcat) => {
//       queryString += `subCategory=${subcat}&`;
//     });
//   }

//   if (filters.pagination) {
//     queryString += `page=${filters.pagination.page}&limit=${filters.pagination.limit}&`;
//   }

//   if (filters.sort) {
//     queryString += `sort=${filters.sort.sort}&order=${filters.sort.order}&`;
//   }

//   if (filters.user) {
//     queryString += `user=${filters.user}&`;
//   }

//   if (filters.search) {
//     queryString += `search=${encodeURIComponent(filters.search)}&`;
//   }

//   try {
//     const res = await axiosi.get(`/products?${queryString}`);
//     const totalResults =
//       res.headers?.["x-total-count"] ??
//       res.headers?.["X-Total-Count"] ??
//       null;
//     return { data: res.data, totalResults };
//   } catch (error) {
//     throw (error.response?.data || error.message);
//   }
// };

//new code -archana 

export const fetchProducts = async (filters = {}) => {
  // Normalise & map UI → API params
  const {
    // pagination
    pagination,
    page: pageInRoot,
    limit: limitInRoot,
    // search & basic flags
    search,
    isFeatured,
    user,
    // taxonomy (support both single and array)
    category,
    subcategory,
    // extras
    brand,
    minPrice,
    maxPrice,
    inStock,
    rating,
    // sort comes as { sort, order } or a single value (e.g. "price_asc")
    sort,
  } = filters;

  // Compute final page/limit
  const page  = pagination?.page  ?? pageInRoot  ?? 1;
  const limit = pagination?.limit ?? limitInRoot ?? 24;

  // Map sort to backend expectation
  // Accept {sort:"price", order:"asc"} OR "price_asc" | "price_desc" | "newest" | "rating_desc"
  let sortField, order;
  if (sort && typeof sort === "object") {
    sortField = sort.sort;
    order = sort.order;
  } else if (typeof sort === "string") {
    if (sort === "newest") {
      sortField = "createdAt"; order = "desc";
    } else if (sort === "rating_desc") {
      sortField = "rating"; order = "desc";
    } else if (sort === "price_asc") {
      sortField = "price"; order = "asc";
    } else if (sort === "price_desc") {
      sortField = "price"; order = "desc";
    } else {
      // "relevance" or unknown -> let API default
      sortField = undefined; order = undefined;
    }
  }

  // Build params safely (axios will encode)
  const params = new URLSearchParams();

  // simple scalars
  if (page) params.set("page", page);
  if (limit) params.set("limit", limit);
  if (search) params.set("search", search);
  if (user) params.set("user", user);
  if (isFeatured !== undefined) params.set("isFeatured", isFeatured);

  // taxonomy: support single string or array
  const addArray = (key, value) => {
    if (!value) return;
    const arr = Array.isArray(value) ? value : [value];
    arr.forEach(v => params.append(key, v));
  };

  addArray("category", category);
  // your API uses "subCategory" (note the capital C). Keep that.
  addArray("subCategory", subcategory);

  // optional filters
  if (brand) addArray("brand", brand);
  if (minPrice !== undefined) params.set("minPrice", minPrice);
  if (maxPrice !== undefined) params.set("maxPrice", maxPrice);
  if (inStock !== undefined) params.set("inStock", inStock); // expect boolean/0/1 per backend
  if (rating !== undefined) params.set("rating", rating);

  // sorting (only include if defined)
  if (sortField) params.set("sort", sortField);
  if (order) params.set("order", order);

  try {
    const res = await axiosi.get(`/products`, { params });
    // Prefer header; fall back to body.meta if you add it later
    const totalResults =
      res.headers?.["x-total-count"] ??
      res.headers?.["X-Total-Count"] ??
      res.data?.totalResults ??
      null;

    return { data: res.data?.data ?? res.data, totalResults };
  } catch (error) {
    throw (error.response?.data || error.message);
  }
};



export const fetchFeaturedProducts = async ({ page = 1, limit = 6 } = {}) => {
  try {
    const res = await axiosi.get(`/products/featured?page=${page}&limit=${limit}`);
    // Backend returns: { data: [...], totalCount, currentPage, totalPages }
    return res.data;
  } catch (error) {
    throw (error.response?.data || error.message);
  }
};

export const fetchProductById = async (id) => {
  try {
    const res = await axiosi.get(`/products/${id}`);
    return res.data;
  } catch (error) {
    throw (error.response?.data || error.message);
  }
};

export const updateProductById = async (update) => {
  try {
    const res = await axiosi.patch(`/products/${update.get("_id")}`, update);
    return res.data;
  } catch (error) {
    throw (error.response?.data || error.message);
  }
};

export const softDeleteProductById = async (id) => {
  try {
    const res = await axiosi.patch(`/products/hide/${id}`);
    return res.data;
  } catch (error) {
    throw (error.response?.data || error.message);
  }
};

export const undeleteProductById = async (id) => {
  try {
    const res = await axiosi.patch(`/products/unhide/${id}`);
    return res.data;
  } catch (error) {
    throw (error.response?.data || error.message);
  }
};

export const deleteProductById = async (id) => {
  try {
    const res = await axiosi.delete(`/products/${id}`);
    return res.data;
  } catch (error) {
    throw (error.response?.data || error.message);
  }
};

export const toggleProductFeatured = async (id, isFeatured) => {
  try {
    const res = await axiosi.patch(`/products/featured/${id}`, { isFeatured });
    return res.data;
  } catch (error) {
    throw (error.response?.data || error.message);
  }
};

export const fetchProductSuggestions = async (query) => {
  try {
    const res = await axiosi.get(`/products/suggestions/${query}`);
    return res.data;
  } catch (error) {
    throw (error.response?.data || error.message);
  }
};

export const fetchSearchResults = async (query) => {
  try {
    const res = await axiosi.get(`/products/search?q=${encodeURIComponent(query)}`);
    return res.data;
  } catch (error) {
    throw (error.response?.data || error.message);
  }
};
