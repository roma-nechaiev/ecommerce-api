const Order = require('../models/Order');
const AppError = require('../utils/AppError');
const updateStock = require('../utils/updateStock');

const createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      paymentResult,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    const order = await Order.create({
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paymentResult,
      paidAt: Date.now(),
      user: req.user.id,
    });

    res.status(201).json({
      status: 'success',
      order,
    });
  } catch (err) {
    next(err);
  }
};

const getProfileOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate(
      'user',
      'username email',
    );
    res.status(200).json({
      status: 'success',
      orders,
    });
  } catch (err) {
    next(err);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    const totalAmount = orders.reduce((a, c) => a + c.totalPrice, 0);

    res.status(200).json({
      status: 'success',
      totalAmount,
      orders,
    });
  } catch (err) {
    next(err);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'username email',
    );

    if (!order) {
      throw next(new AppError('Order not found', 404));
    }

    res.status(200).json({
      status: 'success',
      order,
    });
  } catch (err) {
    next(err);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      throw next(new AppError('Order not found', 404));
    }
    if (order.status === 'Delivered') {
      throw new AppError('Can not update order in delivered status', 400);
    }

    order.orderItems.forEach(async (value) => {
      await updateStock(value.product, value.qty);
    });

    order.status = req.body.status;
    if (req.body.status === 'Delivered') {
      order.deliveredAt = Date.now();
    }

    await order.save();

    res.status(200).json({
      status: 'success',
      order,
    });
  } catch (err) {
    next(err);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      throw next(new AppError('Order not found', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Order deleted',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createOrder,
  getProfileOrders,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
