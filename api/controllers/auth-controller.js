// Global imports
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Local imports
const User = require('./../models/user');
const { isEmailAvailable } = require('./../utils/userUtils');

const register = async (data, role, res) => {
  try {
    const emailTaken = await isEmailAvailable(data.email);

    // User is taken, so return
    if (emailTaken) {
      return res.status(400).json({
        status: 'failed',
        data: {
          email: 'Email is already taken',
          message: 'Registration Failure!',
          success: false,
        },
      });
    }

    // Create user
    const hashedPassword = await bcrypt.hash(data.password, 16);
    // Create a verification code of 6 digits
    const code = crypto.randomInt(100000, 1000000);
    const newUser = new User({ ...data, password: hashedPassword, verificationCode: code, role: role });

    await newUser.save();

    return res.status(201).json({
      status: 'success',
      data: {
        message: 'Account successfully created!',
        success: true,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: 'failed',
      data: {
        message: err.message,
        success: false,
      },
    });
  }
};

const login = async (data, res) => {
  try {
    const { email, password } = data;
    const user = await User.findOne({ email });

    // User with that email doesn't exist
    if (!user) {
      return res.status(404).json({
        status: 'failed',
        data: {
          email: 'Incorrect email',
          message: 'Email login attempt failed!',
          success: false,
        },
      });
    }

    // Check user's password
    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(403).json({
        status: 'failed',
        data: {
          message: 'Login failed attempt!',
          email: 'Incorrect Email or Password',
          success: false,
        },
      });
    }

    const token = jwt.sign(
      {
        user_id: user._id,
        role: user.role,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7 days',
      }
    );

    const profile = {
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const result = {
      user: profile,
      token: token,
      expiresIn: 168,
    };

    return res.status(200).json({
      status: 'success',
      data: {
        message: 'Login successful!',
        success: true,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: 'failed',
      data: {
        message: err.message,
        success: false,
      },
    });
  }
};

const verifyEmail = async (data, res) => {
  try {
  } catch (err) {
    return res.status(500).json({
      status: 'failed',
      data: {
        message: err.message,
        success: false,
      },
    });
  }
};

const forgotPassword = async (data, res) => {
  try {
  } catch (err) {
    return res.status(500).json({
      status: 'failed',
      data: {
        message: err.message,
        success: false,
      },
    });
  }
};

const resetPassword = async (data, res) => {
  try {
  } catch (err) {
    return res.status(500).json({
      status: 'failed',
      data: {
        message: err.message,
        success: false,
      },
    });
  }
};
