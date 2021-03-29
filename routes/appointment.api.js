const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointment.controller");
const authMiddleware = require("../middlewares/authentication");

/**
 * @route POST api/appointments
 * @description User can create an appointment
 * @access Login Required
 */
router.post(
  "/",
  authMiddleware.loginRequired,
  appointmentController.addAppointment
);

/**
 * @route GET api/appointments
 * @description Admin can view list of appointments
 * @access Admin Required
 */
router.get(
  "/",
  authMiddleware.loginRequired,
  authMiddleware.adminRequired,
  appointmentController.getAllAppointment
);

/**
 * @route GET api/appointments/:id
 * @description Doctor can view detail appointments
 * @access Doctor Required
 */
router.get(
  "/:id",
  authMiddleware.loginRequired,
  authMiddleware.doctorRequired,
  appointmentController.getDetailAppointment
);
/**
 * @route PUT api/appointments/:id
 * @description Admin can view list of appointments
 * @access Admin Required
 */
router.put(
  "/:id",
  authMiddleware.loginRequired,
  authMiddleware.doctorRequired,
  appointmentController.updateAppointment
);
module.exports = router;
