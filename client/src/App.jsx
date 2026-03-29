import { useState, useEffect, useRef } from "react";

const API = `${import.meta.env.VITE_API_URL}/api/notes`;

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
      className={`group relative flex flex-col gap-3 rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl
        ${
          note.isPinned
            ? "border-amber-400/60 bg-amber-50/80 shadow-amber-100 shadow-lg"
            : "border-stone-200 bg-white/90 shadow-sm hover:border-stone-300"
        }
        ${deleting ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"}
      `}
      style={{ transition: "all 0.3s cubic-bezier(.4,0,.2,1)" }}
    >
      {note.isPinned && (
        <div className="absolute -top-2 -right-2 flex items-center justify-center w-7 h-7 rounded-full bg-amber-400 shadow-md">
          <svg
            className="w-3.5 h-3.5 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M16 4v6l2 2-2 2v2h-2v4h-2v-4H8v-2l-2-2 2-2V4h8z" />
          </svg>
        </div>
      )}

      <div className="flex items-start justify-between gap-2">
        <h3
          className="text-[15px] font-semibold leading-snug text-stone-800 tracking-tight line-clamp-2 cursor-pointer hover:text-amber-600 transition-colors"
          onClick={() => onEdit(note)}
        >
          {note.title}
        </h3>
      </div>

      <p className="text-[13px] text-stone-500 leading-relaxed line-clamp-3 flex-1">
        {note.description}
      </p>

      <div className="flex items-center justify-between pt-1 mt-auto">
        <span className="text-[11px] text-stone-400 font-medium tracking-wide">
          {formatDate(note.createdAt)}
        </span>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onPin(note)}
            title={note.isPinned ? "Unpin" : "Pin"}
            className={`p-1.5 rounded-lg transition-colors ${
              note.isPinned
                ? "text-amber-500 hover:bg-amber-100"
                : "text-stone-400 hover:bg-stone-100 hover:text-amber-500"
            }`}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M16 4v6l2 2-2 2v2h-2v4h-2v-4H8v-2l-2-2 2-2V4h8z" />
            </svg>
          </button>

          <button
            onClick={() => onEdit(note)}
            className="p-1.5 rounded-lg text-stone-400 hover:bg-blue-50 hover:text-blue-500 transition-colors"
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

          <button
            onClick={handleDelete}
            className="p-1.5 rounded-lg text-stone-400 hover:bg-red-50 hover:text-red-500 transition-colors"
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

const Modal = ({ isOpen, onClose, onSave, editNote }) => {
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(28,25,23,0.55)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl"
        style={{ animation: "modalIn .22s cubic-bezier(.4,0,.2,1)" }}
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

export default function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(API);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setNotes(Array.isArray(data) ? data : data.notes || []);
    } catch (e) {
      setError(
        "Could not connect to server. Make sure localhost:3000 is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreate = () => {
    setEditNote(null);
    setModalOpen(true);
  };
  const handleEdit = (note) => {
    setEditNote(note);
    setModalOpen(true);
  };

  const handleSave = async ({ title, description }) => {
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("description", description);

      if (editNote) {
        const res = await fetch(`${API}/${editNote._id}`, {
          method: "PATCH",
          body: fd,
        });
        if (!res.ok) throw new Error();
        showToast("Note updated!");
      } else {
        const res = await fetch(API, { method: "POST", body: fd });
        if (!res.ok) throw new Error();
        showToast("Note created!");
      }
      setModalOpen(false);
      fetchNotes();
    } catch {
      showToast("Something went wrong.", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await new Promise((r) => setTimeout(r, 300));
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setNotes((prev) => prev.filter((n) => n._id !== id));
      showToast("Note deleted.");
    } catch {
      showToast("Delete failed.", "error");
    }
  };

  const handlePin = async (note) => {
    try {
      const fd = new FormData();
      fd.append("isPinned", !note.isPinned);
      const res = await fetch(`${API}/${note._id}`, {
        method: "PATCH",
        body: fd,
      });
      if (!res.ok) throw new Error();
      fetchNotes();
      showToast(note.isPinned ? "Unpinned." : "Pinned!");
    } catch {
      showToast("Could not update pin.", "error");
    }
  };

  const filtered = notes.filter(
    (n) =>
      n.title?.toLowerCase().includes(search.toLowerCase()) ||
      n.description?.toLowerCase().includes(search.toLowerCase()),
  );

  const pinned = filtered.filter((n) => n.isPinned);
  const unpinned = filtered.filter((n) => !n.isPinned);

  return (
    <div
      className="min-h-screen bg-[#f5f3ef]"
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#f5f3ef]/80 border-b border-stone-200/70">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center gap-4">
          <div className="flex items-center gap-2.5 mr-auto">
            <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center shadow-md shadow-amber-200">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
              </svg>
            </div>
            <span
              className="text-xl font-bold text-stone-800 tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Notely
            </span>
          </div>

          <div className="relative flex-1 max-w-xs">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 bg-white text-sm text-stone-700 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all"
            />
          </div>

          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 text-white text-sm font-semibold hover:bg-stone-700 transition-colors shadow-lg shadow-stone-900/20"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Note
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-5 py-8">
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div
              className="w-10 h-10 border-3 border-amber-400 border-t-transparent rounded-full animate-spin"
              style={{ borderWidth: 3 }}
            />
            <p className="text-stone-400 text-sm">Loading notes...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
              <svg
                className="w-7 h-7 text-red-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
            <p className="text-stone-600 font-medium">{error}</p>
            <button
              onClick={fetchNotes}
              className="text-sm text-amber-600 font-medium hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && notes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28 gap-4">
            <div className="w-16 h-16 rounded-3xl bg-stone-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-stone-300"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-stone-700 font-semibold">No notes yet</p>
              <p className="text-stone-400 text-sm mt-1">
                Click "New Note" to get started
              </p>
            </div>
            <button
              onClick={handleCreate}
              className="px-5 py-2 rounded-xl bg-amber-400 text-stone-900 text-sm font-semibold hover:bg-amber-300 transition-colors shadow-md shadow-amber-200"
            >
              Create your first note
            </button>
          </div>
        )}

        {!loading && !error && notes.length > 0 && (
          <>
            {filtered.length === 0 && (
              <div className="text-center py-16">
                <p className="text-stone-400 text-sm">
                  No notes match "<strong>{search}</strong>"
                </p>
              </div>
            )}

            {pinned.length > 0 && (
              <section className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <svg
                    className="w-3.5 h-3.5 text-amber-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16 4v6l2 2-2 2v2h-2v4h-2v-4H8v-2l-2-2 2-2V4h8z" />
                  </svg>
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                    Pinned
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pinned.map((note) => (
                    <NoteCard
                      key={note._id}
                      note={note}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onPin={handlePin}
                    />
                  ))}
                </div>
              </section>
            )}

            {unpinned.length > 0 && (
              <section>
                {pinned.length > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                      All Notes
                    </span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {unpinned.map((note) => (
                    <NoteCard
                      key={note._id}
                      note={note}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onPin={handlePin}
                    />
                  ))}
                </div>
              </section>
            )}

            <p className="text-center text-xs text-stone-300 mt-10">
              {notes.length} note{notes.length !== 1 ? "s" : ""}
            </p>
          </>
        )}
      </main>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        editNote={editNote}
      />

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-xl transition-all
            ${
              toast.type === "error"
                ? "bg-red-500 text-white"
                : "bg-stone-900 text-white"
            }`}
          style={{ animation: "toastIn .2s ease" }}
        >
          {toast.msg}
        </div>
      )}

      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}
