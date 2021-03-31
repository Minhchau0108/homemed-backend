const utilsHelper = require("../helpers/utils.helper");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Order = require("../models/Order");
const Prescription = require("../models/Prescription");
const Appointment = require("../models/Appointment");
const userController = {};

userController.register = async (req, res, next) => {
  try {
    let { name, email, password } = req.body;
    let user = await User.findOne({ email: email });
    if (user) return next(new Error("401 - Email already exists"));

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    user = await User.create({ name, email, password });
    const accessToken = await user.generateToken();

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { user, accessToken },
      null,
      "Created account"
    );
  } catch (error) {
    next(error);
  }
};

userController.registerDoctor = async (req, res, next) => {
  try {
    let {
      name,
      email,
      password,
      address,
      description,
      field,
      profileURL,
      phone,
      workingTime,
    } = req.body.formData;
    let doctor = await User.findOne({ email: email });
    if (doctor) return next(new Error("401 - Email already exists"));

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    const role = "doctor";
    doctor = await User.create({
      name,
      email,
      password,
      address,
      description,
      field,
      profileURL,
      phone,
      role,
      workingTime,
    });

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { doctor },
      null,
      "Created doctor account"
    );
  } catch (error) {
    next(error);
  }
};
//get current user .
userController.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return next(new Error("User not found"));
    }
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { user },
      null,
      "Get current user success"
    );
  } catch (error) {
    next(error);
  }
};

//Get list of orders of current user
userController.getCurrentUserOrder = async (req, res, next) => {
  try {
    let { page, limit, status, sortBy, ...filter } = { ...req.query };
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    //current user
    const currentUserId = req.userId;
    const currentUser = await User.findById(currentUserId);

    //target user
    const userId = req.params.id;

    // current user request other Order
    if (userId !== currentUserId && currentUser.role !== "admin") {
      return next(
        new Error("401- only admin able to check other user Order detail")
      );
    }
    let totalOrders;
    if (status) {
      totalOrders = await Order.find({
        customer: userId,
        status: status,
        isDeleted: false,
      }).countDocuments();
    }
    if (!status) {
      totalOrders = await Order.find({
        customer: userId,
        isDeleted: false,
      }).countDocuments();
    }

    const totalPages = Math.ceil(totalOrders / limit);
    const offset = limit * (page - 1);
    // current user request its Order or Admin request user's order
    let orders;
    if (status) {
      orders = await Order.find({ customer: userId, status: status })
        .sort({ ...sortBy, createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .populate("customer");
    }
    if (!status) {
      orders = await Order.find({ customer: userId })
        .sort({ ...sortBy, createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .populate("customer");
    }
    // in case no order
    if (!orders) return next(new Error(`401- ${currentUser} has no order`));

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { orders, totalPages },
      null,
      "get list of orders from userId success"
    );
  } catch (error) {
    next(error);
  }
};

//Get list of prescriptions of current user
userController.getCurrentUserPrescription = async (req, res, next) => {
  try {
    let { page, limit, status, sortBy, ...filter } = { ...req.query };
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    //current user
    const currentUserId = req.userId;
    const currentUser = await User.findById(currentUserId);

    //target user
    const userId = req.params.id;

    // current user request other Order
    if (userId !== currentUserId && currentUser.role !== "admin") {
      return next(
        new Error(
          "401- only admin able to check other user Prescription detail"
        )
      );
    }
    let totalPrescriptions;
    if (status) {
      totalPrescriptions = await Prescription.find({
        owner: userId,
        status: status,
        isDeleted: false,
      }).countDocuments();
    }
    if (!status) {
      totalPrescriptions = await Prescription.find({
        customer: userId,
        isDeleted: false,
      }).countDocuments();
    }

    const totalPages = Math.ceil(totalPrescriptions / limit);
    const offset = limit * (page - 1);
    // current user request its Prescription or Admin request user's prescription
    let prescriptions;
    if (status) {
      prescriptions = await Prescription.find({ owner: userId, status: status })
        .sort({ ...sortBy, createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .populate("owner");
    }
    if (!status) {
      prescriptions = await Prescription.find({ owner: userId })
        .sort({ ...sortBy, createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .populate("owner");
    }

    // in case no prescription
    if (!prescriptions)
      return next(new Error(`401- ${currentUser} has no order`));

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { prescriptions, totalPages },
      null,
      "get list of prescriptions from userId success"
    );
  } catch (error) {
    next(error);
  }
};

userController.getCurrentUserPrescriptionDashboard = async (req, res, next) => {
  try {
    //current user
    const currentUserId = req.userId;
    const currentUser = await User.findById(currentUserId);

    //target user
    const userId = req.params.id;

    // current user request other Order
    if (userId !== currentUserId && currentUser.role !== "admin") {
      return next(
        new Error(
          "401- only admin able to check other user Prescription detail"
        )
      );
    }

    // current user request its Prescription or Admin request user's prescription
    let prescriptions;
    prescriptions = await Prescription.find({
      owner: userId,
      status: { $in: ["new", "done"] },
    })
      .sort({ createdAt: -1 })
      .populate("owner");

    // in case no prescription
    if (!prescriptions)
      return next(new Error(`401- ${currentUser} has no order`));

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { prescriptions },
      null,
      "get list of prescriptions dashboard from userId success"
    );
  } catch (error) {
    next(error);
  }
};
// GET LIST APPOINTMENT OF CURRENT USER
userController.getCurrentUserAppointment = async (req, res, next) => {
  try {
    let { page, limit, sortBy, ...filter } = { ...req.query };
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    //current user
    const currentUserId = req.userId;
    const currentUser = await User.findById(currentUserId);

    //target user
    const userId = req.params.id;

    // current user request other Order
    if (userId !== currentUserId && currentUser.role !== "admin") {
      return next(
        new Error(
          "401- only admin able to check other user Prescription detail"
        )
      );
    }

    const totalAppointments = await Appointment.find({
      owner: userId,
      ...filter,
      isDeleted: false,
    }).countDocuments();

    const totalPages = Math.ceil(totalAppointments / limit);
    const offset = limit * (page - 1);
    // current user request its Prescription or Admin request user's prescription
    const appointments = await Appointment.find({ owner: userId })
      .sort({ ...sortBy, createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate("owner")
      .populate("doctor");

    // in case no appointments
    if (!appointments)
      return next(new Error(`401- ${currentUser} has no apppointments`));

    console.log("appointments after populate", appointments);

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { appointments, totalPages },
      null,
      "get list of appointments from userId success"
    );
  } catch (error) {
    next(error);
  }
};

// GET LIST APPOINTMENT OF DOCTOR ID
userController.getDoctorAppointments = async (req, res, next) => {
  try {
    let { page, limit, status, sortBy, ...filter } = { ...req.query };
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    //current doctor
    const currentDoctorId = req.userId;
    const currentDoctor = await User.findById(currentDoctorId);

    //target doctor
    const doctorId = req.params.id;

    // current user request other Order
    if (doctorId !== currentDoctorId && currentDoctor.role !== "doctor") {
      return next(
        new Error("401- only doctor able to check other his Appointment")
      );
    }

    let totalAppointments;
    if (status) {
      totalAppointments = await Appointment.find({
        doctor: doctorId,
        status: status,
        ...filter,
        isDeleted: false,
      }).countDocuments();
    }
    if (!status) {
      totalAppointments = await Appointment.find({
        doctor: doctorId,
        ...filter,
        isDeleted: false,
      }).countDocuments();
    }

    const totalPages = Math.ceil(totalAppointments / limit);
    const offset = limit * (page - 1);

    let appointments;
    if (status) {
      appointments = await Appointment.find({
        doctor: doctorId,
        status: status,
      })
        .sort({ ...sortBy, createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .populate("owner")
        .populate("doctor");
    }
    if (!status) {
      appointments = await Appointment.find({
        doctor: doctorId,
      })
        .sort({ ...sortBy, createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .populate("owner")
        .populate("doctor");
    }

    // in case no appointments
    if (!appointments)
      return next(new Error(`401- Doctor has no apppointments`));

    console.log("appointments after populate", appointments);

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { appointments, totalPages },
      null,
      "get list of appointments to userId success"
    );
  } catch (error) {
    next(error);
  }
};
userController.paymentUserOrder = async (req, res, next) => {
  try {
    //get request detail
    const orderId = req.params.id; //SOMETHING MISSING HERE !!
    const currentUserId = req.userId; //SOMETHING MISSING HERE !!

    //find the order to pay , get balance
    let order = await Order.findById(orderId); //SOMETHING MISSING HERE !!
    let currentUser = await User.findById(currentUserId); //SOMETHING MISSING HERE !!
    const total = order.total;
    const funds = currentUser.balance;
    //check funds
    if (total > funds) return next(new Error("403-Insufficient balance"));

    //update new balance
    user = await User.findByIdAndUpdate(
      {
        _id: currentUserId,
      },
      { balance: funds - total },
      { new: true }
    );
    //update new order
    order = await Order.findByIdAndUpdate(
      {
        _id: orderId,
      },
      { status: "paid" },
      { new: true }
    );
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { order, user },
      null,
      "payment success"
    );
  } catch (error) {
    next(error);
  }
};
userController.topUpBalance = async (req, res, next) => {
  try {
    let { topUp } = req.body;
    topUp = parseInt(topUp) || 0;
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return next(new Error("User not found"));
    }
    const updateUser = await User.findByIdAndUpdate(
      { _id: userId },
      { balance: user.balance + topUp },
      { new: true }
    );
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { updateUser },
      null,
      "Top up user success"
    );
  } catch (error) {
    next(error);
  }
};

// GET ALL DOCTOR = find user role === 'doctor'
userController.getAllDoctors = async (req, res, next) => {
  try {
    let { page, limit, field, name } = {
      ...req.query,
    };

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 6;
    field = field || null;
    const offset = limit * (page - 1);
    let doctors;

    let totalResults;
    if (field) {
      totalResults = await User.find({
        role: "doctor",
        field: field,
        name: new RegExp(name, "i"),
      }).countDocuments();
      doctors = await User.find({
        role: "doctor",
        field: field,
        name: new RegExp(name, "i"),
      })
        .skip(offset)
        .limit(limit);
    }
    if (!field) {
      totalResults = await User.find({
        role: "doctor",
        name: new RegExp(name, "i"),
      }).countDocuments();
      doctors = await User.find({
        role: "doctor",
        name: new RegExp(name, "i"),
      })
        .skip(offset)
        .limit(limit);
    }

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { doctors, totalPages: Math.ceil(totalResults / limit) },
      null,
      "Get all doctors success"
    );
  } catch (error) {
    next(error);
  }
};

userController.getSingleDoctor = async (req, res, next) => {
  try {
    const doctor = await User.findOne({
      role: "doctor",
      _id: req.params.id,
    }).populate({ path: "reviews", populate: { path: "owner" } });
    if (!doctor) {
      return next(new Error("Doctor not found"));
    }
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { doctor },
      null,
      "Get single doctor success"
    );
  } catch (error) {
    next(error);
  }
};

userController.update = async (req, res, next) => {
  try {
    const { name, phone, address, profileURL } = req.body.formData;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name: name, phone: phone, address: address, profileURL: profileURL },
      {
        new: true,
      }
    );
    if (!user) {
      return next(new Error("User not found"));
    }
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { user },
      null,
      "Update user success"
    );
  } catch (error) {
    next(error);
  }
};

// GET ALL CUSTOMER = find user role === 'customer'
userController.getAllCustomers = async (req, res, next) => {
  try {
    let { page, limit, name } = {
      ...req.query,
    };

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const offset = limit * (page - 1);
    let customers;
    let totalResults;

    totalResults = await User.find({
      role: "user",
      name: new RegExp(name, "i"),
    }).countDocuments();
    customers = await User.find({
      role: "user",
      name: new RegExp(name, "i"),
    })
      .skip(offset)
      .limit(limit);

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { customers, totalPages: Math.ceil(totalResults / limit) },
      null,
      "Get all customers success"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = userController;
