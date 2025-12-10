import { useEffect, useState } from "react";
import axios from "axios";

export const useSuperAdminCheck = () => {
  const [loading, setLoading] = useState(true);
  const [exists, setExists] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem("system_initialized");

    // If system already initialized, skip API check
    if (cached === "true") {
      setExists(true);
      setLoading(false);
      return;
    }

    // Otherwise, check from backend once
    const check = async () => {
      try {
        const res = await axios.get("/api/setup/check-super-admin");
        const superAdminExists = res.data.super_admin_exists;

        setExists(superAdminExists);
        // Cache the result so next visit doesn’t recheck
        if (superAdminExists) localStorage.setItem("system_initialized", "true");
      } catch (error) {
        console.error("Error checking super admin:", error.message);
      } finally {
        setLoading(false);
      }
    };

    check();
  }, []);

  return { loading, exists };
};
