import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "../features/AuthSlice";
import ProjectSlice from "../features/ProjectsSlice";
import UserSlice from "../features/UserSlice";
import tasksReducer from "../features/TasksSlice";

export const store = configureStore({
    reducer: {
        auth: AuthSlice,
        projects:ProjectSlice,
        tasks: tasksReducer,
        users: UserSlice,
    }
})