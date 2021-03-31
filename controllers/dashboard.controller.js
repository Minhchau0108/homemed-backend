const utilsHelper = require("../helpers/utils.helper");
const Order = require("../models/Order");
const Prescription = require("../models/Prescription");
const User = require("../models/User");
const dashboardController = {};

dashboardController.getAdminDashboard = async (req, res, next) => {
  try {
    const dashboard = {};
    dashboard.orderCount = await Order.find({}).countDocuments();
    dashboard.prescriptionCount = await Prescription.find({}).countDocuments();
    dashboard.customerCount = await User.find({
      role: "user",
    }).countDocuments();
    dashboard.doctorCount = await User.find({
      role: "doctor",
    }).countDocuments();

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { dashboard },
      null,
      "get dashboard success"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = dashboardController;
