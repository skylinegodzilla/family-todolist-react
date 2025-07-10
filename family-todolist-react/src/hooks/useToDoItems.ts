import { useState, useEffect, useCallback } from "react";
import type { ToDoList, ToDoItem, ToDoItemRequestDTO } from "../types/types";

export function useToDoItems(listId: number, initialList: ToDoList | null = null) {
  const [list, setList] = useState<ToDoList | null>(initialList);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all items for the list
  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("sessionToken");
      if (!token) throw new Error("Missing session token");

      const response = await fetch(`/api/todolists/${listId}/items`, {
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch list items");

      const items: ToDoItem[] = await response.json();

      console.log("Fetched items in this order:", items.map(i => i.itemId));  //TODO: Remove debug code

      setList((prev) =>
        prev
          ? { ...prev, items }
          : {
              listId,
              title: "",
              description: "",
              items,
            }
      );

      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Unknown error");
    } finally {
      setLoading(false);
    }
  }, [listId]);

  // Add new item to list
  const addItem = async (item: ToDoItemRequestDTO) => {
    const token = sessionStorage.getItem("sessionToken");
    if (!token) throw new Error("Missing session token");

    const response = await fetch(`/api/todolists/${listId}/items`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });

    if (!response.ok) throw new Error("Failed to add item");

    await fetchItems();
  };

  // Update an existing item
  const updateItem = async (itemId: number, item: ToDoItemRequestDTO) => {
    const token = sessionStorage.getItem("sessionToken");
    if (!token) throw new Error("Missing session token");

    const response = await fetch(`/api/todolists/${listId}/items/${itemId}`, {
      method: "PUT",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });

    if (!response.ok) throw new Error("Failed to update item");

    await fetchItems();
  };

  // Toggle completion
  const toggleItemCompletion = async (itemId: number, completed: boolean) => {
    const item = list?.items.find((i) => i.itemId === itemId);
    if (!item) throw new Error("Item not found");

    await updateItem(itemId, {
      title: item.title,
      description: item.description,
      dueDate: item.dueDate,
      completed,
    });
  };

  // Delete an item
  const deleteItem = async (itemId: number) => {
    const token = sessionStorage.getItem("sessionToken");
    if (!token) throw new Error("Missing session token");

    const response = await fetch(`/api/todolists/${listId}/items/${itemId}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) throw new Error("Failed to delete item");

    await fetchItems();
  };

  // Reorder items
  const reorderItems = async (orderedItemIds: number[]) => {
    const token = sessionStorage.getItem("sessionToken");
    if (!token) throw new Error("Missing session token");

    const response = await fetch(`/api/todolists/${listId}/items/reorder`, {
      method: "PUT",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderedItemIds),
    });

    if (!response.ok) throw new Error("Failed to reorder items");

    await fetchItems();
  };

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    list,
    loading,
    error,
    refresh: fetchItems,
    addItem,
    updateItem,
    toggleItemCompletion,
    deleteItem,
    reorderItems,
  };
}
