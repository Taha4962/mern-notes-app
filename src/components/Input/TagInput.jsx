import React, { useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";

const TagInput = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const addNewTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue !== "" && !tags.includes(trimmedValue)) {
      setTags([...tags, trimmedValue]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addNewTag();
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="flex items-center gap-1.5 text-xs font-medium text-primary bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full animate-scale-in"
            >
              #{tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
              >
                <MdClose size={14} />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-3 mt-3">
        <input
          className="text-sm bg-transparent dark:text-dark-text border border-gray-300 dark:border-dark-border px-3 py-2 rounded-lg outline-none focus:border-primary transition-colors duration-200"
          type="text"
          placeholder="Add tags..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white hover:bg-blue-600 transition-colors duration-200"
          onClick={addNewTag}
        >
          <MdAdd className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default TagInput;
