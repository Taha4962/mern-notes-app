import { Note } from "../models/notes.models.js";

export const addNote = async (req, res) => {
  const { title, content, tags, priority, category, status, dueDate, color } =
    req.body;
  const { user } = req.user;

  if (!title || !content) {
    return res
      .status(400)
      .json({ error: true, message: "Please enter the required fields." });
  }

  try {
    const noteData = {
      title,
      content,
      tags: tags || [],
      userId: user._id,
      priority: priority || "low",
      category: category || "personal",
      status: status || "todo",
      dueDate: dueDate || null,
      color: color || "#ffffff",
    };

    // If an image was uploaded via multer
    if (req.file) {
      noteData.image = `/uploads/notes/${req.file.filename}`;
    }

    const note = await Note.create(noteData);

    return res
      .status(201)
      .json({ error: false, note, message: "Note added successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Issue." });
  }
};

export const editNote = async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, priority, category, status, dueDate, color, removeImage } =
    req.body;
  const { user } = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user?._id });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found." });
    }

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (tags !== undefined) note.tags = tags;
    if (priority !== undefined) note.priority = priority;
    if (category !== undefined) note.category = category;
    if (status !== undefined) note.status = status;
    if (dueDate !== undefined) note.dueDate = dueDate;
    if (color !== undefined) note.color = color;

    // Handle image upload
    if (req.file) {
      note.image = `/uploads/notes/${req.file.filename}`;
    }

    // Handle image removal
    if (removeImage === "true" || removeImage === true) {
      note.image = null;
    }

    await note.save();

    return res.status(200).json({
      error: false,
      message: "Note updated successfully.",
      note,
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

export const getAllNotes = async (req, res) => {
  const { user } = req.user;

  try {
    const notes = await Note.find({ userId: user._id }).sort({
      isPinned: -1,
      createdAt: -1,
    });
    return res.status(200).json({
      error: false,
      notes,
      message: "All notes retrieved successfully.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server issue." });
  }
};

export const deleteNote = async (req, res) => {
  const { user } = req.user;
  const noteId = req.params.noteId;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res
        .status(404)
        .json({ error: true, message: "Note not found." });
    }

    const delNote = await Note.deleteOne({ _id: noteId, userId: user._id });

    return res.status(200).json({
      error: false,
      delNote,
      message: "Note deleted successfully.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server issue." });
  }
};

export const pinnedNote = async (req, res) => {
  const noteId = req.params.noteId;
  const { isPinned } = req.body;
  const { user } = req.user;

  if (isPinned === undefined) {
    return res.status(400).json({
      error: true,
      message: "Please provide a valid isPinned value.",
    });
  }

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(404).json({
        error: true,
        message: "Note not found.",
      });
    }

    note.isPinned = isPinned;
    await note.save();

    return res.status(200).json({
      error: false,
      message: `Note ${isPinned ? "pinned" : "unpinned"} successfully.`,
      note,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server issue." });
  }
};

export const searchNote = async (req, res) => {
  const { user } = req.user;
  const { query } = req.query;

  if (!query) {
    return res
      .status(400)
      .json({ error: true, message: "Search query is required." });
  }

  try {
    const matchNotes = await Note.find({
      userId: user._id,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ],
    });

    return res.status(200).json({
      error: false,
      notes: matchNotes,
      message: "Notes matching the search query retrieved successfully.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error." });
  }
};

// Filter notes by priority, category, status
export const getNotesWithFilters = async (req, res) => {
  const { user } = req.user;
  const { priority, category, status, sort } = req.query;

  try {
    const filter = { userId: user._id };
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (status) filter.status = status;

    // Sort options
    let sortOption = { isPinned: -1, createdAt: -1 };
    if (sort === "priority") {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      // We'll sort in memory since MongoDB doesn't support enum ordering natively
      sortOption = { isPinned: -1, createdAt: -1 };
    } else if (sort === "dueDate") {
      sortOption = { isPinned: -1, dueDate: 1 };
    } else if (sort === "title") {
      sortOption = { isPinned: -1, title: 1 };
    }

    let notes = await Note.find(filter).sort(sortOption);

    // Custom priority sort (in memory)
    if (sort === "priority") {
      const priorityWeight = { urgent: 0, high: 1, medium: 2, low: 3 };
      notes = notes.sort((a, b) => {
        if (a.isPinned !== b.isPinned) return b.isPinned - a.isPinned;
        return (priorityWeight[a.priority] || 3) - (priorityWeight[b.priority] || 3);
      });
    }

    return res.status(200).json({
      error: false,
      notes,
      message: "Filtered notes retrieved successfully.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error." });
  }
};

// Get note stats (counts by priority and status)
export const getNoteStats = async (req, res) => {
  const { user } = req.user;

  try {
    const notes = await Note.find({ userId: user._id });

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const stats = {
      total: notes.length,
      byPriority: {
        low: notes.filter((n) => n.priority === "low").length,
        medium: notes.filter((n) => n.priority === "medium").length,
        high: notes.filter((n) => n.priority === "high").length,
        urgent: notes.filter((n) => n.priority === "urgent").length,
      },
      byStatus: {
        todo: notes.filter((n) => n.status === "todo").length,
        "in-progress": notes.filter((n) => n.status === "in-progress").length,
        done: notes.filter((n) => n.status === "done").length,
      },
      dueToday: notes.filter(
        (n) => n.dueDate && new Date(n.dueDate) >= now && new Date(n.dueDate) < tomorrow
      ).length,
      overdue: notes.filter(
        (n) => n.dueDate && new Date(n.dueDate) < now && n.status !== "done"
      ).length,
    };

    return res.status(200).json({
      error: false,
      stats,
      message: "Note stats retrieved successfully.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error." });
  }
};
