const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reactionSchema = Schema(
  {
    emoji: {
      type: String,
      enum: ["like", "love", "wow"],
    },
    owner: {
      ref: "User",
      required: true,
      type: Schema.Types.ObjectId,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  },
  {
    timestamps: true,
  }
);

const Reaction = mongoose.model("Reaction", reactionSchema);
module.exports = Reaction;
