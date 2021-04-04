const Appointment = require("../models/Appointment");
const utilsHelper = require("../helpers/utils.helper");
const emailsHelper = require("../helpers/email");
const appointmentController = {};

appointmentController.getAllAppointment = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({})
      .populate("owner")
      .populate("doctor");
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { appointments },
      null,
      "get all appointments success"
    );
  } catch (error) {
    next(error);
  }
};

appointmentController.getDetailAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findOne({ _id: req.params.id })
      .populate("doctor")
      .populate("onwer");

    if (!appointment) return next(new Error("Appointment not exists"));

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { appointment },
      null,
      "get detail apppointment"
    );
  } catch (error) {
    next(error);
  }
};

appointmentController.updateAppointment = async (req, res, next) => {
  try {
    console.log("req.body", req.body);
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        patientInfo: req.body.patientInfo,
        diagnosis: req.body.diagnosis,
        prescription: req.body.prescription,
        status: "done",
      },
      { new: true }
    )
      .populate("doctor")
      .populate("onwer");

    if (!appointment) return next(new Error("Appointment not exists"));

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { appointment },
      null,
      "get detail apppointment"
    );
  } catch (error) {
    next(error);
  }
};
appointmentController.updateStatusAppointment = async (req, res, next) => {
  try {
    console.log("req.body", req.body);
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      { new: true }
    )
      .populate("doctor")
      .populate("onwer");

    if (!appointment) return next(new Error("Appointment not exists"));

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { appointment },
      null,
      "update apppointment success"
    );
  } catch (error) {
    next(error);
  }
};

appointmentController.addAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.create({
      ...req.body.formData,
      owner: req.userId,
    });
    if (appointment) emailsHelper.sendTestEmail();
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { appointment },
      null,
      "appointment created"
    );
  } catch (error) {
    next(error);
  }
};
appointmentController.getDoctorAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.create({
      ...req.body.formData,
      owner: req.userId,
    });
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { appointment },
      null,
      "appointment created"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = appointmentController;
