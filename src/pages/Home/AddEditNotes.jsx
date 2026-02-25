import React, { useState } from "react";
import TagInput from "../../components/Input/TagInput";
import { MdClose, MdCloudUpload, MdDeleteOutline } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";

const PRIORITIES = [
  { value: "low", label: "Low", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", dot: "bg-green-500" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", dot: "bg-yellow-500" },
  { value: "high", label: "High", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400", dot: "bg-orange-500" },
  { value: "urgent", label: "Urgent", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", dot: "bg-red-500" },
];

const CATEGORIES = ["personal", "work", "ideas", "tasks", "other"];

const STATUSES = [
  { value: "todo", label: "Todo", color: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300" },
  { value: "in-progress", label: "In Progress", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  { value: "done", label: "Done", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
];

const COLOR_SWATCHES = ["#ffffff", "#fef3c7", "#dbeafe", "#d1fae5", "#fce7f3", "#ede9fe"];

const AddEditNotes = ({
  noteData,
  type,
  onClose,
  getAllNotes,
  showToastMsg,
}) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [priority, setPriority] = useState(noteData?.priority || "low");
  const [category, setCategory] = useState(noteData?.category || "personal");
  const [status, setStatus] = useState(noteData?.status || "todo");
  const [dueDate, setDueDate] = useState(
    noteData?.dueDate ? noteData.dueDate.slice(0, 10) : ""
  );
  const [color, setColor] = useState(noteData?.color || "#ffffff");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(noteData?.image || null);
  const [removeImage, setRemoveImage] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setRemoveImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(true);
  };

  const buildFormData = () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("priority", priority);
    formData.append("category", category);
    formData.append("status", status);
    formData.append("color", color);
    if (dueDate) formData.append("dueDate", dueDate);
    if (tags.length > 0) {
      tags.forEach((tag) => formData.append("tags", tag));
    }
    if (imageFile) {
      formData.append("image", imageFile);
    }
    if (removeImage) {
      formData.append("removeImage", "true");
    }
    return formData;
  };

  const addNewNote = async () => {
    setIsLoading(true);
    try {
      const formData = buildFormData();
      const response = await axiosInstance.post("/notes/add-note", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data && !response.data.error) {
        showToastMsg("Note Added Successfully.");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const editNote = async () => {
    if (!noteData?._id) {
      setError("Invalid note. Please try again.");
      return;
    }
    setIsLoading(true);
    try {
      const formData = buildFormData();
      const response = await axiosInstance.patch(
        `/notes/edit-note/${noteData._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.data && !response.data.error) {
        showToastMsg("Note Updated Successfully.");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNote = () => {
    if (!title) { setError("Please enter the title."); return; }
    if (!content) { setError("Please enter the content."); return; }
    setError(null);
    if (type === "edit") editNote();
    else addNewNote();
  };

  return (
    <div className="relative">
      {/* Close button */}
      <button
        className="w-9 h-9 rounded-full flex items-center justify-center absolute -top-1 -right-1 hover:bg-gray-100 dark:hover:bg-dark-border transition-colors duration-200 z-10"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400 hover:text-red-500" />
      </button>

      {/* Title */}
      <div className="flex flex-col gap-1">
        <label className="input-label">Title</label>
        <input
          type="text"
          className="text-xl font-semibold text-slate-950 dark:text-dark-text outline-none bg-transparent pb-2 border-b border-gray-200 dark:border-dark-border focus:border-primary transition-colors"
          placeholder="e.g. Sprint Planning"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Priority */}
      <div className="mt-4">
        <label className="input-label">Priority</label>
        <div className="flex gap-2 mt-1.5">
          {PRIORITIES.map((p) => (
            <button
              key={p.value}
              onClick={() => setPriority(p.value)}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200 ${
                priority === p.value
                  ? `${p.color} ring-2 ring-offset-1 ring-current scale-105`
                  : "bg-gray-100 dark:bg-dark-border text-slate-500 dark:text-dark-muted hover:scale-105"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${p.dot}`}></span>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category & Status row */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <label className="input-label">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full text-sm mt-1.5 px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg dark:text-dark-text outline-none focus:border-primary transition-colors capitalize"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="capitalize">
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="input-label">Status</label>
          <div className="flex gap-1.5 mt-1.5">
            {STATUSES.map((s) => (
              <button
                key={s.value}
                onClick={() => setStatus(s.value)}
                className={`text-[11px] font-medium px-2.5 py-1.5 rounded-full transition-all duration-200 ${
                  status === s.value
                    ? `${s.color} ring-2 ring-offset-1 ring-current scale-105`
                    : "bg-gray-100 dark:bg-dark-border text-slate-500 dark:text-dark-muted"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Due Date & Color row */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <label className="input-label">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full text-sm mt-1.5 px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg dark:text-dark-text outline-none focus:border-primary transition-colors"
          />
        </div>

        <div>
          <label className="input-label">Card Color</label>
          <div className="flex gap-2 mt-2">
            {COLOR_SWATCHES.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-7 h-7 rounded-full border-2 transition-transform duration-200 hover:scale-110 ${
                  color === c
                    ? "border-primary scale-110 ring-2 ring-primary/30"
                    : "border-gray-300 dark:border-dark-border"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 mt-4">
        <label className="input-label">Content</label>
        <textarea
          className="text-sm text-slate-800 dark:text-dark-text outline-none bg-slate-50 dark:bg-dark-bg p-3 rounded-lg border border-gray-200 dark:border-dark-border focus:border-primary transition-colors resize-none"
          placeholder="Write your note content here..."
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {/* Image Upload */}
      <div className="mt-4">
        <label className="input-label">Attachment (optional)</label>
        {imagePreview ? (
          <div className="relative mt-2 inline-block">
            <img
              src={
                imagePreview.startsWith("blob:")
                  ? imagePreview
                  : `${import.meta.env.VITE_BASE_URL?.replace("/api/v1/", "")}${imagePreview}`
              }
              alt="Note attachment"
              className="max-h-32 rounded-lg border border-gray-200 dark:border-dark-border"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <MdClose size={14} />
            </button>
          </div>
        ) : (
          <label className="flex items-center gap-2 mt-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-dark-border rounded-lg cursor-pointer hover:border-primary dark:hover:border-primary transition-colors group">
            <MdCloudUpload className="text-xl text-slate-400 group-hover:text-primary transition-colors" />
            <span className="text-sm text-slate-500 dark:text-dark-muted group-hover:text-primary transition-colors">
              Click to upload an image
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        )}
      </div>

      {/* Tags */}
      <div className="mt-4">
        <label className="input-label">Tags</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && (
        <p className="text-red-500 text-xs pt-4 animate-fade-in">{error}</p>
      )}

      <button
        className="btn-primary font-medium mt-6 py-3"
        onClick={handleAddNote}
        disabled={isLoading}
      >
        {isLoading
          ? "Saving..."
          : type === "edit"
          ? "Update Note"
          : "Add Note"}
      </button>
    </div>
  );
};

export default AddEditNotes;
