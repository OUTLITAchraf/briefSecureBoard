import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
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

// Fetch Projects
export const fetchProjects = createAsyncThunk(
    'projects/fetchProjects',
    async (_, { rejectWithValue }) => {
        try {
            await csrf();
            const token = Cookies.get("XSRF-TOKEN");
            const response = await api.get('/api/projects', {
                headers: {
                    "X-XSRF-TOKEN": token,
                },
            });
            console.log("Response fetching projects :", response);
            return response.data.projects;
        } catch (error) {
            console.log('Error while fetching projects :', error);

            return rejectWithValue(error.response.data);
        }
    }
);

// Delete Project
export const DeleteProject = createAsyncThunk(
    'projects/DeleteProject',
    async (id, { rejectWithValue }) => {
        try {
            await csrf();
            const token = Cookies.get("XSRF-TOKEN");
            const response = await api.delete(`/api/projects/${id}`, {
                headers: {
                    "X-XSRF-TOKEN": token,
                },
            });
            console.log("Response Deleting project :", response);
            return response.data.projects;
        } catch (error) {
            console.log('Error while Deleting project :', error);

            return rejectWithValue(error.response.data);
        }
    }
);

// Add Project
export const AddProject = createAsyncThunk(
    'projects/AddProject',
    async (data, { rejectWithValue }) => {
        try {
            await csrf();
            const token = Cookies.get("XSRF-TOKEN");
            const response = await api.post(`/api/projects`, data, {
                headers: {
                    "X-XSRF-TOKEN": token,
                },
            });
            console.log("Response Adding project :", response);
            return response.data.projects;
        } catch (error) {
            console.log('Error while Adding project :', error);
            return rejectWithValue(error.response.data);
        }
    }
);

// Fetch Users 
export const fetchUsers = createAsyncThunk(
    'projects/fetchUsers',
    async (_, { rejectWithValue }) => {
        try {
            await csrf();
            const token = Cookies.get("XSRF-TOKEN");
            const response = await api.get('/api/projects/team-members', {
                headers: {
                    "X-XSRF-TOKEN": token,
                },
            });
            console.log("Response fetching users:", response);
            return response.data.users;
        } catch (error) {
            console.log('Error while fetching users:', error);
            return rejectWithValue(error.response.data);
        }
    }
);


// Update Project
export const UpdateProject = createAsyncThunk(
    'projects/UpdateProject',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            await csrf();
            const token = Cookies.get("XSRF-TOKEN");
            const response = await api.put(`/api/projects/${id}`, data, {
                headers: {
                    "X-XSRF-TOKEN": token,
                },
            });
            console.log("Response updating project:", response);
            return response.data.project;
        } catch (error) {
            console.log('Error while updating project:', error);
            return rejectWithValue(error.response.data);
        }
    }
);

const ProjectSlice = createSlice({
    name: 'projects',
    initialState: {
        projects: [],
        users: {
            data: [],
            isLoading: false,
            error: null
        },
        isLoading: false,
        error: null,
        delete: {
            isLoading: false,
            error: null
        },
        add: {
            isLoading: false,
            error: null
        },
        update: {
            isLoading: false,
            error: null
        }
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            //fetch projects
            .addCase(fetchProjects.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.isLoading = false;
                state.projects = action.payload;
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            //delete project
            .addCase(DeleteProject.pending, (state) => {

                state.delete.isLoading = true;
                state.delete.error = null;
            })
            .addCase(DeleteProject.fulfilled, (state, action) => {
                console.log('delete project fullfilled :', action);

                state.delete.isLoading = false;
                const deletedProjectId = action.meta.arg;
                state.projects = state.projects.filter(project => project.id !== deletedProjectId);
            })
            .addCase(DeleteProject.rejected, (state, action) => {
                console.log('delete project rejected :', action);

                state.delete.isLoading = false;
                state.delete.error = action.payload;
            })

            //Add project
            .addCase(AddProject.pending, (state) => {
                state.add.isLoading = true;
                state.add.error = null;
            })
            .addCase(AddProject.fulfilled, (state, action) => {
                console.log('add project fullfilled :', action);
                state.add.isLoading = false;
                state.projects = action.payload;
            })
            .addCase(AddProject.rejected, (state, action) => {
                console.log('delete project rejected :', action);
                state.add.isLoading = false;
                state.add.error = action.payload;
            })

            //Fetch users
            .addCase(fetchUsers.pending, (state) => {
                state.users.isLoading = true;
                state.users.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.users.isLoading = false;
                state.users.data = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.users.isLoading = false;
                state.users.error = action.payload;
            })

            // Update Project
            .addCase(UpdateProject.pending, (state) => {
                state.update.isLoading = true;
                state.update.error = null;
            })
            .addCase(UpdateProject.fulfilled, (state, action) => {
                state.update.isLoading = false;
                state.update.error = null;
                state.projects = action.payload
            })
            .addCase(UpdateProject.rejected, (state, action) => {
                state.update.isLoading = false;
                state.update.error = action.payload;
            });

    },
});

export default ProjectSlice.reducer;