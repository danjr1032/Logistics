// Import necessary modules
const { Sequelize, DataTypes } = require('sequelize');
const bcryptjs = require('bcryptjs');

// Define Sequelize connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  }
);

// Define Driver model
const Driver = sequelize.define('Driver', {
  driverId: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4, 
    primaryKey: true,
    allowNull: false,
  },

  fullname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  phoneNumber: {
    type: DataTypes.STRING, 
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});


Driver.sync({ force: false }).then(() => {
  console.log('Driver table created successfully');
});

module.exports = Driver;
