const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const appointmentSchema = Schema(
  {
    time: { type: Date },
    status: {
      type: String,
      enum: ["new", "done", "cancelled"],
      default: "new",
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    patientName: { type: String },
    patientAge: { type: Number },
    phone: { type: Number },
    note: { type: String },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    patientInfo: {
      patientHeight: { type: Number },
      patientWeight: { type: Number },
      temperature: { type: Number },
      pressure: { type: String },
    },
    diagnosis: [{ type: String }],
    prescription: [
      {
        name: { type: String },
        qty: { type: Number },
        frequency: { type: String },
        direction: { type: String },
        ingredient: { type: String },
        volume: { type: String },
      },
    ],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
appointmentSchema.plugin(require("./plugins/isDeletedFalse"));

appointmentSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
  delete obj.isDeleted;
  return obj;
};

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;
