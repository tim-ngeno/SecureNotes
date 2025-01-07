import * as chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import request from 'supertest';
import app from '../app.js';
import { encrypt } from '../utils/encryption.js';
import Note from '../models/Note.js';
import User from '../models/User.js';

dotenv.config();

const { use, expect } = chai;
use(chaiHttp);

// Define variables to store authentication tokens
let authToken;
let otherUserAuthToken;
let noteId;

let mongoServer;

// Mocha test suite
describe('SecureNotes Application Tests', () => {
  before(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 40000
    });

    // Clean up test database
    await Note.deleteMany();
    await User.deleteMany();

    // Create test users and get tokens
    const userResponse = await request(app)
	  .post('/auth/register')
	  .send({ email: 'testuser@example.com', password: 'Password123!' });

    const otherUserResponse = await request(app)
	  .post('/auth/register')
	  .send({ email: 'otheruser@example.com', password: 'Password123!' });

    const loginResponse = await request(app)
	  .post('/auth/login')
	  .send({ email: 'testuser@example.com', password: 'Password123!' });

    const otherLoginResponse = await request(app)
	  .post('/auth/login')
	  .send({ email: 'otheruser@example.com', password: 'Password123!' });

    authToken = loginResponse.body.token;
    otherUserAuthToken = otherLoginResponse.body.token;
  });

  // Authentication Tests
  describe('Authentication Endpoints', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app).post('/auth/register').send({
        username: 'newuser',
        password: 'Password123!'
      });
      expect(res).to.have.status(201);
      expect(res.body).to.have.property('message').that.equals('User registered successfully');
    });

    it('should login an existing user successfully', async () => {
      const res = await request(app).post('/auth/login').send({
        username: 'newuser',
        password: 'Password123!'
      });
      authToken = res.body.token;
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('token');
    });
  });

  // Note CRUD Tests
  describe('Notes Endpoints', () => {
    it('should create a new note successfully', async () => {
      const res = await request(app).post('/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Note',
          content: 'This is a test note.'
        });
      expect(res).to.have.status(201);
      expect(res.body).to.have.property('data');
      noteId = res.body.data._id; // Save note ID for further tests
    });

    it('should fetch all notes for the logged-in user', async () => {
      const res = await request(app).get('/notes')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res).to.have.status(200);
      expect(res.body.data).to.be.an('array');
      expect(res.body.data).to.have.lengthOf(1);
    });

    it('should not allow fetching notes without a token', async () => {
      const res = await request(app).get('/notes');
      expect(res).to.have.status(401);
    });

    it('should update a note successfully', async () => {
      const res = await request(app).put(`/notes/${noteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Note',
          content: 'This is an updated note.'
        });
      expect(res).to.have.status(200);
      expect(res.body.data.title).to.equal('Updated Note');
    });

    it('should not allow updating a note by a different user', async () => {
      const res = await request(app).put(`/notes/${noteId}`)
        .set('Authorization', `Bearer ${otherUserAuthToken}`)
        .send({
          title: 'Hacked Note',
          content: 'This is an unauthorized update.'
        });
      expect(res).to.have.status(403);
    });

    it('should delete a note successfully', async () => {
      const res = await request(app).delete(`/notes/${noteId}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('message').that.equals('Note deleted successfully');
    });

    it('should not allow deleting a note by a different user', async () => {
      const res = await request(app).delete(`/notes/${noteId}`)
        .set('Authorization', `Bearer ${otherUserAuthToken}`);
      expect(res).to.have.status(403);
    });
  });

  after(async () => {
    // Clean up test database after all tests are done
    await Note.deleteMany();
    await User.deleteMany();

    // Disconnect mongoose
    await mongoose.disconnect();
  });
});
