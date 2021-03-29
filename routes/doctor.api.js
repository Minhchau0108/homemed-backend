const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/authentication");

/**
 * @route GET api/doctors
 * @description Public user can view list of doctors
 * @access Public
 */
router.get("/", userController.getAllDoctors);

/**
 * @route GET api/doctors/:id
 * @description Public user can view a detail doctor
 * @access Public
 */

router.get("/:id", userController.getSingleDoctor);

/**
 * @route GET api/doctors/:id/appointments
 * @description Doctor can view his own appointments
 * @access Doctor required
 */

router.get(
  "/:id/appointments",
  authMiddleware.loginRequired,
  authMiddleware.doctorRequired,
  userController.getDoctorAppointments
);

module.exports = router;
