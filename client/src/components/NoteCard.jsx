import React, { useState } from "react";

const formatDate = (d) =>
  new Date(d || Date.now()).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const NoteCard = ({ note, onEdit, onDelete, onPin }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(note._id);
  };

  return (
    <div
      className={`group relative flex flex-col gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border p-3.5 sm:p-5 transition-all duration-300
        hover:-translate-y-1 hover:shadow-2xl
        ${
          note.isPinned
            ? "border-amber-400/60 bg-amber-50/80 shadow-amber-100 shadow-lg"
            : "border-stone-200 bg-white/90 shadow-sm hover:border-stone-300"
        }
        ${deleting ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"}
      `}
      style={{ transition: "all 0.3s cubic-bezier(.4,0,.2,1)" }}
    >
      {/* Pin badge */}
      {note.isPinned && (
        <div className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-400 shadow-md">
          <svg
            className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M16 4v6l2 2-2 2v2h-2v4h-2v-4H8v-2l-2-2 2-2V4h8z" />
          </svg>
        </div>
      )}

      {/* Title */}
      <div className="flex items-start justify-between gap-2">
        <h3
          className="text-sm sm:text-[15px] font-semibold leading-snug text-stone-800 tracking-tight line-clamp-2 cursor-pointer hover:text-amber-600 transition-colors"
          onClick={() => onEdit(note)}
        >
          {note.title}
        </h3>
      </div>

      {/* Description */}
      <p className="text-xs sm:text-[13px] text-stone-500 leading-relaxed line-clamp-3 flex-1">
        {note.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 mt-auto gap-2">
        <span className="text-[10px] sm:text-[11px] text-stone-400 font-medium tracking-wide shrink-0">
          {formatDate(note.createdAt)}
        </span>

        <div className="flex items-center gap-0.5 sm:gap-1">
          {/* Pin */}
          <button
            onClick={() => onPin(note)}
            title={note.isPinned ? "Unpin" : "Pin"}
            className={`p-2 sm:p-1.5 rounded-lg transition-colors touch-manipulation ${
              note.isPinned
                ? "text-amber-500 hover:bg-amber-100"
                : "text-stone-400 hover:bg-stone-100 hover:text-amber-500"
            }`}
          >
            <svg
              className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M16 4v6l2 2-2 2v2h-2v4h-2v-4H8v-2l-2-2 2-2V4h8z" />
            </svg>
          </button>

          {/* Edit */}
          <button
            onClick={() => onEdit(note)}
            className="p-2 sm:p-1.5 rounded-lg text-stone-400 hover:bg-blue-50 hover:text-blue-500 transition-colors touch-manipulation"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>

          {/* Delete */}
          <button
            onClick={handleDelete}
            className="p-2 sm:p-1.5 rounded-lg text-stone-400 hover:bg-red-50 hover:text-red-500 transition-colors touch-manipulation"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
