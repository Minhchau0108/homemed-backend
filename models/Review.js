const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reviewSchema = Schema(
  {
    rating: {
      type: Number,
      min: [1, "Rating cannot be below 1.0"],
      max: [5, "Rating cannot be above 5.0"],
    },
    content: {
      type: String,
      required: true,
    },
    owner: {
      ref: "User",
      required: true,
      type: Schema.Types.ObjectId,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
reviewSchema.plugin(require("./plugins/isDeletedFalse"));

reviewSchema.methods.toJSON = function () {
  const obj = this._doc;
  //delete obj.__v;
  delete obj.isDeleted;
  return obj;
};

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
