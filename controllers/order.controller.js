const utilsHelper = require("../helpers/utils.helper");
const Order = require("../models/Order");
const Prescription = require("../models/prescription");
const Product = require("../models/Product");
const orderController = {};

//Create the order
orderController.createOrder = async (req, res, next) => {
  try {
    const { userId, phone, address, products, totalPrice } = req.body.order;

    const order = await Order.create({
      customer: userId,
      phone: phone,
      address: address,
      products: products,
      totalPrice: totalPrice,
    });
    utilsHelper.sendResponse(res, 200, true, { order }, null, "Order created");
  } catch (error) {
    next(error);
  }
};
orderController.createOrderByAdmin = async (req, res, next) => {
  try {
    console.log("running create order by admin");
    const {
      userId,
      phone,
      address,
      products,
      totalPrice,
      prescriptionId,
    } = req.body.order;

    let prescription = await Prescription.findById(prescriptionId);
    if (!prescription) {
      return next(new Error("401 - Prescription not found"));
    }
    const order = await Order.create({
      customer: userId,
      phone: phone,
      address: address,
      products: products,
      totalPrice: totalPrice,
    });

    if (order) {
      prescription = await Prescription.findByIdAndUpdate(
        prescriptionId,
        { orderId: order._id, status: "done" },
        { new: true }
      );
    }
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { order, prescription },
      null,
      "Order created"
    );
  } catch (error) {
    next(error);
  }
};

orderController.getAllOrders = async (req, res, next) => {
  try {
    let { page, limit, status } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    status = status || null;
    const offset = limit * (page - 1);
    let totalResults;
    let orders;
    if (status) {
      totalResults = await Order.find({ status: status }).countDocuments();
      orders = await Order.find({ status: status })
        .skip(offset)
        .limit(limit)
        .populate("customer");
    }
    if (!status) {
      totalResults = await Order.find().countDocuments();
      orders = await Order.find({})
        .skip(offset)
        .limit(limit)
        .populate("customer");
    }
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { orders, totalPages: Math.ceil(totalResults / limit) },
      null,
      "get all orders success"
    );
  } catch (error) {
    next(error);
  }
};
orderController.getDetailOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    if (!order) return next(new Error("401- Order not found"));
    await order.populate("customer").execPopulate();
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { order },
      null,
      "get detail order success"
    );
  } catch (error) {
    next(error);
  }
};
//Update Order
orderController.updateOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const { products } = req.body;

    const order = await Order.findByIdAndUpdate(
      { _id: orderId },
      { products: products },
      { new: true }
    );
    if (!order) {
      return next(new Error("order not found or User not authorized"));
    }
    utilsHelper.sendResponse(res, 200, true, { order }, null, "order send");
  } catch (error) {
    next(error);
  }
};
//delete order
orderController.deleteOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findOneAndUpdate(
      {
        _id: orderId,
      },
      { isDeleted: true },
      { new: true }
    );
    if (!order) {
      return next(new Error("order not found or User not authorized"));
    }
    utilsHelper.sendResponse(res, 200, true, { order }, null, "Delete order");
  } catch (error) {
    next(error);
  }
};

orderController.updateStatusOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      { _id: req.params.id },
      { status: req.body.status },
      { new: true }
    ).populate("owner");
    if (!order) return next(new Error("Order not found"));
    utilsHelper.sendResponse(res, 200, true, { order }, null, "order update");
  } catch (error) {
    next(error);
  }
};

module.exports = orderController;
