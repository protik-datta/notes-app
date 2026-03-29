import React, { useState, useEffect } from "react";
import NoteCard from "../components/NoteCard";
import NoteModal from "../components/NoteModal";
import Navbar from "../components/Navbar";
import api from "../services/api";

const Home = ({ user, onLogout }) => {
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
      const { data } = await api.get("/api/notes");
      setNotes(data);
    } catch (e) {
      setError("Could not load notes. Please try again.");
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
      if (editNote) {
        await api.patch(`/api/notes/${editNote._id}`, { title, description });
        showToast("Note updated!");
      } else {
        await api.post("/api/notes", { title, description });
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
      await api.delete(`/api/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      showToast("Note deleted.");
    } catch {
      showToast("Delete failed.", "error");
    }
  };

  const handlePin = async (note) => {
    try {
      await api.patch(`/api/notes/${note._id}`, { isPinned: !note.isPinned });
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
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <Navbar
        search={search}
        setSearch={setSearch}
        handleCreate={handleCreate}
        user={user}
        onLogout={onLogout}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-5 lg:px-6 py-6 sm:py-8">
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24 gap-4">
            <div
              className="w-10 h-10 border-3 border-amber-400 border-t-transparent rounded-full animate-spin"
              style={{ borderWidth: 3 }}
            />
            <p className="text-stone-400 text-sm">Loading your notes...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
              <svg
                className="w-7 h-7 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
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
          <div className="flex flex-col items-center justify-center py-20 sm:py-28 gap-4">
            <div className="w-16 h-16 rounded-3xl bg-stone-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-stone-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
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
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-amber-400 text-stone-900 text-sm font-semibold hover:bg-amber-300 transition-colors shadow-md shadow-amber-200"
            >
              Create your first note
            </button>
          </div>
        )}

        {!loading && !error && notes.length > 0 && (
          <>
            {filtered.length === 0 && (
              <div className="text-center py-12 sm:py-16">
                <p className="text-stone-400 text-sm">
                  No notes match "<strong>{search}</strong>"
                </p>
              </div>
            )}

            {pinned.length > 0 && (
              <section className="mb-6 sm:mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <svg
                    className="w-3.5 h-3.5 text-amber-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16 4v6l2 2-2 2v2h-2v4h-2v-4H8v-2l-2-2 2-2V4h8z" />
                  </svg>
                  <span className="text-[10px] sm:text-xs font-bold text-stone-400 uppercase tracking-widest">
                    Pinned
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
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
                {(pinned.length > 0 || search) && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] sm:text-xs font-bold text-stone-400 uppercase tracking-widest">
                      {search ? "Search results" : "All Notes"}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
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
          </>
        )}
      </main>

      <NoteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        editNote={editNote}
      />

      {toast && (
        <div
          className={`fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-xl transition-all ${
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
};

export default Home;
