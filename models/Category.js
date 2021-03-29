const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const categorySchema = Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
categorySchema.plugin(require("./plugins/isDeletedFalse"));

categorySchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
  delete obj.isDeleted;
  return obj;
};

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
