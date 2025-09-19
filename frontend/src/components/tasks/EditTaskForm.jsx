// src/components/TasksList/EditTaskForm.jsx

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
    Dialog, DialogActions, DialogContent, DialogTitle,
    TextField, Button, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, fetchUsers } from '../../features/ProjectsSlice';
import { fetchTasks, UpdateTask } from '../../features/TasksSlice';

const validationSchema = yup.object().shape({
    project_id: yup.number().required('Project is required'),
    name: yup.string().required('Task name is required').min(3, 'Name must be at least 3 characters'),
    description: yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
    assigned_user_id: yup.number().nullable().transform((value, originalValue) =>
        originalValue === '' ? null : value
    ),
    status: yup.string().required('Status is required').oneOf(['todo', 'doing', 'done']),
});

const EditTaskForm = ({ open, handleClose, taskToEdit }) => {
    const dispatch = useDispatch();
    const { projects } = useSelector((state) => state.projects);
    const { users } = useSelector((state) => state.projects);
    const { update: { isLoading } } = useSelector((state) => state.tasks);

    const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
        resolver: yupResolver(validationSchema),
    });

    useEffect(() => {
        if (open && taskToEdit) {
            // Set form values when the dialog opens
            reset({
                ...taskToEdit,
                project_id: taskToEdit.project_id,
                assigned_user_id: taskToEdit.assigned_user_id || '', // Convert null to empty string for the select input
            });
            dispatch(fetchProjects());
            dispatch(fetchUsers());
        }
    }, [open, taskToEdit, reset, dispatch]);

    const onSubmit = async (data) => {
        try {
            const result = await dispatch(UpdateTask({ id: taskToEdit.id, ...data }));

            if (UpdateTask.fulfilled.match(result)) {
                toast.success('Task updated successfully');
                handleClose();
                dispatch(fetchTasks());
            } else {
                toast.error('Failed to update task. Please try again.');
            }
        } catch (error) {
            console.error('Error while dispatching update task:', error);
            toast.error('An error occurred. Please try again.');
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} classes={{ paper: 'pro-add-project-dialog-paper' }}>
            <DialogTitle className="pro-dialog-title">
                Edit Task
            </DialogTitle>
            <DialogContent className="pro-dialog-content">
                <form id="edit-task-form" onSubmit={handleSubmit(onSubmit)}>
                    <FormControl fullWidth margin="dense" error={!!errors.project_id}>
                        <InputLabel>Project</InputLabel>
                        <Controller
                            name="project_id"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} label="Project">
                                    {projects?.map((project) => (
                                        <MenuItem key={project.id} value={project.id}>
                                            {project.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.project_id && <p className="MuiFormHelperText-root Mui-error">{errors.project_id.message}</p>}
                    </FormControl>

                    <TextField
                        fullWidth
                        margin="dense"
                        label="Task Name"
                        variant="outlined"
                        {...register('name')}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        className="pro-form-input"
                    />

                    <TextField
                        fullWidth
                        margin="dense"
                        label="Description"
                        variant="outlined"
                        multiline
                        rows={4}
                        {...register('description')}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        className="pro-form-input"
                    />

                    <FormControl fullWidth margin="dense">
                        <InputLabel>Assigned To (optional)</InputLabel>
                        <Controller
                            name="assigned_user_id"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} label="Assigned To (optional)">
                                    <MenuItem value="">
                                        <em>Unassigned</em>
                                    </MenuItem>
                                    {users?.data?.map((user) => (
                                        <MenuItem key={user.id} value={user.id}>
                                            {user.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                    </FormControl>

                    <FormControl fullWidth margin="dense" error={!!errors.status}>
                        <InputLabel>Status</InputLabel>
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} label="Status">
                                    <MenuItem value="todo">Todo</MenuItem>
                                    <MenuItem value="doing">Doing</MenuItem>
                                    <MenuItem value="done">Done</MenuItem>
                                </Select>
                            )}
                        />
                        {errors.status && <p className="MuiFormHelperText-root Mui-error">{errors.status.message}</p>}
                    </FormControl>

                </form>
            </DialogContent>
            <DialogActions className="pro-dialog-actions">
                <Button onClick={handleClose} className="pro-cancel-button" variant="outlined">
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit(onSubmit)}
                    className="pro-add-button"
                    variant="contained"
                    disabled={isLoading}
                >
                    {isLoading ? 'Updating...' : 'Update Task'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditTaskForm;