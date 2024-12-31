import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// register a new user
router.post(
  '/register',
  [
    body('username')
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters long'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      // Check if user already exists in the database
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      // Hash user password
      const salt = await bcrypt.genSalt(16);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();

      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error registering user', error });
    }
  }
);

// Login a user
router.post(
  '/login',
  [
    body('username')
      .notEmpty()
      .withMessage('Username is required'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      // check if user exists
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({
	  message: 'Invalid username or password'
        });
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
	  message: 'Invalid username or password'
        });
      }

      // Generate JWT
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ message: 'Login success', token });
    } catch (error) {
      res.status(500).json({
        message: 'Error logging in',
        error: error.message
      });
    }
  }
);

export default router;
