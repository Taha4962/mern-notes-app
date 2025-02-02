import {
  addNote,
  deleteNote,
  editNote,
  getAllNotes,
  pinnedNote,
  searchNote,
} from "../controllers/note.controllers.js";
import { authenticationToken } from "../utilities.js";
import express from "express";

const router = express.Router();

// Note requests API
router.post("/add-note", authenticationToken, addNote);
router.patch("/edit-note/:noteId", authenticationToken, editNote);
router.get("/get-all-notes", authenticationToken, getAllNotes);
router.delete("/delete-note/:noteId", authenticationToken, deleteNote);
router.patch("/update-note-pinned/:noteId", authenticationToken, pinnedNote);
router.get("/search-note", authenticationToken, searchNote);

export default router;
