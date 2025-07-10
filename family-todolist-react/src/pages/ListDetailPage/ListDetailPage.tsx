import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useToDoItems } from "../../hooks/useToDoItems";
import type { ToDoList, ToDoItem } from "../../types/types";
import "./ListDetailPage.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";

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
    reorderItems,
  } = useToDoItems(numericListId, passedList ?? null);

  const initialOrderRef = useRef<number[]>([]);

useEffect(() => {
  if (list?.items) {
    initialOrderRef.current = list.items.map(item => item.itemId);
  }
}, [list]);

  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  if (!passedList && !list) {
    return (
      <div className="todo-container">
        <p className="todo-error">⚠️ No list data available.</p>
        <button onClick={() => navigate("/lists")} className="logoutButton">← Back</button>
      </div>
    );
  }

  const heading = list?.title ?? passedList?.title ?? "To-Do List";

  const handleAddItem = async () => {
    if (!newTitle.trim()) return setCreateError("Title is required");
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
      await refresh();
    } catch {
      setCreateError("Failed to add item");
    } finally {
      setCreating(false);
    }
  };

  const isOverdue = (item: ToDoItem) => !item.completed && new Date(item.dueDate) < new Date();

  const itemsToRender: ToDoItem[] = initialOrderRef.current.length
    ? initialOrderRef.current
        .map(id => list?.items.find(item => item.itemId === id))
        .filter((it): it is ToDoItem => Boolean(it))
    : list?.items ?? [];

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const newOrder = Array.from(itemsToRender);
    const [moved] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, moved);

    initialOrderRef.current = newOrder.map(item => item.itemId);

    try {
      await reorderItems(initialOrderRef.current);
      await refresh();
    } catch (error) {
      // Optional: show error feedback or revert changes
      console.error("Failed to reorder items:", error);
    }
  };

  return (
    <>
      <div className="todo-header">
        <div className="todo-left">Family To-Do List Project</div>
        <h1 className="todo-title">{heading}</h1>
        <div className="todo-header-actions">
          <button onClick={refresh} className="defaultSecondaryButton">🔄 Refresh</button>
          <button onClick={() => navigate("/lists")} className="logoutButton">← Back</button>
        </div>
      </div>

      <div className="todo-container">
        {loading && <p className="todo-loading">Loading items...</p>}
        {error && <p className="todo-error">⚠️ {error}</p>}

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="todo-items">
            {(provided) => (
              <ul className="todo-item-list" {...provided.droppableProps} ref={provided.innerRef}>
                {itemsToRender.map((item, index) => (
                  <Draggable key={item.itemId} draggableId={String(item.itemId)} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`todo-item-card ${item.completed ? 'todo-item-completed' : ''} ${isOverdue(item) ? 'todo-item-overdue' : ''}`}
                      >
                        <div className="drag-handle" aria-label="Drag handle" title="Drag to reorder">≡</div>
                        <div className="todo-item-left">
                          <label className="todo-item-checkbox-wrapper">
                            <input
                              type="checkbox"
                              checked={item.completed}
                              onChange={() => toggleItemCompletion(item.itemId, !item.completed)}
                              className="todo-item-checkbox"
                            />
                            <span className="custom-checkbox" />
                          </label>
                          {item.completed && <span className="todo-item-badge-vertical">Done</span>}
                          <div>
                            <h3 className="todo-item-title">{item.title}</h3>
                            <p className="todo-item-desc">{item.description}</p>
                            <p className="todo-item-meta">Due: {new Date(item.dueDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="todo-item-actions">
                          <button className="defaultNoButton" onClick={async () => {
                            if (window.confirm(`Delete "${item.title}"?`)) {
                              await deleteItem(item.itemId);
                              await refresh();
                            }
                          }}>
                            Delete
                          </button>
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>

        <button onClick={() => setShowForm(true)} className="todo-create-btn defaultPrimaryButton">➕ New Item</button>

        {showForm && (
          <div className="todo-modal-overlay" onClick={() => !creating && setShowForm(false)}>
            <div className="todo-modal-form" onClick={e => e.stopPropagation()}>
              <h2>Create a New Item</h2>
              {createError && <p className="todo-error">⚠️ {createError}</p>}

              <input type="text" placeholder="Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} disabled={creating} />
              <textarea placeholder="Description (optional)" value={newDescription} onChange={e => setNewDescription(e.target.value)} disabled={creating} />
              <input type="date" value={newDueDate} onChange={e => setNewDueDate(e.target.value)} disabled={creating} />

              <div className="todo-modal-buttons">
                <button className="defaultPrimaryButton" onClick={handleAddItem} disabled={creating}>{creating ? 'Adding...' : 'Add Item'}</button>
                <button className="defaultNoButton" onClick={() => !creating && setShowForm(false)} disabled={creating}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ListDetailPage;
