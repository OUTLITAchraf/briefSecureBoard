// src/components/TasksList/TaskDetails.jsx

import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Typography, Button
} from '@mui/material';
import { FaTimes } from 'react-icons/fa';

const TaskDetails = ({ open, handleClose, task }) => {

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            classes={{ paper: 'pro-details-dialog-paper' }} // This CSS class is from a previous file
        >
            <DialogTitle className="pro-dialog-title">
                <Typography component="span" className="pro-dialog-title-text">
                    Task Details
                </Typography>
                <Button onClick={handleClose} className="pro-close-button">
                    <FaTimes />
                </Button>
            </DialogTitle>
            <DialogContent className="pro-details-dialog-content">
                {task && (
                    <div className="pro-details-content">
                        <Typography className="pro-details-heading">Name:</Typography>
                        <Typography className="pro-details-value">{task.name}</Typography>

                        <Typography className="pro-details-heading">Description:</Typography>
                        <Typography className="pro-details-value">{task.description}</Typography>

                        <Typography className="pro-details-heading">Project:</Typography>
                        <Typography className="pro-details-value">{task.project?.name}</Typography>

                        <Typography className="pro-details-heading">Assigned To:</Typography>
                        <Typography className="pro-details-value">{task.assignedUser?.name || 'Unassigned'}</Typography>

                        <Typography className="pro-details-heading">Status:</Typography>
                        <Typography className="pro-details-value">{task.status}</Typography>
                    </div>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="contained" className="pro-add-button">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TaskDetails;