import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLoginSuccess = (email) => {
    setUser({ email });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <Router>
      {/* Global Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap"
        rel="stylesheet"
      />
      
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            user ? <Navigate to="/" replace /> : <Login onLoginSuccess={handleLoginSuccess} />
          }
        />
        <Route
          path="/register"
          element={
            user ? <Navigate to="/" replace /> : <Register onLoginSuccess={handleLoginSuccess} />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
