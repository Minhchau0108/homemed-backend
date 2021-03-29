const express = require("express");
const router = express.Router();
const reactionsController = require("../controllers/reaction.controller");
const authMiddleware = require("../middlewares/authentication");

/**
 * @route POST api/reactions
 * @description User can create reaction to a post
 * @access Login Required
 */
router.post("/", authMiddleware.loginRequired, reactionsController.create);
module.exports = router;
