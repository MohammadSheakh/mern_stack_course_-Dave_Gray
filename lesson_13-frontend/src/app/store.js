import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
// apiSlice jehetu create korsi .. sheta ke niye ashlam ...
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "../features/auth/authSlice";

// create a store ..
export const store = configureStore({
    // empty reducer er jaygay amra API slice ke refer korbo ..
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer, // dynamically
        auth: authReducer,
    },
    // and middleware o provide korbo ..
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: false, // amra devtools use korte chai ..
});

setupListeners(store.dispatch);
