const Prescription = require("../models/Prescription");
const utilsHelper = require("../helpers/utils.helper");
const prescriptionController = {};

prescriptionController.list = async (req, res, next) => {
  try {
    let { page, limit, status } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    status = status || null;
    const offset = limit * (page - 1);
    let totalResults;
    let prescriptions;
    if (status) {
      totalResults = await Prescription.find({
        status: status,
      }).countDocuments();
      prescriptions = await Prescription.find({ status: status })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .populate("owner");
    }
    if (!status) {
      totalResults = await Prescription.find().countDocuments();
      prescriptions = await Prescription.find({})
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .populate("owner");
    }

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { prescriptions, totalPages: Math.ceil(totalResults / limit) },
      null,
      "get all prescriptions success"
    );
  } catch (error) {
    next(error);
  }
};
prescriptionController.getDetailPrescription = async (req, res, next) => {
  try {
    const prescription = await Prescription.findOne({
      _id: req.params.id,
    }).populate("owner");

    if (!prescription) return next(new Error("Prescription not exists"));

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { prescription },
      null,
      "get detail prescription"
    );
  } catch (error) {
    next(error);
  }
};

prescriptionController.create = async (req, res, next) => {
  try {
    const prescription = await Prescription.create({
      ...req.body.prescription,
      owner: req.userId,
    });
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { prescription },
      null,
      "prescription created"
    );
  } catch (error) {
    next(error);
  }
};

prescriptionController.updateStatus = async (req, res, next) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(
      { _id: req.params.id },
      { status: req.body.status },
      { new: true }
    ).populate("owner");
    if (!prescription) return next(new Error("Prescription not found"));
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { prescription },
      null,
      "prescription update"
    );
  } catch (error) {
    next(error);
  }
};
module.exports = prescriptionController;
