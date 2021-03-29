const Reaction = require("../models/Reaction");
const Post = require("../models/Post");
const utilsHelper = require("../helpers/utils.helper");
const reactionsController = {};

reactionsController.create = async (req, res, next) => {
  try {
    console.log("req", req.body);
    const { postId, emoji } = req.body;
    const reaction = await Reaction.create({
      owner: req.userId,
      emoji: emoji,
      post: postId,
    });
    const post = await Post.findById(postId);
    post.reactions.push(reaction._id);
    await post.save();
    await post.populate("reviews");
    await post.populate({
      path: "reactions",
      populate: { path: "owner" },
    });
    await post.execPopulate();
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { post },
      null,
      "reaction post success"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = reactionsController;
