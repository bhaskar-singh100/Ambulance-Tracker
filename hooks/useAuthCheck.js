import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiUrls, apiBaseUrl } from "@/apis/urls";
import axios from "axios";

export default function useAuthCheck({
  redirectOnUnauthenticated = true,
} = {}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      const token =
        typeof window !== "undefined"
          ? sessionStorage.getItem("access_token")
          : null;

      if (!token) {
        setIsLoggedIn(false);
        if (redirectOnUnauthenticated) {
          console.log("No token found, redirecting to login");
          router.push("/login");
        }
        return;
      }

      try {
        const response = await axios.get(
          `${apiBaseUrl}${apiUrls.authentication}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200 && response.data.user) {
          setIsLoggedIn(true);
          setUserName(response.data.user.name || "User");
          console.log("User is authenticated", response.data);
        } else {
          throw new Error("Invalid response");
        }
      } catch (error) {
        console.error("Authentication error:", {
          message: error.message,
          status: error.response ? error.response.status : null,
          response: error.response ? error.response.data : null,
        });
        setIsLoggedIn(false);
        sessionStorage.removeItem("access_token");
        if (redirectOnUnauthenticated) {
          router.push("/login");
        }
      }
    };

    verifyAuth();
  }, [router, redirectOnUnauthenticated]);

  return { isLoggedIn, userName };
}
