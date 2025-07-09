import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useToDoItems } from "../../hooks/useToDoItems";
import type { ToDoList } from "../../types/types";
import "./ListDetailPage.css";

const ListDetailPage: React.FC = () => {
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const passedList = location.state?.list as ToDoList | undefined;
  const numericListId = Number(listId);

  const {
    list,
    loading,
    error,
    refresh,
    toggleItemCompletion,
    deleteItem,
    addItem,
  } = useToDoItems(numericListId);

  // New item modal state
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  if (!passedList && !list) {
    return (
      <div className="todo-container">
        <p className="todo-error">⚠️ No list data available. Please return to the dashboard.</p>
        <button onClick={() => navigate("/lists")} className="logoutButton">
          ← Back
        </button>
      </div>
    );
  }

  console.log("✅ Loaded list object in detail page:", list);

  const handleAddItem = async () => {
    if (!newTitle.trim()) return setCreateError("Title is required.");
    setCreating(true);
    setCreateError(null);

    try {
      await addItem({
        title: newTitle,
        description: newDescription,
        completed: false,
        dueDate: newDueDate || new Date().toISOString(),
      });

      setNewTitle("");
      setNewDescription("");
      setNewDueDate("");
      setShowForm(false);
    } catch (err: unknown) {
      setCreateError(err instanceof Error ? err.message : "Failed to add item.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <div className="todo-header">
        <div className="todo-left">Viewing List</div>
        <h1 className="todo-title">{list?.title ?? passedList?.title ?? "To-Do List"}</h1>
        <div className="todo-header-actions">
          <button onClick={refresh} className="defaultSecondaryButton">🔄 Refresh</button>
          <button onClick={() => navigate("/lists")} className="logoutButton">← Back</button>
        </div>
      </div>

      <div className="todo-container">
        {loading && <p className="todo-loading">Loading list items...</p>}
        {error && <p className="todo-error">⚠️ {error}</p>}

        {!loading && list?.items?.length === 0 && (
          <p className="todo-empty">No items in this list yet.</p>
        )}

        <ul className="todo-item-list">
          {list?.items?.map((item) => {
            console.log("📦 Rendering item:", item);

            return (
              <li key={item.itemId} className="todo-item-card">
                <div className="todo-item-left">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleItemCompletion(item.itemId, !item.completed)}
                    className="todo-item-checkbox"
                  />
                  <div>
                    <h3 className="todo-item-title">{item.title || "(No Title)"}</h3>
                    <p className="todo-item-desc">{item.description || "(No Description)"}</p>
                    <p className="todo-item-meta">
                      Due: {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="todo-item-actions">
                  <button
                    className="defaultNoButton"
                    onClick={async () => {
                      const confirmed = window.confirm(`Delete "${item.title}"?`);
                      if (confirmed) await deleteItem(item.itemId);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <button onClick={() => setShowForm(true)} className="todo-create-btn defaultPrimaryButton">
        ➕ New Item
      </button>

      {showForm && (
        <div className="todo-modal-overlay" onClick={() => !creating && setShowForm(false)}>
          <div className="todo-modal-form" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Item</h2>
            {createError && <p className="todo-error">⚠️ {createError}</p>}

            <input
              type="text"
              placeholder="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              disabled={creating}
            />
            <textarea
              placeholder="Description (optional)"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              disabled={creating}
            />
            <input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              disabled={creating}
            />

            <div className="todo-modal-buttons">
              <button className="defaultPrimaryButton" onClick={handleAddItem} disabled={creating}>
                {creating ? "Creating..." : "Add"}
              </button>
              <button
                className="defaultNoButton"
                onClick={() => !creating && setShowForm(false)}
                disabled={creating}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ListDetailPage;
