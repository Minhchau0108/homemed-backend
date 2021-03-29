const Category = require("../models/Category");
const utilsHelper = require("../helpers/utils.helper");
const Product = require("../models/Product");
const categoryController = {};

categoryController.getAllCategory = async (req, res, next) => {
  try {
    const categories = await Category.find({}).populate("parentCategory");

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { categories },
      null,
      "get all categories success"
    );
  } catch (error) {
    next(error);
  }
};
categoryController.getMainCategory = async (req, res, next) => {
  try {
    const categories = await Category.find({ parentCategory: null }).lean();
    const groupCategories = [];

    for (let i = 0; i < categories.length; i++) {
      let sum = 0;
      const subCategories = await Category.find({
        parentCategory: categories[i]._id,
      }).lean();
      console.log("subCategories", subCategories[0]._id);
      for (let j = 0; j < subCategories.length; j++) {
        sum += await Product.find({
          category: subCategories[j]._id,
        }).countDocuments();
      }
      groupCategories.push({ ...categories[i], sum });
    }
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { categories: groupCategories },
      null,
      `get ${groupCategories.length} main categories success`
    );
  } catch (error) {
    next(error);
  }
};

categoryController.getAllSubCategory = async (req, res, next) => {
  try {
    const categories = await Category.find({ parentCategory: { $ne: null } });
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { categories },
      null,
      `get ${categories.length} sub categories success`
    );
  } catch (error) {
    next(error);
  }
};

categoryController.getSubCategory = async (req, res, next) => {
  try {
    let categories = await Category.find({
      parentCategory: req.params.id,
    })
      .populate("parentCategory")
      .lean();
    const groupCategories = [];

    for (let i = 0; i < categories.length; i++) {
      const count = await Product.find({
        category: categories[i]._id,
      }).countDocuments();
      groupCategories.push({ ...categories[i], count });
    }

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { categories: groupCategories },
      null,
      `get ${groupCategories.length} sub categories success`
    );
  } catch (error) {
    next(error);
  }
};

categoryController.addCategory = async (req, res, next) => {
  try {
    let category = await Category.findOne({ name: req.body.name });
    if (category) return next(new Error("Category already exists"));

    category = await Category.create(req.body);
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { category },
      null,
      "category created"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = categoryController;
