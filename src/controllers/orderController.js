const Order = require('../models/order');
const User = require('../models/user');

exports.createOrder = async (req, res) => {
  const { type, description, location, status } = req.body;
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const order = await Order.create({
      type,
      description,
      location,
      status,
      userId,
    });

    res.status(201).json({ orderId: order.id, message: 'Order created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};



exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: User,
    });

    res.json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getOrderById = async (req, res) => {
  const orderId = req.params.id;

  try {
    const order = await Order.findByPk(orderId, {
      include: User,
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.myOrders = async (req, res) => {
  const userId = req.params.userId; 
  try {
    const user = await User.findByPk(userId, {
      include: Order,
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const orders = user.Orders; 

    res.json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};