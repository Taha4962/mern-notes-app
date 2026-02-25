import React, { useRef } from "react";
import { getInitials } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const ProfileInfo = ({ onLogout, userInfo, onAvatarUpdate }) => {
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await axiosInstance.put("/users/update-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data && !response.data.error) {
        if (onAvatarUpdate) onAvatarUpdate(response.data.user);
      }
    } catch (error) {
      console.error("Avatar upload failed:", error);
    }
  };

  const avatarUrl = userInfo?.avatar
    ? `${import.meta.env.VITE_BASE_URL?.replace("/api/v1/", "")}${userInfo.avatar}`
    : null;

  return (
    <div className="flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity relative group"
        onClick={handleAvatarClick}
        title="Click to change avatar"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={userInfo?.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white font-semibold text-sm bg-gradient-to-br from-primary to-blue-600 shadow-md">
            {getInitials(userInfo?.name)}
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
          <span className="text-white text-[9px] font-medium">Edit</span>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarChange}
      />

      <div>
        <p className="text-sm font-medium text-gray-800 dark:text-dark-text">
          {userInfo?.name}
        </p>
        <button
          className="text-xs text-slate-500 dark:text-dark-muted hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
