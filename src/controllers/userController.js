const User = require('../models/user');
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

exports.createUser = async (req, res) => {
  const { fullname, email, phoneNumber, password } = req.body;

  try {
    if (!fullname || !email || !phoneNumber || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use' });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      fullname: fullname,
      email: email,
      phoneNumber: phoneNumber,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const foundUser = await User.findOne({ where: { email } });

    if (!foundUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcryptjs.compare(password, foundUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Incorrect password' });
    }
    foundUser.sessionId = req.sessionID;
    await foundUser.save();

    res.json({ message: 'Login successful', user: foundUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.trackOrders = async (req, res) => {
  try {
  
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Permission denied' });
    }

    const orders = await Order.findAll({
      include: {
        model: User,
        attributes: ['fullname'],
      },
    });

    res.json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createAdminUser = async () => {
  try {
    const [user, created] = await User.findOrCreate({
      where: { fullname: 'admin' },
      defaults: {
        password: 'admin2023',
        role: 'admin',
        isAdmin: true,
        phoneNumber: '90354658464',
        email: 'admin@gmail.com'
      },
    });

    if (created) {
      console.log('Admin user created:', user.fullname);
    } else {
      console.log('Admin user already exists:', user.fullname);
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const adminUser = await User.findOne({ where: { email, role: 'admin' } });

    if (!adminUser) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if the password is correct
    // const isPasswordValid = await bcrypt.compare(password, adminUser.password);
    const isPasswordValid = await password;

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(adminUser.id, adminUser.role);
    res.status(200).json({ message: 'Admin login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



