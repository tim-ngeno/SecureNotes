# SecureNotes

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)

SecureNotes is a **secure, privacy-first note-taking application** that emphasizes protecting user data. ✨✨✨

---

## Features

- **Authentication & Authorization**: Implements JSON Web Tokens (JWT) for secure user authentication and route protection. 🔒
- **Advanced Encryption**: Uses the AES-256-CBC algorithm for encrypting sensitive note content, ensuring data security at rest. ✨
- **Rate Limiting**: Protects APIs from abuse with configurable rate limiting. 🚀
- **Audit Logging**: Tracks critical application events using Winston for monitoring and debugging. 📋
- **Testing**: Comprehensive endpoint and functionality testing using Mocha, Chai, and Supertest. 🛠️
- **API Documentation**: Provides an interactive API documentation experience with RapiDoc. 📄
- **Scalability**: Dockerized application for consistent and portable deployments. 🐳

---

## Tech Stack

- **Backend**: Node.js with Express.js for RESTful API development. 💻
- **Database**: MongoDB with Mongoose for data modeling. 🗄️
- **Security**:
  - **Encryption**: AES-256-CBC algorithm for note encryption. 🔑
  - **Password Hashing**: Bcrypt for hashing user passwords. 🔐
  - **Authentication**: JSON Web Tokens (JWT) for user session management. 🛡️
  - **Cross-Origin Resource Sharing (CORS)**: Configured for secure API access. 🌐
- **CI/CD Pipeline**: Jenkins for building Docker images and running tests. 🔄
- **Testing**: Mocha, Chai, and Supertest for test-driven development. 🧪

---

## Setting Up the Project Locally

Follow these steps to set up and run SecureNotes on your local machine. 🛠️✨🚀

### Prerequisites

- Node.js (>= 18.x) 🌟
- Docker & Docker Compose 🐳
- MongoDB (via Docker Compose or standalone) 🗄️

### Installation Steps

1. **Clone the Repository**: 🌟
   ```bash
   git clone https://github.com/tim-ngeno/SecureNotes.git
   cd SecureNotes
   ```

2. **Install Dependencies**: ✨
   ```bash
   npm install
   ```

3. **Generate Secrets**: 🔑
   Generate a secure JWT secret and encryption key using Node.js and bcrypt:

   - **Generate Encryption Key**:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```
     Copy the generated key and set it as `ENCRYPTION_KEY` in your `.env` file.

   - **Generate JWT Secret**:
     ```bash
     node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
     ```
     Copy the generated secret and set it as `JWT_SECRET` in your `.env` file.

4. **Set Up Environment Variables**: 🌐
   Create a `.env` file in the project root and configure the following:
   ```env
   JWT_SECRET=<your-jwt-secret>
   MONGO_URI=<your-mongodb-uri>
   ENCRYPTION_KEY=<your-encryption-key>
   PORT=3000
   ```

5. **Start MongoDB with Docker Compose**: 🗄️
   If you're using Docker Compose for MongoDB:
   ```bash
   docker-compose up -d
   ```

6. **Run the Application**: 🖥️
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:3000`. 🚀

7. **Access API Documentation**: 📄
   Visit `http://localhost:3000/docs` to explore the API documentation. ✨

---

## CI/CD Pipeline

SecureNotes utilizes Jenkins to automate builds and tests: 🔄✨🚀

- **Build Process**:
   - Jenkins builds the Docker image for SecureNotes.
   - Automated tests are run to ensure code quality. 🧪
- **Secrets Management**:
   - Jenkins securely manages environment variables, including `JWT_SECRET` and `ENCRYPTION_KEY`. 🔐

---

## API Documentation

SecureNotes uses RapiDoc for interactive API documentation. All endpoints, including authentication-protected ones, are documented for easy testing. 📄✨🔒

- **Authentication Endpoints**:
  - `POST /auth/register`: Register a new user.
  - `POST /auth/login`: Log in and receive a JWT.
- **Notes Endpoints**:
  - `GET /notes`: Fetch all notes (requires authentication).
  - `POST /notes`: Create a new note (requires authentication).
  - `PUT /notes/:id`: Update an existing note (requires authentication).
  - `DELETE /notes/:id`: Delete a note (requires authentication).

---

## Testing

The application is thoroughly tested using: 🧪✨📋

- **Mocha**: Test framework.
- **Chai**: Assertion library.
- **Supertest**: For testing HTTP requests.

Run the tests with:
```bash
npm test
```

---

## Security Features

- **AES-256-CBC Encryption**: Ensures all sensitive note content is encrypted at rest. 🔑✨
- **JWT Authentication**: Protects endpoints with secure token-based authentication. 🛡️
- **Bcrypt Password Hashing**: Safeguards user passwords. 🔐
- **Rate Limiting**: Thwarts abuse by limiting the number of requests per user. 🚦
- **Audit Logging**: Tracks critical actions for monitoring and debugging. 📋

---
