const Driver = require('../models/driver');
const bcryptjs = require('bcryptjs');

const hashPassword = async (password) => {
  try {
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw error;
  }
};

exports.createDriver = async (req, res) => {
  const { fullname, email, phoneNumber, password } = req.body;

  try {
    if (!fullname || !email || !phoneNumber || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingDriver = await Driver.findOne({ where: { email } });
    if (existingDriver) {
      return res.status(400).json({ message: 'Email is already in use' });
    }
    const hashedPassword = await hashPassword(password);
    const newDriver = await Driver.create({
      fullname: fullname,
      email: email,
      phoneNumber: phoneNumber,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'Driver created successfully', driver: newDriver });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.loginDriver = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const driver = await Driver.findOne({ where: { email } });

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    const isPasswordValid = await bcryptjs.compare(password, driver.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Incorrect password' });
    }
    res.json({ message: 'Login successful', driver });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};