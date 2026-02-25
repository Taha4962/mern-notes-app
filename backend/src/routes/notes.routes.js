import express from "express";
import { authenticationToken } from "../utilities.js";
import { uploadNoteImage } from "../upload.js";
import {
  addNote,
  editNote,
  getAllNotes,
  deleteNote,
  pinnedNote,
  searchNote,
  getNotesWithFilters,
  getNoteStats,
} from "../controllers/note.controllers.js";

const notesRouter = express.Router();

notesRouter.post("/add-note", authenticationToken, uploadNoteImage, addNote);
notesRouter.patch("/edit-note/:noteId", authenticationToken, uploadNoteImage, editNote);
notesRouter.get("/get-all-notes", authenticationToken, getAllNotes);
notesRouter.delete("/delete-note/:noteId", authenticationToken, deleteNote);
notesRouter.patch("/update-note-pinned/:noteId", authenticationToken, pinnedNote);
notesRouter.get("/search-note", authenticationToken, searchNote);
notesRouter.get("/filter-notes", authenticationToken, getNotesWithFilters);
notesRouter.get("/note-stats", authenticationToken, getNoteStats);

export default notesRouter;
