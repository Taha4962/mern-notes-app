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
      className={`absolute top-20 right-6 transition-all duration-400 ${
        isShown ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`relative min-w-[260px] bg-white border border-gray-200 shadow-md rounded-md
          after:absolute after:top-0 after:left-0 after:h-full after:w-[4px] 
          ${
            type === "delete" ? "after:bg-red-500" : "after:bg-green-500"
          } after:rounded-l-md`}
      >
        <div className="flex items-center gap-3 py-2 px-4">
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-full ${
              type === "delete" ? "bg-red-50 " : "bg-green-50"
            }`}
          >
            {type === "delete" ? (
              <MdDeleteOutline className="text-xl text-red-500" />
            ) : (
              <LuCheck className="text-xl text-green-500" />
            )}
          </div>
          <p className="text-sm text-slate-800">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Toast;
