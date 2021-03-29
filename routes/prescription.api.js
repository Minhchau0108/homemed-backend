const express = require("express");
const router = express.Router();
const prescriptionController = require("../controllers/prescription.controller");
const authMiddleware = require("../middlewares/authentication");

/**
 * @route POST api/prescriptions
 * @description User can create a prescription
 * @access Login Required
 */
router.post("/", authMiddleware.loginRequired, prescriptionController.create);

/**
 * @route GET api/prescriptions
 * @description Admin can view list of prescription
 * @access Admin Required
 */
router.get(
  "/",
  authMiddleware.loginRequired,
  authMiddleware.adminRequired,
  prescriptionController.list
);

/**
 * @route GET api/prescriptions/:id
 * @description User can view a detail prescription
 * @access Login Required
 */
router.get(
  "/:id",
  authMiddleware.loginRequired,
  prescriptionController.getDetailPrescription
);

/**
 * @route PUT api/prescriptions/:id/status
 * @description Admin can update status of prescription
 * @access Admin Required
 */
router.put(
  "/:id/status",
  authMiddleware.loginRequired,
  authMiddleware.adminRequired,
  prescriptionController.updateStatus
);

module.exports = router;
