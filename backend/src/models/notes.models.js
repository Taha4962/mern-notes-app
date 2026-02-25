import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "low",
    },
    category: {
      type: String,
      enum: ["personal", "work", "ideas", "tasks", "other"],
      default: "personal",
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },
    dueDate: {
      type: Date,
      default: null,
    },
    color: {
      type: String,
      default: "#ffffff",
    },
    image: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export const Note = mongoose.model("Note", noteSchema);
