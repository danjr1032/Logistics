
const express = require('express');
const Sequelize  = require('sequelize');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const {sequelize} = require('./src/database/db');
const userRoute = require ('./src/routes/userRoute');
const driverRoute = require ('./src/routes/driverRoute')
const orderRouter = require('./src/routes/orderRoute');
const adminRouter = require ('./src/routes/adminRoute');
const bodyParser = require('body-parser');

const app = express();

const port = 5000;



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: 'idontgiveashit!',
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
      db: sequelize,
    }),
  })
);


app.use('/user', userRoute);
app.use('/driver', driverRoute);
app.use('/order', orderRouter);
app.use('/admin', adminRouter);





async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');

    await sequelize.sync({ force: true });
    console.log('Models synchronized with the database.');
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
      });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    // sequelize.close();
  }
}

syncDatabase();


