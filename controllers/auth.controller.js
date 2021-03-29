const bcrypt = require("bcryptjs");
const User = require("../models/User");
const authController = {};

authController.login = async ({ user }, res) => {
  if (user) {
    user = await User.findByIdAndUpdate(
      user._id,
      { profileURL: user.profileURL },
      { new: true }
    );
  } else {
    let newPassword = "" + Math.floor(Math.random() * 100000000);
    const salt = await bcrypt.genSalt(10);
    newPassword = await bcrypt.hash(newPassword, salt);

    user = await User.create({
      name: user.name,
      email: user.email,
      password: newPassword,
      profileURL: user.profileURL,
    });
  }
  const accessToken = await user.generateToken();
  res.send({ user, accessToken });
};

authController.loginWithEmail = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) return next(new Error("401 - Email not exists"));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(new Error("401 - Wrong password"));

    const accessToken = await user.generateToken();
    res.send({ user, accessToken });
  } catch (error) {
    next(error);
  }
};

module.exports = authController;
