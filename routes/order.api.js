const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middlewares/authentication");
/**
 * @route POST api/orders
 * @description User  can create order
 * @access Login require
 */
router.post("/", authMiddleware.loginRequired, orderController.createOrder);

/**
 * @route POST api/orders
 * @description User  can create order
 * @access Login require
 */
router.post(
  "/admin",
  authMiddleware.loginRequired,
  authMiddleware.adminRequired,
  orderController.createOrderByAdmin
);

/**
 * @route GET api/orders
 * @description Admin can get all orders
 * @access Admin require
 */
router.get(
  "/",
  authMiddleware.loginRequired,
  authMiddleware.adminRequired,
  orderController.getAllOrders
);

/**
 * @route GET api/orders/:id
 * @description Admin or user can get detail order
 * @access Admin require
 */
router.get(
  "/:id",
  authMiddleware.loginRequired,
  orderController.getDetailOrder
);

/**
 * @route PUT api/orders/:id/update
 * @description User can update order
 * @access Login require
 */
router.put(
  "/:id/update",
  authMiddleware.loginRequired,
  orderController.updateOrder
);

/**
 * @route PUT api/orders/:id/status
 * @description User can update order
 * @access Login require
 */
router.put(
  "/:id/status",
  authMiddleware.loginRequired,
  orderController.updateStatusOrder
);

/**
 * @route DELETE api/orders/:id
 * @description Admin can delete order
 * @access Admin required
 */
router.delete(
  "/:id",
  authMiddleware.loginRequired,
  authMiddleware.adminRequired,
  orderController.deleteOrder
);
module.exports = router;
