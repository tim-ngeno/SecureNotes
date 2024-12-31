import express from 'express';
import Note from '../models/Note.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

// Secure all note routes
router.use(authenticateToken);

// Fetch all notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find();
    res.status(200).json({
      message: 'List of all notes',
      data: notes
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

  if (!title || !content) {
    res.status(400).json({
      message: 'Title and content are required'
    });
  }

  try {
    const newNote = await Note.create({ title, content });

    res.status(201).json({
      message: 'New note created successfully',
      data: newNote
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating note' });
  }
});

// Update an existing note
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const updatedNote = await Note.findByIdAndUpdate(
      id, { title, content }, { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found!' });
    }

    res.status(200).json({
      message: 'Note updated successfully.',
      data: updatedNote
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating note:', error });
  }
});

// Delete a note
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedNote = await Note.findByIdAndDelete(id);

    if (!deletedNote) {
      return res(400).json({ message: 'Note not found' });
    }

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting note:', error });
  }
});

export default router;
