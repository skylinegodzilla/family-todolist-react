import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/auth";
import { useToDoLists } from "../../hooks/useToDoLists";
import type { ToDoList } from "../../types/types";
import "./ToDoListsPage.css";

const ToDoListsPage: React.FC = () => {
  // Navigation
  const navigate = useNavigate();
  const { lists, loading, error } = useToDoLists();

  // Fetch user name from the sessionStorage
  const username = sessionStorage.getItem("username")?.replace(/^./, c => c.toUpperCase()) || "User";

  // Logic for loging out
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

return (
  <>
    <div className="todo-header">
      <div className="todo-left">Family To-Do List Project</div>
      <h1 className="todo-title">Your To-Do Lists</h1>
      <button onClick={handleLogout} className="todo-logout-btn">
        Logout {username}
      </button>
    </div>

    <div className="todo-container center-page">
      {loading && <p className="todo-loading">Loading your to-do lists...</p>}
      {error && <p className="todo-error">⚠️ {error}</p>}

      {!loading && !error && (
        <>
          {lists.length === 0 ? (
            <p className="todo-empty">No lists yet. Time to get productive!</p>
          ) : (
            <div className="todo-grid">
              {lists.map((list: ToDoList) => {
                const completed = list.items.filter((item) => item.completed).length;
                return (
                  <div key={list.listId} className="todo-card">
                    <h2 className="todo-card-title">{list.title}</h2>
                    <p className="todo-card-desc">{list.description}</p>
                    <div className="todo-card-meta">
                      ✅ {completed}/{list.items.length} items completed
                    </div>
                    <button
                      className="todo-view-btn"
                      onClick={() => navigate(`/lists/${list.listId}`)}
                    >
                      View Items
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  </>
);
};

export default ToDoListsPage; // allows this to be imported in to other files for things like routing