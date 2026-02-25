import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className="w-80 flex items-center px-4 bg-slate-100 dark:bg-dark-border rounded-lg border border-transparent focus-within:border-primary transition-colors duration-200">
      <input
        type="text"
        placeholder="Search Notes..."
        className="w-full text-xs bg-transparent py-[11px] outline-none text-gray-800 dark:text-dark-text placeholder-slate-400 dark:placeholder-dark-muted"
        value={value}
        onChange={onChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />
      {value && (
        <IoMdClose
          className="text-xl text-slate-500 dark:text-dark-muted cursor-pointer hover:text-red-500 dark:hover:text-red-400 mr-3 transition-colors duration-200"
          onClick={onClearSearch}
        />
      )}

      <FaMagnifyingGlass
        className="text-slate-400 dark:text-dark-muted cursor-pointer hover:text-primary transition-colors duration-200"
        onClick={handleSearch}
      />
    </div>
  );
};

export default SearchBar;
