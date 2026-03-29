const express = require("express");
const router = express.Router();
const noteController = require("../controllers/note.controller");
const multer = require("multer");
const upload = multer();

router.post("/", upload.none(), noteController.createNote);
router.get("/", noteController.getNotes);
router.get("/:id", noteController.getNoteById);
router.patch("/:id",upload.none(), noteController.updateNote);
router.delete("/:id", noteController.deleteNote);

module.exports = router;
