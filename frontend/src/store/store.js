import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "../features/AuthSlice";
import ProjectSlice from "../features/ProjectsSlice";

export const store = configureStore({
    reducer: {
        auth: AuthSlice,
        projects:ProjectSlice
    }
})