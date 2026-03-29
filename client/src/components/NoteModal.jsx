import React, { useState, useEffect, useRef } from "react";

const NoteModal = ({ isOpen, onClose, onSave, editNote }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTitle(editNote?.title || "");
      setDescription(editNote?.description || "");
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [isOpen, editNote]);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) return;
    setLoading(true);
    await onSave({ title: title.trim(), description: description.trim() });
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "modalIn .2s cubic-bezier(.4,0,.2,1)" }}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-stone-100">
          <h2 className="text-lg font-bold text-stone-800 tracking-tight">
            {editNote ? "Edit Note" : "New Note"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4 flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5 block">
              Title
            </label>
            <input
              ref={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-sm placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5 block">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write your note here..."
              rows={5}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-sm placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all resize-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 pb-5">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-medium text-stone-500 hover:bg-stone-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !description.trim() || loading}
            className="px-6 py-2 rounded-xl text-sm font-semibold bg-stone-900 text-white hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-lg shadow-stone-900/20"
          >
            {loading ? (
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : null}
            {editNote ? "Update" : "Create"} Note
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(.93) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default NoteModal;
