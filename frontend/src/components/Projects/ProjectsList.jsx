// src/components/ProjectsList.jsx

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './ProjectsList.css';

import { FaTrash, FaEdit, FaEye } from 'react-icons/fa';
import { DeleteProject, fetchProjects } from '../../features/ProjectsSlice';

import Dialog from '@mui/material/Dialog';

import { Await } from 'react-router-dom';
import { toast } from 'react-toastify';
import DeleteProjects from './DeleteProjects';
import AddProjectForm from './AddProjectForm';
import EditProjectForm from './EditProjectForm';
import ProjectDetails from './ProjectDetails';

// const teams = ['Frontend', 'Backend', 'DevOps', 'Design'];

function ProjectsList() {
    const dispatch = useDispatch();
    const { projects, isLoading, error } = useSelector((state) => state.projects);



    // HANDLE DELETE PROJECT
    const [openDeletePopup, setOpenDeletePopup] = useState(false);
    const [projectIdToDelete, setProjectIdToDelete] = useState(null);
    const handleOpenDeletePopup = (projectId) => {
        setProjectIdToDelete(projectId);
        setOpenDeletePopup(true);
    };
    const handleCloseDeletePopup = () => {
        setOpenDeletePopup(false);
        setProjectIdToDelete(null);
    };


    const [openAddForm, setOpenAddForm] = useState(false);
    const handleOpenAddForm = () => {
        setOpenAddForm(true);
        console.log("hello add");

    };

    const handleCloseAddForm = () => {
        setOpenAddForm(false);
    };

    const handleAddProject = (formData) => {
        try {

        } catch (error) {

        }
        console.log('New project data:', formData);
        handleCloseAddForm();
    };

    // HANDLE EDIT POPUP
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [projectToEdit, setProjectToEdit] = useState(null);

    const handleEditClick = (project) => {
        setProjectToEdit(project);
        setIsEditFormOpen(true);
    };

    //HANDLE SHOW DETAILS POPUP
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    const handleOpenDetails = (project) => {
        setSelectedProject(project);
        setIsDetailsOpen(true);
    };

    const handleCloseDetails = () => {
        setIsDetailsOpen(false);
        setSelectedProject(null); // Clear the selected project
    };

    useEffect(() => {
        dispatch(fetchProjects());
    }, [dispatch]);

    if (isLoading) {
        return (
            <div className="projects-container">
                <div className="projects-header">
                    <h1>Project List</h1>
                </div>
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p className="loading-text">Loading projects, please wait...</p>
                </div>
            </div>
        );
    }


    if (error) {
        return (
            <div className="projects-container">
                <h1>Project List</h1>
                <p>Error loading projects: {error.message}</p>
            </div>
        );
    }




    return (
        <div className="projects-container">
            <div className="projects-header">
                <h1>Project List</h1>
                <button className="add-project-btn" onClick={handleOpenAddForm}>Add Project</button>
            </div>
            {
                projects?.length === 0 ? (
                    <div className="projects-card no-projects">
                        <p>You don't have any projects yet. Start by adding one!</p>
                    </div>
                )
                    : (
                        <div className="projects-card">
                            <table className="projects-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Description</th>
                                        <th>Creator</th>
                                        <th>Team</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects?.map(project => (
                                        <tr key={project?.id}>
                                            <td>{project?.name}</td>
                                            <td>{project?.description}</td>
                                            <td>{project?.user?.name}</td>
                                            <td>
                                                {
                                                    !project?.team_members?.length ? "_"
                                                        :
                                                        <select className="team-select" defaultValue={project?.team}>
                                                            {project?.team_members?.map(team => (
                                                                <option key={team.id} value={team.id}>{team.name}</option>
                                                            ))}
                                                        </select>
                                                }
                                            </td>
                                            <td className="actions">
                                                <span className="action-icon view-icon" >
                                                    <FaEye size='20px' onClick={() => handleOpenDetails(project)} />
                                                </span>
                                                <span className="action-icon edit-icon">
                                                    <FaEdit onClick={() => handleEditClick(project)} />
                                                </span>
                                                <span className="action-icon delete-icon"
                                                    onClick={() => handleOpenDeletePopup(project?.id)}

                                                >
                                                    <FaTrash />
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
            }


            {/* DELETE CONFIRMATION POPUP */}
            <Dialog
                open={openDeletePopup}
                onClose={handleCloseDeletePopup}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
                classes={{ paper: 'custom-dialog-paper' }}
            >
                <DeleteProjects handleCloseDeletePopup={handleCloseDeletePopup} projectIdToDelete={projectIdToDelete} />
            </Dialog>

            {/* ADD PROJECT FORM */}
            <AddProjectForm
                open={openAddForm}
                handleClose={handleCloseAddForm}
                handleAddProject={handleAddProject}
            />

            {/* EDIT PROJECT FORM */}
            <EditProjectForm
                open={isEditFormOpen}
                handleClose={() => setIsEditFormOpen(false)}
                projectToEdit={projectToEdit}
            />
            
            {/* DETAILS PROJECT*/}
            <ProjectDetails
                open={isDetailsOpen}
                handleClose={handleCloseDetails}
                project={selectedProject}
            />
        </div>
    );
}

export default ProjectsList;