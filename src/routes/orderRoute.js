const express = require('express');
const orderRouter = express.Router();
const {createOrder, getAllOrders, getOrderById, myOrders} = require('../controllers/orderController');

orderRouter.post('/create/:userId', createOrder);
orderRouter.get('/orders', getAllOrders);
// orderRouter.get('/orders/:id', getOrderById);
orderRouter.get('/:id/orders', myOrders);

module.exports = orderRouter;
