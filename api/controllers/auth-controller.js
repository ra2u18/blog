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
          success: false,
          email: 'Email is already taken',
          message: 'Registration Failure!',
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
        success: true,
        message: 'Account successfully created!',
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: 'failed',
      data: {
        success: false,
        message: err.message,
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
          success: false,
          email: 'Incorrect email',
          message: 'Email login attempt failed!',
        },
      });
    }

    // Check user's password
    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(403).json({
        status: 'failed',
        data: {
          success: false,
          message: 'Login failed attempt!',
          email: 'Incorrect Email or Password',
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
        success: true,
        message: 'Login successful!',
        profile: result,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: 'failed',
      data: {
        success: false,
        message: err.message,
      },
    });
  }
};

const verifyEmail = async (data, res) => {
  try {
    const { code } = data;
    const user = await User.findOne({ verificationCode: code });

    // User not found or user has already verified their email
    if (!user) {
      return res.status(404).json({
        status: 'failed',
        data: {
          success: false,
          message: 'Invalid code!',
        },
      });
    } else if (user.isEmailVerified) {
      return res.status(404).json({
        status: 'failed',
        data: {
          success: false,
          message: 'Email already verified!',
        },
      });
    }

    await user.update({ isEmailVerified: true });
    return res.status(201).json({
      status: 'success',
      data: {
        success: true,
        message: 'Email successfully verified!',
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: 'failed',
      data: {
        success: false,
        message: err.message,
      },
    });
  }
};

const forgotPassword = async (data, res) => {
  try {
    const { email } = data;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: 'failed',
        data: {
          success: false,
          message: 'Invalid email!',
        },
      });
    }

    // Generate a new code
    const code = crypto.randomInt(100000, 1000000);
    const hashedCode = await bcrypt.hash(code.toString(), 16);

    await user.update({ passwordResetCode: hashedCode });

    return res.status(200).json({
      status: 'success',
      data: {
        success: true,
        message: 'Verification code sent to your email!',
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: 'failed',
      data: {
        success: false,
        message: err.message,
      },
    });
  }
};

const resetPassword = async (data, res) => {
  try {
    let { email, code, newPassword } = data;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: 'failed',
        data: {
          success: false,
          message: 'Invalid email!',
        },
      });
    }

    let isCodeMatched = await bcrypt.compare(code.toString(), user.passwordResetCode);

    if (!isCodeMatched) {
      return res.status(404).json({
        status: 'failed',
        data: {
          success: false,
          message: 'Invalid code!',
        },
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 16);
    await user.update({ password: hashedPassword, passwordResetCode: '' });
    return res.status(201).json({
      status: 'success',
      data: {
        success: true,
        message: 'Your password has been successfully reset!',
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: 'failed',
      data: {
        success: false,
        message: err.message,
      },
    });
  }
};

const changePassword = async (data, res) => {
  try {
    // Check oldPassword against newPassword for security purposes
    const { oldPassword, newPassword } = data;

    // Since the user is logged in we have access to the _id
    const user = await User.findById(req.user._id);
    const isPasswordMatched = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordMatched) {
      return res.status(404).json({
        status: 'failed',
        data: {
          success: false,
          message: 'Your old password is incorrect',
        },
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 16);
    await user.update({ password: hashedPassword });
    return res.status(201).json({
      status: 'success',
      data: {
        success: true,
        message: 'Your password has been successfully reset',
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: 'failed',
      data: {
        success: false,
        message: err.message,
      },
    });
  }
};

module.exports = {
  login,
  register,
  verify,
  forgotPassword,
  resetPassword,
  changePassword,
};
