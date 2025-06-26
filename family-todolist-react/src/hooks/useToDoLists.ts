import { useEffect, useState } from "react";
import type { ToDoList } from "../types/types";

export function useToDoLists() {
    const [lists, setLists] = useState<ToDoList[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // GET: Fetch all to-do lists from the backend
    const fetchLists = async () => {
        setLoading(true);
        try {
            const sessionToken = sessionStorage.getItem("sessionToken");
            if (!sessionToken) throw new Error("No session token");

            const response = await fetch("/api/todolists", {
                method: "GET",
                headers: {
                    Authorization: sessionToken,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Failed to fetch to-do lists");

            const data: ToDoList[] = await response.json();
            setLists(data);
            setError(null);
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError("Unknown error");
        } finally {
            setLoading(false);
        }
    };

    // POST: Create a new to-do list
    const createList = async (params: { title: string; description: string }) => {
        const { title, description } = params;
        const token = sessionStorage.getItem("sessionToken");
        if (!token) throw new Error("Missing session token");

        const response = await fetch("/api/todolists", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify({ title, description }),
        });

        if (!response.ok) throw new Error("Failed to create list");

        // Refresh the list after creating
        await fetchLists();
    };

    // PUT: Update an exsisting to-do list
    const updateList = async (params: {
        listId: number;
        title: string;
        description: string;
    }) => {
        const { listId, title, description } = params;

        const token = sessionStorage.getItem("sessionToken");
        if (!token) throw new Error("Missing session token");

        const response = await fetch("/api/todolists", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify({
                listId,
                title,
                description,
            }),
        });

        if (!response.ok) throw new Error("Failed to update list");

        await fetchLists(); // refresh UI after update
    };

    // DELETE: Delete a to-do list by ID
    const deleteList = async (listId: number) => {
    const token = sessionStorage.getItem("sessionToken");
    if (!token) throw new Error("Missing session token");

    const response = await fetch(`/api/todolists/${listId}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to delete list");

    const updatedLists: ToDoList[] = await response.json();
    setLists(updatedLists);
  };

    // Fetch lists on component mount
    useEffect(() => {
        fetchLists();
    }, []);

    return {
        lists,
        loading,
        error,
        refresh: fetchLists,
        createList,
        updateList,
        deleteList,
    };
}