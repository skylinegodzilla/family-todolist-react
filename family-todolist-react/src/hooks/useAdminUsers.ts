import { useState, useCallback } from "react";
import type {
  AdminUserSummary,
  AdminUserDetail,
  AdminApiMessage,
  AdminPasswordResetResponse,
  UserRole,
} from "../types/types";

// Helper to get the session token from sessionStorage
function getSessionToken(): string | null {
  return sessionStorage.getItem("sessionToken");
}

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [userDetail, setUserDetail] = useState<AdminUserDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper for API calls with Authorization header
  const fetchWithAuth = useCallback(async (input: RequestInfo, init: RequestInit = {}) => {
    const token = getSessionToken();
    if (!token) throw new Error("No session token found.");
    const headers = {
      ...(init.headers || {}),
      "Authorization": token,
      "Content-Type": "application/json",
    };
    const response = await fetch(input, { ...init, headers });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "API error");
    return data;
  }, []);

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data: AdminUserSummary[] = await fetchWithAuth("/api/admin/users");
      setUsers(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);

  // Fetch single user
  const fetchUser = useCallback(async (username: string) => {
    setLoading(true);
    setError(null);
    try {
      const data: AdminUserDetail = await fetchWithAuth(`/api/admin/users/${encodeURIComponent(username)}`);
      setUserDetail(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);

  // Delete user
  const deleteUser = useCallback(async (username: string) => {
    setLoading(true);
    setError(null);
    try {
      const data: AdminApiMessage = await fetchWithAuth(`/api/admin/remove/${encodeURIComponent(username)}`, {
        method: "DELETE",
      });
      await fetchUsers(); // Refresh list after deletion
      return data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        throw err;
      } else {
        setError("An unknown error occurred.");
        throw err;
      }
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth, fetchUsers]);

  // Change user role
  const changeUserRole = useCallback(async (username: string, role: UserRole) => {
    setLoading(true);
    setError(null);
    try {
      const data: AdminApiMessage = await fetchWithAuth(
        `/api/admin/users/${encodeURIComponent(username)}/role`,
        {
          method: "PATCH",
          body: JSON.stringify({ role }),
        }
      );
      await fetchUsers(); // Refresh list after role change
      return data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        throw err;
      } else {
        setError("An unknown error occurred.");
        throw err;
      }
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth, fetchUsers]);

  // Reset user password
  const resetUserPassword = useCallback(async (username: string) => {
    setLoading(true);
    setError(null);
    try {
      const data: AdminPasswordResetResponse = await fetchWithAuth(
        `/api/admin/users/${encodeURIComponent(username)}/reset-password`,
        { method: "POST" }
      );
      return data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        throw err;
      } else {
        setError("An unknown error occurred.");
        throw err;
      }
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);

  return {
    users,
    userDetail,
    loading,
    error,
    fetchUsers,
    fetchUser,
    deleteUser,
    changeUserRole,
    resetUserPassword,
    setError, // For manual error clearing if needed
  };
}