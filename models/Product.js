const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productSchema = Schema(
  {
    name: { type: String, required: true, unique: true },
    rxId: { type: String },
    isPrescription: { type: Boolean, require: true },
    ingredient: { type: String, required: true },
    indication: { type: String },
    volume: { type: String },
    precaution: { type: String },
    storage: { type: String },
    price: { type: Number, required: true },
    images: [{ type: String, required: true }],
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
productSchema.plugin(require("./plugins/isDeletedFalse"));
productSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
  delete obj.isDeleted;
  return obj;
};

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
