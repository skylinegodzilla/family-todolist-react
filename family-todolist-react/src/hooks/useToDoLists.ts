import { useEffect, useState } from "react";
import type { ToDoList } from "../types/types";

export function useToDoLists() {
  const [lists, setLists] = useState<ToDoList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const sessionToken = sessionStorage.getItem("sessionToken");
        if (!sessionToken) throw new Error("No session token");

        const response = await fetch("/api/todolists", {
          headers: {
            Authorization: sessionToken, // no 'Bearer '
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch to-do lists");

        const data: ToDoList[] = await response.json();
        setLists(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, []);

  return { lists, loading, error };
}