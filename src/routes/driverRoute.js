const express = require ('express');
const {createDriver, loginDriver} = require ('../controllers/driverController');
const driverRoute = express.Router();



driverRoute.post('/create', createDriver);
driverRoute.post('/loginDriver', loginDriver);


module.exports = driverRoute;


