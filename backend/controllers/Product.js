const { Schema, default: mongoose } = require("mongoose");
const Product = require("../models/Product");
const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");

// exports.create = async (req, res) => {
//   const {
//     title,
//     description,
//     price,
//     discountPercentage,
//     category,
//     subCategory,
//     stockQuantity,
//     thumbnail,
//     images,
//   } = req.body;

//   try {
//     // Validate required fields
//     if (
//       !title ||
//       !description ||
//       !price ||
//       !category ||
//       !subCategory ||
//       !stockQuantity ||
//       !images
//     ) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // Validate that price and discountPercentage are numbers
//     if (isNaN(price) || isNaN(discountPercentage)) {
//       return res
//         .status(400)
//         .json({ message: "Price and discountPercentage must be numbers" });
//     }

//     // Validate that stockQuantity is an object and convert it to Map if so
//     if (typeof stockQuantity !== "object" || Array.isArray(stockQuantity)) {
//       return res
//         .status(400)
//         .json({ message: "stockQuantity must be an object" });
//     }
//     const stockQuantityMap = new Map(Object.entries(stockQuantity));

//     // Validate that the subCategory belongs to the given category
//     const validSubCategory = await SubCategory.findOne({
//       _id: subCategory,
//       category: category,
//     });

//     if (!validSubCategory) {
//       return res
//         .status(400)
//         .json({ message: "SubCategory does not belong to the given category" });
//     }

//     // Create the new product
//     const newProduct = new Product({
//       title,
//       description,
//       price: parseFloat(price), // Ensure price is a number
//       discountPercentage: parseFloat(discountPercentage), // Ensure discountPercentage is a number
//       category,
//       subcategory: subCategory,
//       stockQuantity: stockQuantityMap,
//       thumbnail,
//       images,
//     });

//     await newProduct.save();

//     res.status(201).json(newProduct);
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .json({ message: "Error adding product, please try again later" });
//   }
// };

exports.create = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      discountPercentage,
      category,
      subCategory,
      stockQuantity,
    } = req.body;

    if (!title || !description || !price || !stockQuantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (isNaN(price) || (discountPercentage && isNaN(discountPercentage))) {
      return res.status(400).json({
        message: "Price and discountPercentage must be numbers",
      });
    }

    // Files (multer .fields)
    const thumbnailFile = req.files?.["thumbnail"]?.[0];
    const imageFiles = req.files?.["images"] || [];
    const videoFile = req.files?.["video"]?.[0]; // NEW

    const thumbnail = thumbnailFile?.path;
    const images = imageFiles.map((file) => file.path);
    const video = videoFile?.path || null; // NEW

    const newProduct = new Product({
      title,
      description,
      price: parseFloat(price),
      discountPercentage: parseFloat(discountPercentage || 0),
      // category: category || null,
      // subcategory: subCategory || null,
      stockQuantity: parseInt(stockQuantity, 10),
      thumbnail,
      images,
      video, // NEW
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res
      .status(500)
      .json({ message: "Error adding product, please try again later" });
  }
};



exports.getAll = async (req, res) => {
  try {
    const filter = {};
    const sort = {};
    let skip = 0;
    let limit = 0;

    // Ensure both category and subCategory are applied correctly
    if (req.query.category) {
      filter.category = req.query.category;

      if (req.query.subCategory) {
        filter.subcategory = req.query.subCategory;
      }
    }

    if (!req.query.category && req.query.subCategory) {
      return res
        .status(400)
        .json({ message: "Please provide a category with the subCategory" });
    }


// Search
    const isSearch = !!req.query.search || !!req.query.query;;
    if (isSearch) {
      const searchTerm = req.query.search || req.query.query;
      const searchRegex = new RegExp(req.query.search, "i");
      filter.$or = [
        { title: searchRegex },
      ];
    }
    

    if (req.query.sort) {
      sort[req.query.sort] = req.query.order === "asc" ? 1 : -1;
    }
// Pagination only when not searching
    if (req.query.page && req.query.limit) {
  const pageSize = parseInt(req.query.limit, 10) || 10;
  const page = parseInt(req.query.page, 10) || 1;
  skip = pageSize * (page - 1);
  limit = pageSize;
}
    // if (req.query.page && req.query.limit) {
    //   const pageSize = parseInt(req.query.limit, 10) || 10;
    //   const page = parseInt(req.query.page, 10) || 1;
    //   skip = pageSize * (page - 1);
    //   limit = pageSize;
    // }

    // const totalDocs = await Product.countDocuments(filter);
//     const results = await Product.find(filter)
//       .sort(sort)
//       .skip(skip)
//       .limit(limit || 10);

//     res.set("X-Total-Count", totalDocs.toString());
//     res.status(200).json(results);
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res
//       .status(500)
//       .json({ message: "Error fetching products, please try again later" });
//   }
// };

const totalDocs = await Product.countDocuments(filter);
    const query = Product.find(filter).sort(sort);

    if (limit) {
  query.skip(skip).limit(limit);
}
    const results = await query.exec();

    res.set("X-Total-Count", totalDocs.toString());
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ message: "Error fetching products, please try again later" });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Product.findById(id)
      .populate("category")
      .populate("subcategory");
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error getting product details, please try again later",
    });
  }
};

// exports.updateById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updated = await Product.findByIdAndUpdate(id, req.body, {
//       new: true,
//     });
//     res.status(200).json(updated);
//   } catch (error) {
//     console.log(error);
//     res
//       .status(500)
//       .json({ message: "Error updating product, please try again later" });
//   }
// };

//ashik code

// exports.updateById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const existingProduct = await Product.findById(id);
    
//     if (!existingProduct) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     const updatedFields = { ...req.body };

//     // Handle thumbnail
//     if (req.files["thumbnail"]?.[0]) {
//       updatedFields.thumbnail = req.files["thumbnail"][0].path;
//     }

//     // Handle images - start with existing images
//     let finalImages = [...existingProduct.images];

//     // Remove images marked for deletion
//     if (req.body.removedImages) {
//       const removedUrls = Array.isArray(req.body.removedImages) 
//         ? req.body.removedImages 
//         : [req.body.removedImages];
//       finalImages = finalImages.filter(img => !removedUrls.includes(img));
//     }

//     // Add new images (only if they don't already exist)
//     if (req.files["images"]) {
//       const newImageUrls = req.files["images"].map(file => file.path);
//       newImageUrls.forEach(url => {
//         if (!finalImages.includes(url)) {
//           finalImages.push(url);
//         }
//       });
//     }

//     updatedFields.images = finalImages;

//     const removeVideo = body.removeVideo === "true";
//     if (removeVideo) {
//       updated.video = undefined;  // optionally also delete from storage
//     }
//     if (req.files?.video?.[0]) {
//       updated.video = req.files.video[0].path;
//     }

//     const updated = await Product.findByIdAndUpdate(id, updatedFields, {
//       new: true,
//     });

//     res.status(200).json(updated);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error updating product" });
//   }
// };

//new code - archana

exports.updateById = async (req, res) => {
  try {
    const { id } = req.params;
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const b = req.body || {};
    const updatedFields = {};     // for $set
    const unset = {};             // for $unset

    // helper to only set valid numbers
    const toNum = (val) => {
      if (val === undefined || val === null || val === "") return undefined;
      const n = parseFloat(val);
      return Number.isNaN(n) ? undefined : n;
    };

    // Scalars (only set when provided & valid)
    if (b.title !== undefined && b.title !== "") updatedFields.title = b.title;
    if (b.description !== undefined && b.description !== "") updatedFields.description = b.description;

    const priceNum = toNum(b.price);
    if (priceNum !== undefined) updatedFields.price = priceNum;

    const discNum = toNum(b.discountPercentage);
    if (discNum !== undefined) updatedFields.discountPercentage = discNum;

    // If you still keep stockQuantity as a single number:
    const stockNum = toNum(b.stockQuantity);
    if (stockNum !== undefined) updatedFields.stockQuantity = stockNum;

    // Thumbnail
    if (req.files?.thumbnail?.[0]) {
      updatedFields.thumbnail = req.files.thumbnail[0].path;
    } else if (b.thumbnail === "") {
      // explicit removal
      unset.thumbnail = 1;
    }

    // Images (merge existing - removals + new)
    let finalImages = Array.isArray(existingProduct.images) ? [...existingProduct.images] : [];

    if (b.removedImages !== undefined) {
      const removed = Array.isArray(b.removedImages) ? b.removedImages : [b.removedImages];
      finalImages = finalImages.filter((url) => !removed.includes(url));
    }

    if (req.files?.images?.length) {
      const newUrls = req.files.images.map((f) => f.path);
      newUrls.forEach((u) => {
        if (!finalImages.includes(u)) finalImages.push(u);
      });
    }

    updatedFields.images = finalImages;

    // Video
    const removeVideo = b.removeVideo === "true";
    if (removeVideo) unset.video = 1;

    if (req.files?.video?.[0]) {
      updatedFields.video = req.files.video[0].path;
      if (unset.video) delete unset.video; // prefer the new upload if both sent
    }

    // Build update
    const updateQuery = {};
    if (Object.keys(updatedFields).length) updateQuery.$set = updatedFields;
    if (Object.keys(unset).length) updateQuery.$unset = unset;

    const updatedDoc = await Product.findByIdAndUpdate(id, updateQuery, { new: true });
    return res.status(200).json(updatedDoc);
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ message: error.message || "Error updating product" });
  }
};



// exports.updateById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const existingProduct = await Product.findById(id);
//     if (!existingProduct) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     const {
//       title,
//       description,
//       price,
//       discountPercentage,
//       category,
//       subCategory,
//     } = req.body;

//     const stockQuantity = req.body.stockQuantity
//       ? JSON.parse(req.body.stockQuantity)
//       : existingProduct.stockQuantity;

//     const stockQuantityMap = new Map(Object.entries(stockQuantity));

//     // Handle image updates
//     let thumbnail = existingProduct.thumbnail;
//     let images = existingProduct.images;

//     const thumbnailFile = req.files["thumbnail"]?.[0];
//     const imageFiles = req.files["images"] || [];

//     if (thumbnailFile) {
//       thumbnail = thumbnailFile.path;
//     }

//     if (imageFiles.length > 0) {
//       images = imageFiles.map((file) => file.path);
//     }

//     const updatedProduct = await Product.findByIdAndUpdate(
//       id,
//       {
//         title,
//         description,
//         price: parseFloat(price),
//         discountPercentage: parseFloat(discountPercentage),
//         category,
//         subcategory: subCategory,
//         stockQuantity: stockQuantityMap,
//         thumbnail,
//         images,
//       },
//       { new: true }
//     );

//     res.status(200).json(updatedProduct);
//   } catch (error) {
//     console.error("Error updating product:", error);
//     res
//       .status(500)
//       .json({ message: "Error updating product, please try again later" });
//   }
// };


exports.undeleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const restored = await Product.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true }
    );
    res.status(200).json(restored);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error restoring product, please try again later" });
  }
};

exports.softdeleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    res.status(200).json(deleted);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error hiding product" });
  }
};
exports.deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.status(200).json({ message: "Product successfully deleted" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error deleting product, please try again later" });
  }
};

exports.getFeaturedProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = (page - 1) * limit;
    const featuredProducts = await Product.find({
      isFeatured: true,
      isDeleted: { $ne: true },
    })
      .skip(startIndex)
      .limit(limit);

    // getting the total count of featured products
    const totalCount = await Product.countDocuments({ isFeatured: true });

    res.status(200).json({
      data: featuredProducts,
      totalCount,
      currenPage: page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error fetching featured products, please try again later",
    });
  }
};

exports.getLatestProducts = async (req, res) => {
  const categoryName = req.params.category;
  console.log(categoryName, "categoryName");

  try {
    const category = await Category.findOne({ name: categoryName });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const categoryId = category._id;
    console.log(categoryId, "categoryId");

    const products = await Product.find({ category: categoryId })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(products);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Error Fetching Products, Please try again later" });
  }
};

exports.featuredProduct = async (req, res) => { 
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    const isFeatured = !product.isFeatured; // toggle the state
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { isFeatured },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Error Fetching Product, Please try again later" });
  }
};

exports.getProductSuggestions = async (req, res) => {
  try {
    const { query } = req.params;
   
    if (!query || query.trim().length < 2) {
      return res.json([]);
    }
    const suggestions = await Product.find({
      title: { $regex: query, $options: "i" },
    })
      .limit(5)
      .select("title description");

    res.json(suggestions);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error Fetching Suggestions, Please try again Later" });
  }
};


exports.searchProducts = async (req, res) =>{
  try {
    const query = req.query.q;
    console.log(query, "query");
    if(!query) return res.status(400).json({ message: "Query is required" });

    const products = await Product.find({
      title: { $regex: query, $options: "i" },
      isDeleted: false,
    });

    res.json(products);
  }catch(error){
    res.status(500).json({message:"Server error", error});
  }
}

exports.getFeaturedProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "10", 10);
    const skip = (page - 1) * limit;

    const filter = { isFeatured: true, isDeleted: { $ne: true } };

    const [items, totalCount] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      data: items,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching featured products, please try again later" });
  }
};

exports.getLatestProducts = async (req, res) => {
  const categoryName = req.params.category;
  try {
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    const products = await Product.find({
      category: category._id,
      isDeleted: { $ne: true },
    })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error Fetching Products, Please try again later" });
  }
};

exports.featuredProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const current = await Product.findById(id);
    if (!current) return res.status(404).json({ message: "Product not found" });
    const updated = await Product.findByIdAndUpdate(
      id,
      { isFeatured: !current.isFeatured },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error Fetching Product, Please try again later" });
  }
};

exports.getProductSuggestions = async (req, res) => {
  try {
    const { query } = req.params;
    if (!query || query.trim().length < 2) {
      return res.json([]);
    }
    const suggestions = await Product.find({
      title: { $regex: query, $options: "i" },
      isDeleted: { $ne: true },
    })
      .limit(5)
      .select("title description");
    res.json(suggestions);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error Fetching Suggestions, Please try again Later" });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ message: "Query is required" });
    const regex = new RegExp(String(q).trim(), "i");
    const products = await Product.find({
      isDeleted: { $ne: true },
      $or: [{ title: regex }, { description: regex }],
    }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};