import { Note } from "../models/notes.models.js";
export const addNote = async (req, res) => {
  const { title, content, tags } = req.body;
  // Adjust destructuring based on how req.user is set by your auth middleware
  const { user } = req.user; // or simply: const user = req.user;

  // Validate that the required fields are provided (title and content)
  if (!title || !content) {
    return res
      .status(400)
      .json({ error: true, message: "Please enter the required fields." });
  }

  try {
    const note = await Note.create({
      title,
      content,
      tags,
      userId: user._id,
    });
    console.log(note);

    return res
      .status(200)
      .json({ error: false, note, message: "Note added successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Issue.", error });
  }
}; // controller for adding the notes in the user fetching data.

// export const editNote = async (req, res) => {
//   const noteId = req.params.noteId;
//   const { title, content, tags } = req.body;
//   const { user } = req.user;
//   console.log("Id of the note : ", noteId);
//   console.log("the id of the user : ", user._id);

//   if (!(title && content && tags)) {
//     return res
//       .status(404)
//       .json({ error: true, message: "Please enter the required fields." });
//   }
//   try {
//     const note = await Note.findOne({ _id: noteId, userId: user._id });
//     console.log(note);

//     if (!note) {
//       return res.status(404).json({ error: true, message: "Note not found." });
//     }
//     if (title) note.title = title;
//     if (content) note.content = content;
//     if (tags) note.tags = tags;

//     await note.save();

//     return res.status(200).json({
//       error: false,
//       message: "Note is updated successfully.",
//       error,
//       note,
//     }); // Giving response when the note is successfully updated.
//   } catch (error) {
//     console.error("Error updating note:", error);
//     return res.status(500).json({ error: true, message: error.message });
//   } // when the note is not updated through the server.
// }; //controller for the editting the notes.

export const editNote = async (req, res) => {
  const noteId = req.params.noteId;

  const { title, content, tags } = req.body;
  const { user } = req.user; // Accessing the user directly
  // console.log("The id of the user:---76 ", user);

  if (!(title && content && tags)) {
    return res
      .status(404)
      .json({ error: true, message: "Please enter the required fields." });
  }

  try {
    const note = await Note.findOne({ _id: noteId, userId: user?._id });
    console.log(note);

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found." });
    }

    // Update fields only if they are provided
    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;

    await note.save();

    return res.status(200).json({
      error: false,
      message: "Note is updated successfully.",
      note,
    });
  } catch (error) {
    console.error("Error updating note:", error);
    return res.status(500).json({ error: true, message: error.message });
  }
};

export const getAllNotes = async (req, res) => {
  const { user } = req.user;

  try {
    const notes = await Note.find({ userId: user._id }).sort({
      isPinned: -1,
    });
    return res.status(200).json({
      error: false,
      notes,
      message: "All notes retrieved successfully.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal sever issue." });
  }
}; // controller for retrieving the notes from the user.

export const deleteNote = async (req, res) => {
  const { user } = req.user;
  const noteId = req.params.noteId;
  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res
        .status(404)
        .json({ error: true, message: "Note is not found." });
    }
    const delNote = await Note.deleteOne({ _id: noteId, userId: user._id });

    return res.status(200).json({
      error: false,
      delNote,
      message: "Note is deleted successfully.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server issue." });
  }
}; // controller for deleting the specific note in the user's note's collection.

export const pinnedNote = async (req, res) => {
  const noteId = req.params.noteId;
  const { isPinned } = req.body;
  const { user } = req.user;

  // Check if isPinned is provided (can be true or false)
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

    // Update isPinned directly
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
}; // controller for getting pinned notes.

export const searchNote = async (req, res) => {
  const { user } = req.user;
  const { query } = req.query;

  if (!query) {
    return res
      .status(404)
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
      message: "Notes matching the search query retireved successfully.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error." });
  }
}; // controller for searching the notes.
