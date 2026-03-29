import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ search, setSearch, handleCreate, user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#f5f3ef]/80 border-b border-stone-200/70">
      <div className="max-w-5xl mx-auto px-5 py-4 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2.5 mr-auto">
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
        </Link>

        {user && (
          <>
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

            <button
              onClick={handleLogoutClick}
              className="p-2 rounded-xl text-stone-400 hover:bg-stone-100 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
