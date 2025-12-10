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

    const checkSuperAdmin = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_API_BASE_URL}/setup/check-super-admin`
        );

        const superAdminExists = res.data.super_admin_exists;
        setExists(superAdminExists);

        // Cache the result if super admin exists
        if (superAdminExists) {
          localStorage.setItem("system_initialized", "true");
        }
      } catch (error) {
        console.error("❌ Error checking super admin:", error.message);
        setExists(false);
      } finally {
        setLoading(false);
      }
    };

    checkSuperAdmin();
  }, []);

  return { loading, exists, setExists};
};
