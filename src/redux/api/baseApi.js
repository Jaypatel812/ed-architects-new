import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import toast from "react-hot-toast";

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_BASE_URL}/api`,
  prepareHeaders: (headers) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

let isLoggingOut = false;

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (result.error.data?.message === "jwt expired" && !isLoggingOut) {
      isLoggingOut = true;
      const toastId = toast.error("Session expired! Logging out in 3...", {
        duration: 4000,
      });

      let countdown = 2;
      const interval = setInterval(() => {
        if (countdown > 0) {
          toast.error(`Session expired! Logging out in ${countdown}...`, {
            id: toastId,
            duration: 4000,
          });
          countdown--;
        } else {
          clearInterval(interval);
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("user");
          window.location.href = "/ed/admin/login";
        }
      }, 1000);
    }
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});
