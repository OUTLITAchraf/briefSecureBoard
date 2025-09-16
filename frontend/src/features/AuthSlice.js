import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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

//login
export const userLogin = createAsyncThunk('auth/userLogin', async (data, { rejectWithValue }) => {
    try {
        await csrf();
        // const xsrfToken = Cookies.get('XSRF-TOKEN');
        // console.log('token', xsrfToken);
        const token = Cookies.get("XSRF-TOKEN");

        let response = await api.post('/api/login', data, {
            headers: {
                "X-XSRF-TOKEN": token,
            },
        });

        console.log('Login response :', response);

    } catch (error) {
        console.log('Error white login the user :', error.response.data.message);
        return rejectWithValue(error.response.data.message)

    }
})

// register
export const userRegister = createAsyncThunk('auth/userRegister', async (data, { rejectWithValue }) => {
    try {
        await csrf();
        const token = Cookies.get("XSRF-TOKEN");
        let response = await api.post('/api/register', data, {
            headers: {
                "X-XSRF-TOKEN": token,
            },
        })

        console.log('Response :', response);

    }
    catch (error) {
        console.log('Error while registering new user :', error);
        return rejectWithValue(error.response.data.message)
    }
})

//fetch user

export const fetchUser = createAsyncThunk(
    'auth/fetchUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/api/user');
            console.log("fetch user respons :", response);

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Cannot fetch user');
        }
    }
);


//logout 

export const logout = createAsyncThunk('auth/logout', async (data, { rejectWithValue }) => {
    try {
        await csrf();
        // const xsrfToken = Cookies.get('XSRF-TOKEN');
        // console.log('token', xsrfToken);
        const token = Cookies.get("XSRF-TOKEN");

        let response = await api.post('/api/logout', data, {
            headers: {
                "X-XSRF-TOKEN": token,
            },
        });

        console.log('Login response :', response);

    } catch (error) {
        console.log('Error white login the user :', error.response.data.message);
        return rejectWithValue(error.response.data.message)

    }
})

// update profile
export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (data, { rejectWithValue }) => {
        try {
            await csrf();
            const token = Cookies.get("XSRF-TOKEN");

            const response = await api.put('/api/profile', data, {
                headers: {
                    "X-XSRF-TOKEN": token,
                },
            });

            console.log('Update profile response:', response);

            return response.data.user; // return updated user
        } catch (error) {
            console.log('Error while updating profile:', error);
            return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
        }
    }
);



const AuthSlice = createSlice({
    name: "name",
    initialState: {
        test: "hicham",
        user: null,
        register: {
            isLoading: false,
            error: null
        },
        login: {
            isLoading: false,
            error: null
        },
        logout: {
            isLoading: false,
            error: null
        },
        update: {              // 👈 new
            isLoading: false,
            error: null
        }
    },
    reducers: {},
    extraReducers: (builder) => {

        // LOGIN
        builder.addCase(userLogin.pending, (state, action) => {
            console.log('login pending :', action);

            state.login.isLoading = true;
            state.login.error = null;
        });
        builder.addCase(userLogin.fulfilled, (state, action) => {
            console.log('login fufilled :', action);
            state.login.isLoading = false;
            // state.user = action.payload;
        });
        builder.addCase(userLogin.rejected, (state, action) => {
            console.log('login rjected :', action);
            state.login.isLoading = false;
            state.login.error = action.payload;
        });



        // Register
        builder.addCase(userRegister.pending, (state, action) => {
            console.log('register pending :', action);

            state.register.isLoading = true;
            state.register.error = null;
        });
        builder.addCase(userRegister.fulfilled, (state, action) => {
            console.log('register fufilled :', action);
            state.register.isLoading = false;
            // state.user = action.payload;
        });
        builder.addCase(userRegister.rejected, (state, action) => {
            console.log('register rjected :', action);
            state.register.isLoading = false;
            state.register.error = action.payload;
        });

        // Fetch user
        builder.addCase(fetchUser.fulfilled, (state, action) => {
            console.log("fetch user fulfilled :", action.payload);

            state.user = action.payload;
        });
        builder.addCase(fetchUser.rejected, (state, action) => {
            state.user = null;
        });

        // LOGOUT
        builder.addCase(logout.pending, (state, action) => {
            console.log('logout pending :', action);

            state.logout.isLoading = true;
            state.logout.error = null;
        });
        builder.addCase(logout.fulfilled, (state, action) => {
            console.log('logout fufilled :', action);
            state.logout.isLoading = false;
            // state.user = action.payload;
        });
        builder.addCase(logout.rejected, (state, action) => {
            console.log('logout rjected :', action);
            state.logout.isLoading = false;
            state.logout.error = action.payload;
        });

        // UPDATE PROFILE
        builder.addCase(updateProfile.pending, (state) => {
            state.update.isLoading = true;
            state.update.error = null;
        });
        builder.addCase(updateProfile.fulfilled, (state, action) => {
            state.update.isLoading = false;
            state.user = action.payload; // updated user
        });
        builder.addCase(updateProfile.rejected, (state, action) => {
            state.update.isLoading = false;
            state.update.error = action.payload;
        });
    }

})


export default AuthSlice.reducer;
