import React from "react";
import { MdOutlinePushPin, MdDelete, MdCreate } from "react-icons/md";
import moment from "moment";

const PRIORITY_STYLES = {
  low: { border: "border-l-green-500", badge: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  medium: { border: "border-l-yellow-500", badge: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  high: { border: "border-l-orange-500", badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  urgent: { border: "border-l-red-500", badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

const STATUS_STYLES = {
  "todo": "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
  "in-progress": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "done": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

const STATUS_LABELS = {
  "todo": "Todo",
  "in-progress": "In Progress",
  "done": "Done",
};

const NotesCard = ({
  title,
  date,
  content,
  tags,
  isPinned,
  priority,
  category,
  status,
  dueDate,
  image,
  color,
  onEdit,
  onDelete,
  onPinNote,
}) => {
  const priorityStyle = PRIORITY_STYLES[priority] || PRIORITY_STYLES.low;
  const isOverdue =
    dueDate &&
    new Date(dueDate) < new Date() &&
    status !== "done";

  const imageUrl = image
    ? `${import.meta.env.VITE_BASE_URL?.replace("/api/v1/", "")}${image}`
    : null;

  return (
    <div
      className={`group border border-gray-200 dark:border-dark-border border-l-4 ${priorityStyle.border} rounded-xl p-5 bg-white dark:bg-dark-card hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-blue-900/10 transition-all duration-300 ease-in-out animate-fade-in hover:-translate-y-1 ${
        isOverdue ? "ring-1 ring-red-300 dark:ring-red-800" : ""
      }`}
      style={color && color !== "#ffffff" ? { backgroundColor: color } : {}}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h6 className="text-sm font-semibold text-gray-900 dark:text-dark-text truncate">
            {title}
          </h6>
          <span className="text-xs text-slate-400 dark:text-dark-muted">
            {date}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${priorityStyle.badge}`}>
            {priority}
          </span>
          <MdOutlinePushPin
            className={`text-lg cursor-pointer transition-colors duration-200 ${
              isPinned
                ? "text-primary"
                : "text-slate-300 dark:text-dark-muted hover:text-primary"
            }`}
            onClick={onPinNote}
          />
        </div>
      </div>

      {/* Image thumbnail */}
      {imageUrl && (
        <div className="mt-3">
          <img
            src={imageUrl}
            alt="Note attachment"
            className="w-full h-28 object-cover rounded-lg border border-gray-100 dark:border-dark-border"
          />
        </div>
      )}

      {/* Content preview */}
      <p className="text-xs text-slate-500 dark:text-dark-muted mt-3 leading-relaxed">
        {content?.slice(0, 80)}
        {content?.length > 80 ? "..." : ""}
      </p>

      {/* Meta row: category, status, due date */}
      <div className="flex flex-wrap items-center gap-1.5 mt-3">
        <span className="text-[10px] font-medium bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full capitalize">
          {category || "personal"}
        </span>

        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[status] || STATUS_STYLES.todo}`}>
          {STATUS_LABELS[status] || "Todo"}
        </span>

        {dueDate && (
          <span
            className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
              isOverdue
                ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                : "bg-gray-100 text-gray-600 dark:bg-dark-border dark:text-dark-muted"
            }`}
          >
            📅 {moment(dueDate).format("MMM DD")}
          </span>
        )}
      </div>

      {/* Footer: tags + actions */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-dark-border">
        <div className="flex flex-wrap gap-1.5">
          {tags
            ?.filter((tag) => tag.trim() !== "")
            .map((item, index) => (
              <span
                key={index}
                className="text-[10px] font-medium bg-blue-50 dark:bg-blue-900/30 text-primary px-2 py-0.5 rounded-full"
              >
                #{item}
              </span>
            ))}
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <MdCreate
            className="icon-btn text-lg hover:text-green-500 dark:hover:text-green-400"
            onClick={onEdit}
          />
          <MdDelete
            className="icon-btn text-lg hover:text-red-500 dark:hover:text-red-400"
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default NotesCard;
