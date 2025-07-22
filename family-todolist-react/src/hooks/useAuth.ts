import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useAuth() {
  const navigate = useNavigate();

  // State for login
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // State for register
  const [registerError, setRegisterError] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);

  // Login function
  async function login(username: string, password: string) {
    setLoginError("");
    setLoginLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error("Login failed");

      const data = await res.json();

      sessionStorage.setItem("sessionToken", data.token);
      sessionStorage.setItem("username", username);
      sessionStorage.setItem("role", data.role);

      navigate("/lists");
    } catch (err: unknown) {
      if (err instanceof Error) setLoginError(err.message);
      else setLoginError("Unknown error occurred");
    } finally {
      setLoginLoading(false);
    }
  }

  // Register function (auto-login on success)
  async function register(username: string, email: string, password: string) {
    setRegisterError("");
    setRegisterLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || "Registration failed");
      }

      const data = await res.json();

      sessionStorage.setItem("sessionToken", data.token);
      sessionStorage.setItem("username", username);
      sessionStorage.setItem("role", "user"); // Adjust if API returns role

      navigate("/lists");
    } catch (err: unknown) {
      if (err instanceof Error) setRegisterError(err.message);
      else setRegisterError("Unknown error occurred");
    } finally {
      setRegisterLoading(false);
    }
  }

  return {
    login,
    loginError,
    loginLoading,
    register,
    registerError,
    registerLoading,
  };
}