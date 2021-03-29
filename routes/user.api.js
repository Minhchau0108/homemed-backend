const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/authentication");

/**
 * @route POST api/users
 * @description User can register account
 * @access Public
 */
router.post("/", userController.register);

/**
 * @route POST api/users/doctors
 * @description Admin can register account for a doctor
 * @access Public
 */
router.post(
  "/doctors",
  authMiddleware.loginRequired,
  authMiddleware.adminRequired,
  userController.registerDoctor
);

/**
 * @route GET api/users/me
 * @description Return current user info
 * @access Login required
 */
router.get("/me", authMiddleware.loginRequired, userController.getCurrentUser);

/**
 * @route GET api/users/customers
 * @description Return list of user role = "user"
 * @access Admin required
 */
router.get(
  "/customers",
  authMiddleware.loginRequired,
  userController.getAllCustomers
);

/**
 * @route GET api/users/:id/orders
 * @description Return list orders of current user
 * @access Login Required or Admin authorized
 */

router.get(
  "/:id/orders",
  authMiddleware.loginRequired,
  userController.getCurrentUserOrder
);
/**
 * @route GET api/users/:id/prescriptions/dashboard
 * @description Return list orders of current user
 * @access Login Required or Admin authorized
 */

router.get(
  "/:id/prescriptions/dashboard",
  authMiddleware.loginRequired,
  userController.getCurrentUserPrescriptionDashboard
);
/**
 * @route GET api/users/:id/prescriptions
 * @description Return list prescriptions of current user
 * @access Login Required or Admin authorized
 */

router.get(
  "/:id/prescriptions",
  authMiddleware.loginRequired,
  userController.getCurrentUserPrescription
);

/**
 * @route GET api/users/:id/appointments
 * @description Return list appointments of current user
 * @access Login Required or Admin authorized
 */

router.get(
  "/:id/appointments",
  authMiddleware.loginRequired,
  userController.getCurrentUserAppointment
);

/**
 * @route Put api/users
 * @description User can update profile
 * @access Login required
 */
router.put("/", authMiddleware.loginRequired, userController.update);

module.exports = router;
