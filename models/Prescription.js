const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const prescriptionSchema = Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    images: [{ type: String }],
    status: {
      type: String,
      enum: ["new", "done", "cancelled"],
      default: "new",
    },
    address: { type: String },
    phone: { type: Number },
    patientAge: { type: String },
    patientHeight: { type: Number },
    patientWeight: { type: Number },
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
prescriptionSchema.plugin(require("./plugins/isDeletedFalse"));

prescriptionSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
  delete obj.isDeleted;
  return obj;
};

const Prescription = mongoose.model("Prescription", prescriptionSchema);
module.exports = Prescription;
