const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");

const {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
} = require("../controllers/note.controller");

// Protect all note routes
router.use(authMiddleware);

router.post("/", createNote);
router.get("/", getNotes);
router.get("/:id", getNoteById);
router.patch("/:id", updateNote);
router.delete("/:id", deleteNote);

module.exports = router;
