const Product = require("../models/Product");
const utilsHelper = require("../helpers/utils.helper");
const Category = require("../models/Category");
const productController = {};
const mongoose = require("mongoose");

productController.getAllProducts = async (req, res, next) => {
  try {
    let { page, limit, min, max, name, category, sortBy, ...filter } = {
      ...req.query,
    };

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 9;
    category = category || null;
    min = parseInt(min) || 0;
    max = parseInt(max) || 500000;

    if (sortBy) {
      Object.keys(sortBy).forEach(function (el) {
        sortBy[el] = parseInt(sortBy[el]);
      });
    } else {
      sortBy = { price: 1 };
    }

    let categorySearch = [];
    if (category) {
      let tempCategory = await Category.findById(category).lean();
      if (tempCategory) {
        if (tempCategory.parentCategory) {
          categorySearch.push(tempCategory._id);
        }
        if (!tempCategory.parentCategory) {
          let subCategories = await Category.find({ parentCategory: category });
          categorySearch = subCategories.map((x) => x._id);
        }
      }
    }

    let totalProducts;
    if (category) {
      totalProducts = await Product.countDocuments({
        name: new RegExp(name, "i"),
        category: { $in: categorySearch },
        price: { $gt: min, $lt: max },
        ...filter,
        isDeleted: false,
      });
    }
    if (!category) {
      console.log("running here", name);
      totalProducts = await Product.countDocuments({
        name: new RegExp(name, "i"),
        price: { $gt: min, $lt: max },
        isDeleted: false,
      });
    }

    const totalPages = Math.ceil(totalProducts / limit);
    const offset = limit * (page - 1);

    let products;
    if (categorySearch.length > 0) {
      console.log("categorySearch", categorySearch);
      console.log("name", name);
      products = await Product.aggregate([
        {
          $match: {
            category: { $in: categorySearch },
            name: new RegExp(name, "i"),
            price: { $gt: min, $lt: max },
          },
        },
        {
          $lookup: {
            from: "reviews",
            localField: "reviews",
            foreignField: "_id",
            as: "reviews",
          },
        },
        { $addFields: { avgRating: { $avg: "$reviews.rating" } } },
        { $sort: sortBy },
        { $skip: offset },
        { $limit: limit },
      ]);
    }

    console.log("products", products);

    if (categorySearch.length === 0) {
      console.log("ruuning to here", name);
      products = await Product.aggregate([
        {
          $match: {
            name: new RegExp(name, "i"),
            price: { $gt: min, $lt: max },
          },
        },
        {
          $lookup: {
            from: "reviews",
            localField: "reviews",
            foreignField: "_id",
            as: "reviews",
          },
        },
        { $addFields: { avgRating: { $avg: "$reviews.rating" } } },
        { $sort: sortBy },
        { $skip: offset },
        { $limit: limit },
      ]);
    }

    // if (products.length === 0) {
    //   return next(new Error("404 - Product not found"));
    // }

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { products, totalPages },
      null,
      `Get ${products.length} product Success`
    );
  } catch (error) {
    next(error);
  }
};
//Add new product
productController.addProduct = async (req, res, next) => {
  try {
    let product = await Product.findOne({ name: req.body.formData.name });
    if (product) return next(new Error("401 - Name already exists"));

    product = await Product.create({ ...req.body.formData });
    await product.populate("category").execPopulate();

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { product },
      null,
      "product created"
    );
  } catch (error) {
    next(error);
  }
};
//admin update product
productController.updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const { name, description, price, images } = req.body;

    const product = await Product.findOneAndUpdate(
      {
        _id: productId,
      },
      {
        name: name,
        description: description,
        price: price,
        images: images,
      },
      {
        new: true,
      }
    );
    if (!product) {
      return next(new Error("Product not found or User not authorized"));
    }

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { product },
      null,
      "Product updated"
    );
  } catch (error) {
    next(error);
  }
};
productController.getSingleProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id)
      .populate({
        path: "reviews",
        populate: { path: "owner" },
      })
      .populate("category")
      .lean();
    if (!product) {
      return next(new Error("Product not found"));
    }

    const productCount = await Product.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $lookup: {
          from: "reviews",
          localField: "reviews",
          foreignField: "_id",
          as: "reviews",
        },
      },
      { $addFields: { avgRating: { $avg: "$reviews.rating" } } },
    ]);
    const avgRating = productCount[0].avgRating;
    console.log("avgRating", avgRating);
    product = { ...product, avgRating };

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { product },
      null,
      "Get detail of single product success"
    );
  } catch (error) {
    next(error);
  }
};

//delete productController
productController.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        isDeleted: true,
      },
      { new: true }
    );
    if (!product) {
      return next(new Error("Product not found or User not authorized"));
    }
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { product },
      null,
      "Delete product"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = productController;
