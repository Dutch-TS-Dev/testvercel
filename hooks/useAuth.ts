import { useState } from "react";

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(""); // Clear previous errors
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user); // Set user data
      } else {
        setError(data.error || "Login failed. Please check your email or password."); // Set error message
        setUser(null); // Clear user data
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again later."); // Set error message
      setUser(null); // Clear user data
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, age: number) => {
    setLoading(true);
    setError(""); // Clear previous errors
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password, name, age }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user); // Set user data
      } else {
        setError(data.error || "Registration failed. Please try again later."); // Set error message
        setUser(null); // Clear user data
      }
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again later."); // Set error message
      setUser(null); // Clear user data
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null); // Clear user data
      setError(""); // Clear error message
    } catch (err: any) {
      setError(err.message || "Logout failed. Please try again later."); // Set error message
    } finally {
      setLoading(false);
    }
  };

  return { user, error, loading, login, register, logout };
};