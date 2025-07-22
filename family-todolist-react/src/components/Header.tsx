// src/components/Header.tsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.css";
import { logout } from "../services/auth";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/lists";

  const username =
    sessionStorage.getItem("username")?.replace(/^./, c => c.toUpperCase()) || "User";
    
    const storedRole = sessionStorage.getItem("role");
  const isAdmin = storedRole === "ADMIN";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="todo-header">
      <div className="todo-left">Family To-Do List Project</div>
      <h1 className="todo-title">{title}</h1>
      <div className="todo-header-actions">
        {!isHome && (
          <button onClick={() => navigate("/lists")} className="defaultSecondaryButton">
            ← Back
          </button>
        )}
        {isAdmin && (
          <button onClick={() => navigate("/admin")} className="defaultSecondaryButton">
            Admin Panel
          </button>
        )}
        <button onClick={handleLogout} className="logoutButton">
          Logout {username}
        </button>
      </div>
    </div>
  );
};

export default Header;
