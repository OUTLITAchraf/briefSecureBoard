// src/components/TasksList/DeleteTask.jsx

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
    Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, Button, Box, CircularProgress
} from '@mui/material';
import { DeleteTasks } from '../../features/TasksSlice';

const DeleteTask = ({ open, handleClose, taskIdToDelete }) => {
    const dispatch = useDispatch();
    const { isDeleting } = useSelector((state) => state.tasks);

    const handleDelete = async () => {
        try {
            const result = await dispatch(DeleteTasks(taskIdToDelete));

            if (result.meta.requestStatus === 'fulfilled') {
                toast.success('Task deleted successfully');
                handleClose();

            } else {
                toast.error('Failed to delete task. Please try again.');
            }
        } catch (error) {
            console.log("error :", error);

            toast.error('An error occurred. Please try again.');
        } finally {
            handleClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Confirm Deletion"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete this task? This action cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={isDeleting}>Cancel</Button>
                <Button onClick={handleDelete} color="error" autoFocus disabled={isDeleting}>
                    {isDeleting ? <CircularProgress size={24} /> : 'Delete'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteTask;