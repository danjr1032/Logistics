const express = require ('express');
const {createUser, loginUser, trackOrders , createAdminUser} = require ('../controllers/userController');
const userRoute = express.Router();





userRoute.post('/createUser', createUser);
userRoute.post('/loginUser', loginUser);
userRoute.post('/createAdmin', async (req, res) => {
    try {
      await createAdminUser();
      res.status(200).json({ message: 'Admin user created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating admin user', error: error.message });
    }
  });


module.exports = userRoute;


