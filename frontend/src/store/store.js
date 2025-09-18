import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "../features/AuthSlice";
import ProjectSlice from "../features/ProjectsSlice";
import UserSlice from "../features/UserSlice";

export const store = configureStore({
    reducer: {
        auth: AuthSlice,
        projects:ProjectSlice,
        users: UserSlice,
    }
})