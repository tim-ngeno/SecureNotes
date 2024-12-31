import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      message: 'Access denied, no token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;		// Attach user info to request object
    next();
  } catch (error) {
    res.status(403).json({
      message: 'Invalid or expired token'
    });
  }
};

export default authenticateToken;
