const { Sequelize, DataTypes } = require('sequelize');
const User = require('../models/user');
const Driver = require('../models/driver');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  }
);

const Order = sequelize.define('Order', {
  orderId: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4, 
    primaryKey: true,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved','shipped', 'delivered'),
    defaultValue: 'pending',
  },
});

Order.belongsTo(User, { foreignKey: 'userId' });
// User.hasMany(Order);
Order.belongsTo(Driver, { foreignKey: 'driverId' });

Order.sync({ force: false }).then(() => {
  console.log('Order table created successfully');
});

module.exports = Order;
