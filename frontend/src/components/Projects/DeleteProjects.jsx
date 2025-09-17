import React from 'react'
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { DeleteProject } from '../../features/ProjectsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

function DeleteProjects({ handleCloseDeletePopup, projectIdToDelete }) {
    const dispatch = useDispatch()
    const state = useSelector((state) => state.projects);


    const handleDeleteConfirmation = async () => {
        try {
            console.log(`Deleting project with ID: ${projectIdToDelete}`);
            let result = await dispatch(DeleteProject(projectIdToDelete));

            if (result.meta.requestStatus === 'fulfilled') {
                toast.success('Project Deleted Successfully')
                handleCloseDeletePopup();
            }
        } catch (error) {
            console.log('Error while dispatching deleteproject :', error);
            toast.error('Faild To Delete the project , please try again')
        }

    };
    return (
        <>
            <DialogTitle id="delete-dialog-title" className="dialog-title">
                {"Delete Project"}
            </DialogTitle>
            <DialogContent className="dialog-content">
                <DialogContentText id="delete-dialog-description">
                    Are you sure you want to delete this project? This action cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions className="dialog-actions">
                <Button onClick={handleCloseDeletePopup} className="cancel-button">
                    Cancel
                </Button>
                <Button onClick={handleDeleteConfirmation} className="delete-button" autoFocus>
                    {
                        state?.delete?.isLoading ? 'Deleting...' : 'Delete'
                    }

                </Button>
            </DialogActions>
        </>
    )
}

export default DeleteProjects
