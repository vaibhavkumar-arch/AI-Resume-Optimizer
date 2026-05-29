import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';
import logger from '../utils/logger.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return sendError(res, 'AUTH_ERROR', 'User already exists', 400);
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      sendSuccess(
        res,
        {
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        },
        'User registered successfully',
        201
      );
    } else {
      sendError(res, 'AUTH_ERROR', 'Invalid user data', 400);
    }
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      sendSuccess(
        res,
        {
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        },
        'Logged in successfully'
      );
    } else {
      sendError(res, 'AUTH_ERROR', 'Invalid email or password', 401);
    }
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      sendSuccess(res, user, 'User retrieved successfully');
    } else {
      sendError(res, 'NOT_FOUND', 'User not found', 404);
    }
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      if (req.body.email) {
        // Basic check if email is taken
        const emailTaken = await User.findOne({ email: req.body.email, _id: { $ne: user._id } });
        if (emailTaken) {
            return sendError(res, 'AUTH_ERROR', 'Email already in use', 400);
        }
        user.email = req.body.email;
      }
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      sendSuccess(
        res,
        {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          token: generateToken(updatedUser._id),
        },
        'Profile updated successfully'
      );
    } else {
      sendError(res, 'NOT_FOUND', 'User not found', 404);
    }
  } catch (error) {
    next(error);
  }
};
