import { configureStore } from "@reduxjs/toolkit";

import { baseApi } from "./api/baseApi";
import { edApi } from "./api/edApi";
import { authApi } from "./api/authApi";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [edApi.reducerPath]: edApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});
