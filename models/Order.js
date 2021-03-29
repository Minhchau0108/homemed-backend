const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const orderSchema = Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: "User" },
    products: [
      {
        name: { type: String },
        price: { type: Number, required: true },
        images: [{ type: String }],
        qty: { type: Number, required: true },
      },
    ],
    status: {
      type: String,
      enum: ["new", "confirmed", "cancelled", "delivered"],
      default: "new",
    },
    address: { type: String },
    phone: { type: Number },
    totalPrice: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
orderSchema.plugin(require("./plugins/isDeletedFalse"));
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
