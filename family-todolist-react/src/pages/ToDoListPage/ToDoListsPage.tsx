import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToDoLists } from "../../hooks/useToDoLists";
import type { ToDoList } from "../../types/types";
import Header from "../../components/Header";

import "./ToDoListsPage.css";

const ToDoListsPage: React.FC = () => {

  
  // Navigation
  const navigate = useNavigate();
  const { lists, loading, error, createList, updateList, deleteList } = useToDoLists();

  const storedRole = sessionStorage.getItem("role")?.replace(/^./, c => c.toUpperCase());

  // state verables 
  // create list
  const [showForm, setShowForm] = useState(false); // Controls whether the “New List” form is visible.
  const [title, setTitle] = useState(""); // Stores the user’s input for the title of the new to-do list.
  const [description, setDescription] = useState(""); // Stores the user’s input for the optional description of the to-do list.
  const [creating, setCreating] = useState(false); // Tracks whether a request for creating a list is in progress 
  const [createError, setCreateError] = useState<string | null>(null); // Holds any error message from a failed create attempt

  // Edit list
  const [editingListId, setEditingListId] = useState<number | null>(null); // ID of list we’re editing


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
      <Header title="Your To-Do Lists" />
      <div> Wee {storedRole}</div>
      <div className="todo-container">
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
                      <div className="todo-card-actions">
                        <button
                          className="defaultPrimaryButton"
                          onClick={() => navigate(`/lists/${list.listId}`, { state: { list } })}
                        >
                          View Items
                        </button>
                        <button
                          className="defaultSecondaryButton"
                          onClick={() => {
                            setTitle(list.title);
                            setDescription(list.description);
                            setEditingListId(list.listId);
                            setShowForm(true);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          className="defaultNoButton"
                          onClick={async () => {
                            const confirmed = window.confirm(`Are you sure you want to delete "${list.title}"? This action cannot be undone.`); // Popup window
                            if (!confirmed) return;
                            try {
                              await deleteList(list.listId);
                            } catch (error) {
                              alert(error instanceof Error ? error.message : "Failed to delete list");
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <button onClick={() => setShowForm(true)} className="todo-create-btn defaultPrimaryButton ">
              ➕ New List
            </button>
            
            {showForm && (
              <div 
                className="todo-modal-overlay"
                onClick={() => !creating && setShowForm(false)} // close when clicking outside form
              >
                <div
                  className="todo-modal-form"
                  onClick={e => e.stopPropagation()} // prevent closing when clicking inside form
                >
                  <h2>{editingListId !== null ? "Edit To-Do List" : "Create a New To-Do List"}</h2>
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

                  <div className="todo-modal-buttons">
                    <button className="defaultPrimaryButton" 
                      onClick={handleSubmit} disabled={creating}>
                      {creating ? (editingListId !== null ? "Saving..." : "Creating...") : (editingListId !== null ? "Save Changes" : "Create")}
                    </button>

                    <button className="defaultNoButton"
                      onClick={() => !creating && setShowForm(false)} disabled={creating}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ToDoListsPage; // allows this to be imported in to other files for things like routing
