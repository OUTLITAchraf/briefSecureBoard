import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
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


// fetch all tasks for the manager
export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async (_, { rejectWithValue }) => {
        try {
            await csrf();
            const token = Cookies.get("XSRF-TOKEN");
            const response = await api.get('/api/tasks', {
                headers: {
                    "X-XSRF-TOKEN": token,
                },
            });
            console.log('Response fetch tasks :', response);

            return response.data.tasks;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


// add task
export const AddTask = createAsyncThunk(
    'tasks/addTask',
    async (taskData, { rejectWithValue }) => {
        try {
            await csrf();
            const token = Cookies.get("XSRF-TOKEN");
            const response = await api.post('/api/tasks', taskData, {
                headers: {
                    "X-XSRF-TOKEN": token,
                },
            });
            console.log("Response adding task:", response);
            return response.data.task;
        } catch (error) {
            console.log('Error while adding task:', error);
            return rejectWithValue(error.response.data);
        }
    }
);

// delete a task
export const DeleteTasks = createAsyncThunk(
    'tasks/DeleteTasks',
    async (taskId, { rejectWithValue }) => {
        try {
            await csrf();
            const token = Cookies.get("XSRF-TOKEN");
            const response = await api.delete(`/api/tasks/${taskId}`, {
                headers: {
                    "X-XSRF-TOKEN": token,
                },
            });
            console.log('REsponse delete task :', response);

            return taskId;
        } catch (error) {
            console.log('Error while deleting task:', error);
            return rejectWithValue(error.response.data);
        }
    }
);


export const UpdateTask = createAsyncThunk(
    'tasks/updateTask',
    async ({ id, ...updatedData }, { rejectWithValue }) => {
        try {
            await csrf();
            const token = Cookies.get("XSRF-TOKEN");
            const response = await api.put(`/api/tasks/${id}`, updatedData, {
                headers: {
                    "X-XSRF-TOKEN": token,
                },
            });
            return response.data.task; // Return the updated task
        } catch (error) {
            console.log('Error while updating task:', error);
            return rejectWithValue(error.response.data);
        }
    }
);


const TasksSlice = createSlice({
    name: 'tasks',
    initialState: {
        tasks: [],
        isLoading: false,
        error: null,
        add: {
            isLoading: false,
            error: null,
        },
        isDeleting: false,
        update: {
            isLoading: false,
            error: null,
        }
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handle fetching tasks
            .addCase(fetchTasks.pending, (state) => {
                console.log("fetch tasks pending");

                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                console.log("fetch tasks fulfilled :", action);

                state.isLoading = false;
                state.tasks = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                console.log("fetch tasks rejected :", action);

                state.isLoading = false;
                state.error = action.payload || { message: 'Failed to fetch tasks.' };
            })

            // Handle adding a task
            .addCase(AddTask.pending, (state) => {
                console.log("add tasks pending");

                state.add.isLoading = true;
                state.add.error = null;
            })
            .addCase(AddTask.fulfilled, (state, action) => {
                console.log("add tasks fulfilled :", action);

                state.add.isLoading = false;
                state.tasks.push(action.payload);
            })
            .addCase(AddTask.rejected, (state, action) => {
                console.log("add tasks rejected :", action);

                state.add.isLoading = false;
                state.add.error = action.payload || { message: 'Failed to add task.' };
            })

            // Handle deleting a task
            .addCase(DeleteTasks.pending, (state) => {
                state.isDeleting = true;
            })
            .addCase(DeleteTasks.fulfilled, (state, action) => {
                state.isDeleting = false;
                // Remove the deleted task from the state
                state.tasks = state.tasks.filter(task => task.id !== action.payload);
            })
            .addCase(DeleteTasks.rejected, (state, action) => {
                state.isDeleting = false;
                state.error = action.payload || { message: 'Failed to delete task.' };
            })

            // Handle updating a task
            .addCase(UpdateTask.pending, (state) => {
                state.update.isLoading = true;
                state.update.error = null;
            })
            .addCase(UpdateTask.fulfilled, (state, action) => {
                state.update.isLoading = false;
                // Find the index of the updated task and replace it
                const index = state.tasks.findIndex(task => task.id === action.payload.id);
                if (index !== -1) {
                    state.tasks[index] = action.payload;
                }
            })
            .addCase(UpdateTask.rejected, (state, action) => {
                state.update.isLoading = false;
                state.update.error = action.payload || { message: 'Failed to update task.' };
            });


    },
});

export default TasksSlice.reducer;