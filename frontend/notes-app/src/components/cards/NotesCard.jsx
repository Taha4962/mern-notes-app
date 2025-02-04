import React from "react";
import { MdOutlinePushPin } from "react-icons/md";
import { MdDelete, MdCreate } from "react-icons/md";

const NotesCard = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
}) => {
  return (
    <div className="border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out">
      <div className="flex items-center justify-between">
        <div>
          <h6 className="text-sm font-medium">{title}</h6>
          <span className="text-xs text-slate-500">{date}</span>
        </div>

        <MdOutlinePushPin
          className={`icon-btn ${isPinned ? "text-primary" : "text-slate-500"}`}
          onClick={onPinNote}
        />
      </div>
      <p className="text-xs text-slate-600 mt-3">{content?.slice(0, 60)}</p>

      <div className="flex items-center justify-between mt-2">
        {/* Render tags with gap; filter out empty tags */}
        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          {tags
            .filter((tag) => tag.trim() !== "")
            .map((item, index) => (
              <span key={index} className="pr-2">
                #{item}
              </span>
            ))}
        </div>

        <div className="flex items-center gap-2">
          <MdCreate
            className="icon-btn hover:text-green-600"
            onClick={onEdit}
          />
          <MdDelete
            className="icon-btn hover:text-red-500"
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default NotesCard;
