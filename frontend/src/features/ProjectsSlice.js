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

// Redirect to unauthorized page
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      window.location.href = '/unauthorized';
    }
    return Promise.reject(error);
  }
);


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

// fetch statistics
export const fetchDashboardData = createAsyncThunk(
    'dashboard/fetchDashboardData',
    async (_, { rejectWithValue }) => {
        try {

            const token = localStorage.getItem('token');
            const response = await api.get('/api/dashboard', {
                headers: {
                    "X-XSRF-TOKEN": token,
                },
            });
            return response.data.data;
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            return rejectWithValue(error.response.data);
        }
    }
);

// Fetch user Projects
export const fetchUserProjects = createAsyncThunk(
    'projects/fetchUserProjects',
    async (_, { rejectWithValue }) => {
        try {
            await csrf();
            const token = Cookies.get("XSRF-TOKEN");
            const response = await api.get(`/api/user-projects`, {
                headers: {
                    "X-XSRF-TOKEN": token,
                },
            });
            console.log('Response fetch user projects :', response);

            return response.data;
        } catch (error) {
            console.log('error  fetch user projects :', error);
            return rejectWithValue(error.response.data);
        }
    }
);

//Fetch user Tasks
export const fetchUserTasks = createAsyncThunk(
    'tasks/fetchUserTasks',
    async (_, { rejectWithValue }) => {
        try {
            await csrf();
            const token = Cookies.get("XSRF-TOKEN");
            const response = await api.get(`/api/user-tasks`, {
                headers: {
                    "X-XSRF-TOKEN": token,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


//Edit user's task status
export const updateTaskStatus = createAsyncThunk(
    'tasks/updateTaskStatus',
    async ({ taskId, newStatus }, { rejectWithValue }) => {
        try {
            await csrf();
            const token = Cookies.get("XSRF-TOKEN");
            const response = await api.patch(`/api/tasks/${taskId}/status`,
                { status: newStatus },
                {
                    headers: {
                        "X-XSRF-TOKEN": token,
                    },
                });

            console.log('Response edit status :', response);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// fetch user dashboard data
export const fetchUserDashboardData = createAsyncThunk(
    'userDashboard/fetchUserDashboardData',
    async (_, { rejectWithValue }) => {
        try {
            await csrf();
            const token = Cookies.get("XSRF-TOKEN");
            const response = await api.get('/api/user-dashboard', {
                headers: {
                    "X-XSRF-TOKEN": token,
                },
            });
            console.log("Response fetch user statistic :", response);

            return response.data.data;
        } catch (error) {
            console.log('fetch statistics user :', error);

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
        },
        statistics: {
            data: null,
            isLoading: false,
            error: null,
        },
        userProjects: {
            data: [],
            isLoading: false,
            error: null
        },
        userTasks: {
            test: "helloooo",
            data: [],
            isLoading: false,
            error: null,
        },
        updateStatus: {
            isLoading: false,
            error: null
        },
        userDashboard: {
            data: null,
            isLoading: false,
            error: null,
        },

    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            //fetch statistic fetch user dashboard
            .addCase(fetchUserDashboardData.pending, (state) => {
                state.userDashboard.isLoading = true;
                state.userDashboard.error = null;
            })
            .addCase(fetchUserDashboardData.fulfilled, (state, action) => {
                state.userDashboard.isLoading = false;
                state.userDashboard.data = action.payload;
            })
            .addCase(fetchUserDashboardData.rejected, (state, action) => {
                state.userDashboard.isLoading = false;
                state.userDashboard.error = action.payload;
            })

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
            })

            // Fetch statistics
            .addCase(fetchDashboardData.pending, (state) => {
                console.log('manager fetch data statistics pending:');

                state.statistics.isLoading = true;
                state.statistics.error = null;
            })
            .addCase(fetchDashboardData.fulfilled, (state, action) => {
                console.log('manager fetch data statistics fulfielled:', action);
                state.statistics.isLoading = false;
                state.statistics.data = action.payload;
            })
            .addCase(fetchDashboardData.rejected, (state, action) => {
                console.log('manager fetch data statistics rejected:', action);
                state.statistics.isLoading = false;
                state.statistics.error = action.payload;
            })


            // Handle fetchUserProjects
            .addCase(fetchUserProjects.pending, (state) => {
                console.log('fetch user projects pending');

                state.userProjects.isLoading = true;
                state.userProjects.error = null;
            })
            .addCase(fetchUserProjects.fulfilled, (state, action) => {
                console.log('fetch user projects fulfilled', action);

                state.userProjects.isLoading = false;
                state.userProjects.data = action.payload.data;
            })
            .addCase(fetchUserProjects.rejected, (state, action) => {
                console.log('fetch user projects rejevted', action);

                state.userProjects.isLoading = false;
                state.userProjects.error = action.payload;
            })

            // Handle fetchUserTasks
            .addCase(fetchUserTasks.pending, (state) => {
                console.log('fetch user tasks Pending ');

                state.userTasks.isLoading = true;
                state.userTasks.error = null;
            })
            .addCase(fetchUserTasks.fulfilled, (state, action) => {
                console.log('fetch user tasks Fulfilled : ', action);

                state.userTasks.isLoading = false;
                state.userTasks.data = action.payload.data;
            })
            .addCase(fetchUserTasks.rejected, (state, action) => {
                console.log('fetch user tasks Rejected : ', action);

                state.userTasks.isLoading = false;
                state.userTasks.error = action.payload;
            })


            // Handle updateTaskStatus
            .addCase(updateTaskStatus.pending, (state) => {
                console.log('Edit user tasks status Pending ');
                state.updateStatus.isLoading = true;
                state.updateStatus.error = null;
            })
            .addCase(updateTaskStatus.fulfilled, (state, action) => {
                console.log('Edit user tasks status Fulfilled :', action);
                state.updateStatus.isLoading = false;
                state.updateStatus.error = null;
                const updatedTask = action.payload;
                const index = state.userTasks.data.findIndex(task => task.id === updatedTask.id);
                if (index !== -1) {
                    state.userTasks.data[index].status = updatedTask.status;
                }
            })
            .addCase(updateTaskStatus.rejected, (state, action) => {
                console.log('Edit user tasks status Rejected :', action);
                state.updateStatus.isLoading = false;
                state.updateStatus.error = action.payload;
            })





    },
});

export default ProjectSlice.reducer;