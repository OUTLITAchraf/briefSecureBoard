// src/components/ProjectDetails.jsx

import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    IconButton,
    Typography,
    Box
} from '@mui/material';
import './UserProject.css'
const UserPrjectDetails = ({ open, handleClose, project }) => {

    if (!project) {
        return null;
    }

    // Function to get the status chip class
    const getStatusChipClass = (status) => {
        if (!status) return '';
        return `project-status-chip status-${status.replace(/ /g, '_').toLowerCase()}`;
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="project-details-dialog-title"
            classes={{ paper: 'details-dialog-paper' }}
        >
            <DialogTitle id="project-details-dialog-title" className="details-dialog-title">
                <Typography component="h2" className="details-title-text">
                    Project Details
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    className="details-close-button"
                >
                    X
                </IconButton>
            </DialogTitle>
            <DialogContent className="details-dialog-content">
                <Box className="details-content-grid">
                    <Typography className="details-heading">
                        Project Name:
                    </Typography>
                    <Typography className="details-value">
                        {project.name}
                    </Typography>

                    <Typography className="details-heading">
                        Description:
                    </Typography>
                    <Typography className="details-value details-description-value">
                        {project.description}
                    </Typography>

                    <Typography className="details-heading">
                        Creator:
                    </Typography>
                    <Typography className="details-value">
                        {project.user?.name}
                    </Typography>

                    <Typography className="details-heading">
                        Status:
                    </Typography>
                    <Typography className="details-value">
                        <span className={getStatusChipClass(project.status)}>
                            {project.status}
                        </span>
                    </Typography>

                    <Typography className="details-heading">
                        Team:
                    </Typography>
                    <Typography className="details-value">
                        {project.team_members?.length > 0
                            ? project.team_members.map(member => member.name).join(', ')
                            : 'No team members assigned'
                        }
                    </Typography>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default UserPrjectDetails;