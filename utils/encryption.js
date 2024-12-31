import crypto from 'crypto';
import dotenv from 'dotenv';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const IV_LENGTH = 16; 		// Initialization vector length

// Encryption function
export const encrypt = (text) => {
  const iv = crypto.randomBytes(IV_LENGTH); // Generate random IV
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    iv
  );
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted; // Store IV with encrypted text
};

// Decryption function
export const decrypt = (encryptedText) => {
  const [iv, encrypted] = encryptedText.split(':');
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    Buffer.from(iv, 'hex')
  );
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};
