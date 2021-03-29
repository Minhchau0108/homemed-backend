const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const authMiddleware = require("../middlewares/authentication");
/**
 * @route GET api/products?page=1&limit=10
 * @description User can see list of all products
 * @access Public
 */
router.get("/", productController.getAllProducts);

/**
 * @description get single product
 */
router.get("/:id", productController.getSingleProduct);

/**
 * @route POST api/products
 * @description Admin can add product
 * @access Admin Required
 */
router.post(
  "/",
  authMiddleware.loginRequired,
  authMiddleware.adminRequired,
  productController.addProduct
);

/**
 * @route PUT api/product/:id/update
 * @description Admin can update product
 * @access Admin required
 */
router.put(
  "/:id/update",
  authMiddleware.loginRequired,
  authMiddleware.adminRequired,
  productController.updateProduct
);

/**
 * @description delete single product
 *  * @access Admin required
 */
router.delete(
  "/:id",
  authMiddleware.loginRequired,
  authMiddleware.adminRequired,
  productController.deleteProduct
);

module.exports = router;
