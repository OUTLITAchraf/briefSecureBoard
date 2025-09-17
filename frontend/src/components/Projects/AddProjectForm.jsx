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
import { AddProject, fetchUsers } from '../../features/ProjectsSlice';
import { useDispatch, useSelector } from 'react-redux';

const validationSchema = yup.object().shape({
    name: yup.string().required('Project name is required').min(3, 'Name must be at least 3 characters'),
    description: yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
    team_members: yup.array().of(yup.number()).nullable(),
});

const AddProjectForm = ({ open, handleClose }) => {
    const dispatch = useDispatch();
    const { add: { isLoading }, users } = useSelector((state) => state.projects);

    const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
        resolver: yupResolver(validationSchema),
    });

    useEffect(() => {
        if (open) {
            dispatch(fetchUsers());
        }
    }, [dispatch, open]);

    const onSubmit = async (data) => {
        try {
            console.log(`sent data to add slice:`, data);
            let result = await dispatch(AddProject(data));

            if (result.meta.requestStatus === 'fulfilled') {
                toast.success('Project Created Successfully');
                handleClose();
                reset();
            }
        } catch (error) {
            console.error('Error while dispatching add project:', error);
            handleClose();
            reset();
            toast.error('Failed to create the project, please try again');
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} classes={{ paper: 'pro-add-project-dialog-paper' }}>
            <DialogTitle className="pro-dialog-title">
                Add a New Project
            </DialogTitle>
            <DialogContent className="pro-dialog-content">
                <form onSubmit={handleSubmit(onSubmit)} id="add-project-form">
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Project Name"
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
                        <InputLabel id="team-members-label">Team Members (optional)</InputLabel>
                        <Controller
                            name="team_members"
                            control={control}
                            defaultValue={[]}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    labelId="team-members-label"
                                    id="team-members-select"
                                    multiple
                                    label="Team Members (optional)"
                                    input={<OutlinedInput id="select-multiple-chip" label="Team Members (optional)" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => {
                                                const user = users?.data?.find(u => u.id === value);
                                                return <Chip key={value} label={user?.name || `User ${value}`} />;
                                            })}
                                        </Box>
                                    )}
                                >
                                    {users?.data?.map((user) => (
                                        <MenuItem key={user.id} value={user.id}>
                                            {user.name}
                                        </MenuItem>
                                    ))}
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
                    type="submit"
                    form="add-project-form"
                    className="pro-add-button"
                    variant="contained"
                    autoFocus
                    disabled={isLoading}
                >
                    {isLoading ? 'Creating...' : 'Create Project'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddProjectForm;