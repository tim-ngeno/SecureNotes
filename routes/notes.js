import express from 'express';
import Note from '../models/Note.js';
import authenticateToken from '../middleware/auth.js';
import { encrypt, decrypt } from '../utils/encryption.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Secure all note routes
router.use(authenticateToken);

// Fetch all notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find();

    // Decrypt content for each note:
    const decryptedNotes = notes.map((note) => {
      try {
        return {
	  ...note._doc,
	  content: decrypt(note.content)
        };
      } catch (error) {
        console.error(`Error decrypting note with ID ${note._id}`,
		      error.message);
        return {
	  ...note._doc,
	  content: 'Error decrypting content'
        };
      }
    });
    res.status(200).json({
      message: 'List of all notes',
      data: decryptedNotes
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching notes',
      error: error.message
    });
  }
});

// Create a new note
router.post('/', async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content || title.trim() === '' || content.trim() === '') {
    res.status(400).json({
      message: 'Title and content must not be empty'
    });
  }

  try {
    // Encrypt the content before saving
    const encryptedContent = encrypt(content);
    const newNote = await Note.create({ title, content: encryptedContent });
    logger.info(`Note created by '${req.user.id}' with title '${title}'`);
    res.status(201).json({
      message: 'New note created successfully',
      data: newNote
    });
  } catch (error) {
    logger.error(`Error creating note => ${error.message}`);
    res.status(500).json({
      message: 'Error creating note',
      error: error.message
    });
  }
});

// Update an existing note
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const encryptedContent = encrypt(content);

    const updatedNote = await Note.findByIdAndUpdate(
      id, { title, content: encryptedContent }, { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found!' });
    }

    logger.info(`Note with ID '${id}' updated by '${req.user.id}'`);
    res.status(200).json({
      message: 'Note updated successfully.',
      data: updatedNote
    });
  } catch (error) {
    logger.error(`Error updating note: '${id}' with title '${title}'`);
    res.status(500).json({ message: 'Error updating note:', error });
  }
});

// Delete a note
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedNote = await Note.findByIdAndDelete(id);

    if (!deletedNote) {
      return res(404).json({ message: 'Note not found' });
    }

    logger.info(`Note with id '${id}' deleted successfully`);
    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    logger.error(`Failed to delete note: '${id}'`);
    res.status(500).json({ message: 'Error deleting note:', error });
  }
});

export default router;
