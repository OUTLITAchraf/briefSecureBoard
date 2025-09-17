import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    Typography,
    Box,
    Chip,
    Divider
} from '@mui/material';

const ProjectDetails = ({ open, handleClose, project }) => {
    // If no project is passed, the dialog won't render its content.
    if (!project) {
        return null;
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            classes={{ paper: 'pro-details-dialog-paper' }}
        >
            <DialogTitle className="pro-details-dialog-title">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" className="pro-dialog-title-text">
                        Project Details
                    </Typography>
                    <Button onClick={handleClose} className="pro-close-button">
                        X
                    </Button>
                </Box>
            </DialogTitle>
            <DialogContent className="pro-details-dialog-content">
                <Box className="pro-details-section">
                    <Typography className="pro-details-label">
                        Project Name
                    </Typography>
                    <Typography className="pro-details-value">
                        {project.name}
                    </Typography>
                </Box>
                <Divider className="pro-details-divider" />
                <Box className="pro-details-section">
                    <Typography className="pro-details-label">
                        Description
                    </Typography>
                    <Typography className="pro-details-value">
                        {project.description}
                    </Typography>
                </Box>
                <Divider className="pro-details-divider" />
                <Box className="pro-details-section">
                    <Typography className="pro-details-label">
                        Project Manager
                    </Typography>
                    <Typography className="pro-details-value">
                        {project.user?.name || 'N/A'}
                    </Typography>
                </Box>
                <Divider className="pro-details-divider" />
                <Box className="pro-details-section">
                    <Typography className="pro-details-label">
                        Team Members
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {project.team_members && project.team_members.length > 0 ? (
                            project.team_members.map(member => (
                                <Chip key={member.id} label={member.name} className="pro-team-chip" />
                            ))
                        ) : (
                            <Typography className="pro-details-value">
                                No team members
                            </Typography>
                        )}
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ProjectDetails;