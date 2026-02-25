import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className="flex items-center bg-transparent dark:bg-dark-card border-[1.5px] border-gray-300 dark:border-dark-border px-5 rounded-lg mb-3 focus-within:border-primary transition-colors duration-200">
      <input
        value={value}
        onChange={onChange}
        type={isShowPassword ? "text" : "password"}
        placeholder={placeholder || "Password"}
        className="text-sm w-full bg-transparent py-3 mr-3 outline-none rounded text-gray-800 dark:text-dark-text placeholder-slate-400 dark:placeholder-dark-muted"
      />

      {isShowPassword ? (
        <FaRegEye
          size={22}
          className="text-primary cursor-pointer"
          onClick={() => toggleShowPassword()}
        />
      ) : (
        <FaRegEyeSlash
          size={22}
          className="text-slate-400 dark:text-dark-muted cursor-pointer hover:text-primary transition-colors duration-200"
          onClick={() => toggleShowPassword()}
        />
      )}
    </div>
  );
};

export default PasswordInput;
