const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");
const authMiddleware = require("../middlewares/authentication");

/**
 * @route POST api/reviews
 * @description User can create a review
 * @access Login Required
 */
router.post("/", authMiddleware.loginRequired, reviewController.create);

module.exports = router;
