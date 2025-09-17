import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "../features/AuthSlice";
import UserSlice from "../features/UserSlice";
import { use } from "react";

export const store = configureStore({
    reducer: {
        auth: AuthSlice,
        users: UserSlice,
    }
})