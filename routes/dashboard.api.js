const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");
const authMiddleware = require("../middlewares/authentication");

/**
 * @route GET api/dashboard
 * @description Admin can view dashboard
 * @access Admin required
 */
router.get(
  "/",
  authMiddleware.loginRequired,
  authMiddleware.adminRequired,
  dashboardController.getAdminDashboard
);

module.exports = router;
