import React from "react";

const EmptyCard = ({ imgSrc, message }) => {
  return (
    <div className="flex items-center justify-center flex-col mt-20 animate-fade-in">
      <img src={imgSrc} alt="No notes" className="w-60 opacity-80 dark:opacity-60" />

      <p className="w-1/2 text-sm font-medium text-slate-500 dark:text-dark-muted text-center leading-7 mt-5">
        {message}
      </p>
    </div>
  );
};

export default EmptyCard;
