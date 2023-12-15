const express = require('express');
const passport = require('passport');
const adminRouter = express.Router();
const Driver = require ('../models/driver');
const User = require ('../models/user');
const Order = require ('../models/order')
const { createAdminUser, loginAdmin } = require('../controllers/userController');
const Auth = require ('../middleware/adminAuth')

adminRouter.post('/createAdmin', async (req, res) => {
  try {
    await createAdminUser();
    res.status(200).json({ message: 'Admin user created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating admin user', error: error.message });
  }
});

// adminRouter.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
//     res.status(200).json({ message: 'Admin login successful', user: req.user });
//     loginAdmin
//   });

adminRouter.post('/login', loginAdmin);
adminRouter.get('/orders', async (req, res) => {
    try {
      const orders = await Order.findAll();
      res.status(200).json({ orders });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
  });
  
  adminRouter.post('/assign', async (req, res) => {
    const { orderId, driverId } = req.body;
  
    try {
      const order = await Order.findByPk(orderId);
      const driver = await User.findByPk(driverId);
  
      if (!order || !driver) {
        return res.status(404).json({ message: 'Order or driver not found' });
      }
  
      if (order.assignedDriverId) {
        return res.status(400).json({ message: 'Order is already assigned to a driver' });
      }
  
      order.assignedDriverId = driverId;
      await order.save();
  
      res.status(200).json({ message: 'Order assigned successfully', order });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error assigning order', error: error.message });
    }
  });
  

  adminRouter.patch('/approveOrder/:orderId', async (req, res) => {
    const orderId = req.params;
  
    try {
      const order = await Order.findByPk(orderId);
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      order.status = 'approved'; 
  
  
      await order.save();
  
      res.status(200).json({ message: 'Order approved by admin', order });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error approving order', error: error.message });
    }
  });
  
  
  adminRouter.delete('/deleteDriver/:driverId', async (req, res) => {
    const {driverId} = req.params;
  
    try {
      const driver = await User.findByPk(driverId);
  
      if (!driver) {
        return res.status(404).json({ message: 'Driver not found' });
      }
  
      await driver.destroy();
  
      res.status(200).json({ message: 'Driver deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting driver', error: error.message });
    }
  });
  




module.exports = adminRouter;
