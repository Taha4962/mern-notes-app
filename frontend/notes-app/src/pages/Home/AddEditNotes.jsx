import React, { useState } from "react";
import TagInput from "../../components/Input/TagInput";
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";

const AddEditNotes = ({
  noteData,
  type,
  onClose,
  getAllNotes,
  showToastMsg,
}) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  // Initialize tags as an empty array
  const [tags, setTags] = useState(noteData?.tags || []);
  const [error, setError] = useState(null);

  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post("/notes/add-note", {
        title,
        content,
        tags,
      });
      // Use a condition based on your API response structure
      if (response.data && !response.data.error) {
        showToastMsg("Note Added Successfully.");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      }
    }
  };

  const editNote = async () => {
    if (!noteData || !noteData._id) {
      setError("Invalid note. Please try again.");
      return;
    }

    const noteId = noteData._id;
    // Implement edit functionality if needed.
    try {
      const response = await axiosInstance.patch(`/notes/edit-note/${noteId}`, {
        title,
        content,
        tags,
      });

      if (response.data && !response.data.error) {
        showToastMsg("Note Updated Successfully.");

        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log(`Something went wrong. ${error.response.data.message}`);
        setError(error.response.data.message);
      }
    }
  };

  const handleAddNote = () => {
    if (!title) {
      setError("Please enter the title.");
      return;
    }

    if (!content) {
      setError("Please enter the content.");
      return;
    }

    // Clear error only if both fields are valid
    setError(null);

    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };

  return (
    <div className="shadow-lg rounded-md px-2 relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:text-red-500 m-2"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400 hover:text-red-600" />
      </button>
      <div className="flex flex-col gap-2 ">
        <label className="input-label">TITLE</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="Go to Gym."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-3 mt-4">
        <label className="input-label">CONTENT</label>
        <textarea
          type="text"
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          placeholder="Content"
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className="mt-4">
        <label className="input-label">TAGS</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>
      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}
      <button
        className="btn-primary font-medium mt-5 p-3"
        onClick={handleAddNote}
      >
        {type === "edit" ? "update" : "ADD"}
      </button>
    </div>
  );
};

export default AddEditNotes;
