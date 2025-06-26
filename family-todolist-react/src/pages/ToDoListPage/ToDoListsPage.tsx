import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/auth";
import { useToDoLists } from "../../hooks/useToDoLists";
import type { ToDoList } from "../../types/types";
import "./ToDoListsPage.css";

const ToDoListsPage: React.FC = () => {
  // Navigation
  const navigate = useNavigate();
  const { lists, loading, error, createList, updateList } = useToDoLists();

  // Fetch user name from the sessionStorage
  const username =
    sessionStorage.getItem("username")?.replace(/^./, (c) => c.toUpperCase()) || "User";

  // state verables 
  // create list
  const [showForm, setShowForm] = useState(false); // Controls whether the “New List” form is visible.
  const [title, setTitle] = useState(""); // Stores the user’s input for the title of the new to-do list.
  const [description, setDescription] = useState(""); // Stores the user’s input for the optional description of the to-do list.
  const [creating, setCreating] = useState(false); // Tracks whether a request for creating a list is in progress 
  const [createError, setCreateError] = useState<string | null>(null); // Holds any error message from a failed create attempt

  // Edit list
  const [editingListId, setEditingListId] = useState<number | null>(null); // ID of list we’re editing

  // Logic for loging out
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Logic for creating or editing/updating a list
const handleSubmit = async () => {
  if (!title.trim()) return setCreateError("Title is required.");
  setCreating(true);
  setCreateError(null);

  try {
    if (editingListId !== null) {
      await updateList({ listId: editingListId, title, description }); // UPDATE the list
    } else {
      await createList({ title, description }); // CREATE the list
    }

    // Reset form
    setTitle("");
    setDescription("");
    setEditingListId(null);
    setShowForm(false);

  } catch (err: unknown) {
    if (err instanceof Error) {
      setCreateError(err.message);
    } else {
      setCreateError("An unexpected error occurred.");
    }
  } finally {
    setCreating(false);
  }
};

  // Logic for updating a list. 

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
                      <button
                        className="todo-edit-btn"
                        onClick={() => {
                          setTitle(list.title);
                          setDescription(list.description);
                          setEditingListId(list.listId);
                          setShowForm(true);
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <button onClick={() => setShowForm(true)} className="todo-create-btn">
              ➕ New List
            </button>
            
            {showForm && (
              <div className="todo-form">
                <h2>Create a New To-Do List</h2>
                {createError && <p className="todo-error">⚠️ {createError}</p>}

                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={creating}
                />
                <textarea
                  placeholder="Description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={creating}
                />
                <button onClick={handleSubmit} disabled={creating}>
                  {creating ? (editingListId !== null ? "Saving..." : "Creating...") : (editingListId !== null ? "Save Changes" : "Create")}
                </button>
                <button onClick={() => setShowForm(false)} disabled={creating}>
                  Cancel
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ToDoListsPage; // allows this to be imported in to other files for things like routing
