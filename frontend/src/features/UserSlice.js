import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from 'js-cookie';

const api = axios.create({
    withCredentials: true,
    baseURL: 'http://localhost:8000',

});

const csrf = async () => {
    try {
        return await api.get('/sanctum/csrf-cookie');
    } catch (error) {
        console.log('Error while getting the csrf token : ', error);

    }
}
// Fetch all users
export const fetchUsers = createAsyncThunk(
    "users/fetchUsers",
    async (_, { rejectWithValue }) => {
        try {
            let response = await api.get('/api/users');
            return response.data.users;
        } catch (error) {
            console.log('Error while fetching users :', error);
            return rejectWithValue(error.response?.data?.message || "Cannot fetch users");
        }
    }
);

export const createUser = createAsyncThunk(
    "users/createUser",
    async (data, { rejectWithValue }) => {
        try {
            await csrf();
            const token = Cookies.get("XSRF-TOKEN");
            const response = await api.post("/api/users", data,{
                headers:{
                    "X-XSRF-TOKEN": token,
                }
            });
            return response.data.user; // return created user
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Cannot create user");
        }
    }
);

const userSlice = createSlice({
    name: "users",
    initialState: {
        list: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                console.log("Fetching users...");
                state.isLoading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                console.log("Users fetched successfully:", action.payload);
                state.list = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                console.log("Error fetching users:", action.payload);
                state.error = action.payload;
                state.isLoading = false;
            });

        // create user
        builder
            .addCase(createUser.pending, (state) => {
                console.log("Creating user...");
                state.isLoading = true;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                console.log("User created successfully:", action.payload);
                state.list.push(action.payload); // add new user to state
                state.isLoading = false;
            })
            .addCase(createUser.rejected, (state, action) => {
                console.log("Error creating user:", action.payload);
                state.error = action.payload;
                state.isLoading = false;
            });
    },
});

export default userSlice.reducer;
