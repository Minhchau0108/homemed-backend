const express = require("express");
const router = express.Router();

// userApi
const userApi = require("./user.api");
router.use("/users", userApi);

// authApi
const authApi = require("./auth.api");
router.use("/auth", authApi);

// productApi
const productApi = require("./product.api");
router.use("/products", productApi);

// categoryApi
const categoryApi = require("./category.api");
router.use("/categories", categoryApi);

// orderApi
const orderApi = require("./order.api");
router.use("/orders", orderApi);

// prescriptionApi
const prescriptionApi = require("./prescription.api");
router.use("/prescriptions", prescriptionApi);

// appointmentApi
const appointmentApi = require("./appointment.api");
router.use("/appointments", appointmentApi);

// postApi
const postApi = require("./post.api");
router.use("/posts", postApi);

// reviewApi
const reviewApi = require("./review.api");
router.use("/reviews", reviewApi);

// reactionApi
const reactionApi = require("./reaction.api");
router.use("/reactions", reactionApi);

// doctorApi
const doctorApi = require("./doctor.api");
router.use("/doctors", doctorApi);

module.exports = router;
