import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
    Dialog, DialogActions, DialogContent, DialogTitle,
    TextField, Button, FormControl, InputLabel, Select, MenuItem,
    Box, Chip, OutlinedInput
} from '@mui/material';
import { toast } from 'react-toastify';

import { useDispatch, useSelector } from 'react-redux';

// Assuming you have a way to fetch users within your existing slices
import { fetchProjects, fetchUsers } from '../../../features/ProjectsSlice';
import { AddTask, fetchTasks } from '../../../features/TasksSlice';

const validationSchema = yup.object().shape({
    project_id: yup.number().required('Project is required'),
    name: yup.string().required('Task name is required').min(3, 'Name must be at least 3 characters'),
    description: yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
    assigned_user_id: yup.number().nullable().transform((value, originalValue) =>
        originalValue === '' ? null : value
    ),
});

const AddTaskForm = ({ open, handleClose }) => {
    const dispatch = useDispatch();
    const { add: { isLoading } } = useSelector((state) => state.tasks);
    const { projects } = useSelector((state) => state.projects);
    const { users } = useSelector((state) => state.projects);


    const { register, handleSubmit, control, formState: { errors }, reset, watch } = useForm({
        resolver: yupResolver(validationSchema),
    });

    // Watch the project_id field for changes
    const selectedProjectId = watch('project_id');
    const selectedProject = projects?.find(project => project.id === selectedProjectId);
    const teamMemberIds = selectedProject?.team_members ? selectedProject.team_members.map(member => member.id) : [];

    // Filter users based on the team member IDs
    const filteredUsers = users?.data?.filter(user => teamMemberIds.includes(user.id)) || [];

    useEffect(() => {
        if (open) {
            dispatch(fetchProjects());
            dispatch(fetchUsers());
        }
    }, [dispatch, open]);

    const onSubmit = async (data) => {
        try {
            console.log("Data add task :", data);

            let result = await dispatch(AddTask(data));

            if (result.meta.requestStatus === 'fulfilled') {
                toast.success('Task Created Successfully');
                handleClose();
                reset();
                dispatch(fetchTasks());
            }
        } catch (error) {
            console.error('Error while dispatching add task:', error);
            handleClose();
            reset();
            toast.error('Failed to create the task, please try again');
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} classes={{ paper: 'pro-add-project-dialog-paper' }}>
            <DialogTitle className="pro-dialog-title">
                Add a New Task
            </DialogTitle>
            <DialogContent className="pro-dialog-content">
                <form onSubmit={handleSubmit(onSubmit)} id="add-task-form">
                    <FormControl fullWidth margin="dense" error={!!errors.project_id}>
                        <InputLabel>Project</InputLabel>
                        <Controller
                            name="project_id"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    label="Project"
                                >
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
                            defaultValue=""
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    label="Assigned To (optional)"
                                    disabled={!selectedProjectId} // Disable until a project is selected
                                >
                                    <MenuItem value="">
                                        <em>Unassigned</em>
                                    </MenuItem>
                                    {/* Render only filtered users */}
                                    {filteredUsers?.length > 0 && filteredUsers.map((user) => (
                                        <MenuItem key={user.id} value={user.id}>
                                            {user.name}
                                        </MenuItem>
                                    ))}
                                    {/* Display a message if no team members */}
                                    {selectedProjectId && filteredUsers?.length === 0 && (
                                        <MenuItem disabled>No team members found for this project</MenuItem>
                                    )}
                                </Select>
                            )}
                        />
                    </FormControl>
                </form>
            </DialogContent>
            <DialogActions className="pro-dialog-actions">
                <Button onClick={handleClose} className="pro-cancel-button" variant="outlined">
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit(onSubmit)} // Corrected line
                    className="pro-add-button"
                    variant="contained"
                    autoFocus
                    disabled={isLoading}
                >
                    {isLoading ? 'Creating...' : 'Create Task'}
                </Button>
            </DialogActions>
        </Dialog >
    );
};

export default AddTaskForm;