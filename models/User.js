const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const userSchema = Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin", "doctor"], default: "user" },
    field: {
      type: String,
      enum: [
        "Internal",
        "Pediatrician",
        "Psychiatrist",
        "Dermatologist",
        "Cardiologist",
        "Gynecologist",
      ],
    },
    phone: { type: Number },
    address: { type: String },
    profileURL: { type: String },
    workingTime: { type: String },
    description: { type: String },
    isDeleted: { type: Boolean, default: false },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true }
);
userSchema.plugin(require("./plugins/isDeletedFalse"));

userSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.password;
  delete obj.__v;
  delete obj.emailVerified;
  delete obj.emailVerificationCode;
  delete obj.isDeleted;
  return obj;
};

userSchema.methods.generateToken = async function () {
  const accessToken = await jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
  return accessToken;
};
userSchema.statics.findOrCreate = function findOrCreate(profile, cb) {
  const userObj = new this(); // create a new User class
  this.findOne({ email: profile.email }, async function (err, result) {
    if (!result) {
      let newPassword =
        profile.password || "" + Math.floor(Math.random() * 100000000);
      const salt = await bcrypt.genSalt(10);
      newPassword = await bcrypt.hash(newPassword, salt);

      userObj.name = profile.name;
      userObj.email = profile.email;
      userObj.password = newPassword;
      userObj.googleId = profile.googleId;
      userObj.facebookId = profile.facebookId;
      userObj.avatarUrl = profile.avatarUrl;
      userObj.save(cb);
    } else {
      cb(err, result);
    }
  });
};
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password, function (_, isMatch) {
    return isMatch;
  });
};

const User = mongoose.model("User", userSchema);
module.exports = User;
