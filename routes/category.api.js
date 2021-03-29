const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const authMiddleware = require("../middlewares/authentication");

/**
 * @route GET api/categories/main-categories
 * @description User can view list of main category
 * @access Public
 */
router.get("/main-categories", categoryController.getMainCategory);

/**
 * @route GET api/categories/sub-categories
 * @description User can view list of all sub category
 * @access Public
 */

router.get("/sub-categories", categoryController.getAllSubCategory);

/**
 * @route GET api/categories/sub-categories/:parentCategoryId
 * @description User can view list of sub category
 * @access Public
 */

router.get("/sub-categories/:id", categoryController.getSubCategory);

/**
 * @route POST api/categories
 * @description Admin can add category
 * @access Admin Required
 */
router.post(
  "/",
  authMiddleware.loginRequired,
  authMiddleware.adminRequired,
  categoryController.addCategory
);

module.exports = router;
