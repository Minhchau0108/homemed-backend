const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = Schema(
  {
    title: { type: String, unique: false, default: "" },
    body: { type: String, unique: false, default: "" },
    image: { type: String, unique: false },
    category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    owner: {
      ref: "User",
      required: true,
      type: Schema.Types.ObjectId,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    reactions: [{ type: Schema.Types.ObjectId, ref: "Reaction" }],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
postSchema.plugin(require("./plugins/isDeletedFalse"));

postSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
  delete obj.isDeleted;
  return obj;
};

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
