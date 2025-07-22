import { useEffect, useState } from "react";

export function useCurrentUser() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("sessionToken");
    const storedRole = sessionStorage.getItem("role");

    if (!token || !storedRole) {
      setRole(null);
      setLoading(false);
      return;
    }

    setRole(storedRole);
    setLoading(false);
  }, []);

  return { role, loading };
}

