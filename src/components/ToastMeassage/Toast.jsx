import React, { useEffect } from "react";
import { LuCheck } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";

const Toast = ({ isShown, type, onClose, message }) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onClose();
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [onClose]);

  return (
    <div
      className={`fixed top-20 right-6 z-50 transition-all duration-300 ${
        isShown
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-full pointer-events-none"
      }`}
    >
      <div
        className={`relative min-w-[280px] bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border shadow-lg dark:shadow-2xl rounded-xl overflow-hidden
          after:absolute after:top-0 after:left-0 after:h-full after:w-[4px]
          ${
            type === "delete" ? "after:bg-red-500" : "after:bg-green-500"
          } after:rounded-l-xl`}
      >
        <div className="flex items-center gap-3 py-3 px-4">
          <div
            className={`w-9 h-9 flex items-center justify-center rounded-full shrink-0 ${
              type === "delete"
                ? "bg-red-50 dark:bg-red-900/30"
                : "bg-green-50 dark:bg-green-900/30"
            }`}
          >
            {type === "delete" ? (
              <MdDeleteOutline className="text-lg text-red-500" />
            ) : (
              <LuCheck className="text-lg text-green-500" />
            )}
          </div>
          <p className="text-sm text-slate-800 dark:text-dark-text font-medium">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Toast;
