const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const authMiddleware = require("../middlewares/authentication");

/**
 * @route GET api/posts
 * @description Public user can view list of post
 * @access Public
 */
router.get("/", postController.list);

/**
 * @route GET api/posts/category
 * @description Public user can view list of post
 * @access Public
 */
router.get("/category", postController.listByCategory);

/**
 * @route POST api/posts
 * @description Doctor can create a new post
 * @access Doctor required
 */
router.post(
  "/",
  authMiddleware.loginRequired,
  authMiddleware.doctorRequired,
  postController.create
);

/**
 * @route GET api/posts/:id
 * @description Public user can view a detail post
 * @access Public
 */
router.get("/:id", postController.getDetailPost);

/**
 * @route GET api/posts/doctors/:id
 * @description Public user can view a list post of detail doctor
 * @access Public
 */
router.get("/doctors/:id", postController.getPostByDoctor);

module.exports = router;
