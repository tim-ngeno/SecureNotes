import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import notesRouter from './routes/notes.js';
import authRouter from './routes/auth.js';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, 	// Up to 1 hour
  max: 100, 			// Limit each IP to 100 requests
  message: 'Too many requests from this IP, try again after an hour.',
  headers: true
});

// Bodyparser middleware
app.use(bodyParser.json());

// Authentication middleware
app.use('/auth', authRouter);

// Apply rate limiting to requests
app.use(limiter);

// Connect to MongoDB and listen for changes
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB...'))
  .catch((error) => console.error('MongoDB connection error: ', error));

// Use imported routes
app.use('/notes', notesRouter);

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the SecureNotes API');
});

// Listen for incoming connections
app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
