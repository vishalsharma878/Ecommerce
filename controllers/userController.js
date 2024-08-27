
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // user role
    let role = 'user';
    if (email === 'vishal@gmail.com') {
      role = 'admin';
    }

    const newUser = new User({
      name: name,
      email: email,
      password: password,
      role: role,
    });

    await newUser.save();
    
    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ success: false, message: 'Failed to register user' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid email or password' });

    const isMatch = user.password;
    if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid email or password' });

    // Generate a token 
    const token = jwt.sign({ id: user._id, role: user.role}, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ success: true, token, user });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ success: false, message: 'Failed to log in' });
  }
};

exports.isAdmin = (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized'});
    }

    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    console.error('Error checking admin status:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
