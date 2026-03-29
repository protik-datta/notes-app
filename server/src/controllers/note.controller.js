const Note = require("../models/note.models");

// CREATE NOTE
exports.createNote = async (req, res) => {
  try {
    const { title, description } = req.body;
    const note = await Note.create({
      title,
      description,
      userId: req.user.id,
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL NOTES FOR LOGGED IN USER
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({
      isPinned: -1,
      createdAt: -1,
    });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE NOTE (only if owned)
exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });

    if (!note) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
    }
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE NOTE (only if owned)
exports.updateNote = async (req, res) => {
  try {
    const { title, description, isPinned } = req.body;

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      {
        title,
        description,
        isPinned,
      },
      { new: true },
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
    }

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE NOTE (only if owned)
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
    }

    res.status(200).json({ message: "Note deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
