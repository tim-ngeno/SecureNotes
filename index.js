import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import notesRouter from './routes/notes.js';
import authRouter from './routes/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 5000;
const MONGO_URI = process.env.MONGO_URI;

// Bodyparser middleware
app.use(bodyParser.json());

// Authentication middleware
app.use('/auth', authRouter);

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
