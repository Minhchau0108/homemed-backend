const Review = require("../models/Review");
const utilsHelper = require("../helpers/utils.helper");
const Product = require("../models/Product");
const Post = require("../models/Post");
const User = require("../models/User");
const reviewController = {};

reviewController.create = async (req, res, next) => {
  try {
    const { rating, content, targetType, targetId } = req.body;
    const review = await Review.create({
      rating: rating,
      content: content,
      owner: req.userId,
    });
    let result;
    if (targetType === "Product") {
      result = await Product.findByIdAndUpdate(
        targetId,
        { $push: { reviews: review._id } },
        { new: true }
      )
        .populate({
          path: "reviews",
          populate: { path: "owner" },
        })
        .populate("category")
        .lean();
      const productCount = await Product.aggregate([
        {
          $match: {
            _id: result._id,
          },
        },
        {
          $lookup: {
            from: "reviews",
            localField: "reviews",
            foreignField: "_id",
            as: "reviews",
          },
        },
        { $addFields: { avgRating: { $avg: "$reviews.rating" } } },
      ]);
      const avgRating = productCount[0].avgRating;
      console.log("avgRating", avgRating);
      result = { ...result, avgRating };
    }

    if (targetType === "Post") {
      result = await Post.findByIdAndUpdate(
        targetId,
        { $push: { reviews: review._id } },
        { new: true }
      )
        .populate("category")
        .populate("product")
        .populate({ path: "reviews", populate: { path: "owner" } })
        .populate({
          path: "reactions",
          populate: { path: "owner" },
        })
        .populate("owner");
    }

    if (targetType === "Doctor") {
      result = await User.findByIdAndUpdate(
        targetId,
        { $push: { reviews: review._id } },
        { new: true }
      );
    }
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { review, result },
      null,
      "review created"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = reviewController;
