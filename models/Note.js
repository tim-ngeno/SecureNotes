import mongoose, { Schema } from 'mongoose';

const noteSchema = new Schema({
  title: {
    type: String,
    required: true
  },

  content: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const Note = mongoose.model('Note', noteSchema);

export default Note;
