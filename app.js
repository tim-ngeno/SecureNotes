import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import notesRouter from './routes/notes.js';
import authRouter from './routes/auth.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // Limit each IP to 100 requests
  message: 'Too many requests from this IP, try again after an hour.',
  headers: true
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Server the OpenAPI JSON files
app.use('/openapi.json', express.static(path.join(__dirname,
						  'openapi.json')));
// Serve the rapidoc html file
app.use('/docs', express.static(path.join(__dirname, 'rapidoc.html')));

// Middleware
app.use(bodyParser.json());
app.use(limiter);

// Authentication and routes
app.use('/auth', authRouter);
app.use('/notes', notesRouter);

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the SecureNotes API');
});

// Connect to MongoDB
connectDB();

export default app;
