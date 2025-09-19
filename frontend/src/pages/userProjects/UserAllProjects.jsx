// src/components/UserDashboard.jsx

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaEye } from 'react-icons/fa';
import { fetchUserProjects } from '../../features/ProjectsSlice';
import UserPrjectDetails from './UserProjectDetails';

function UserDashboard() {
    const dispatch = useDispatch();
    const { userProjects: { data, isLoading, error } } = useSelector((state) => state.projects);

    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    const handleOpenDetails = (project) => {
        setSelectedProject(project);
        setIsDetailsOpen(true);
    };

    const handleCloseDetails = () => {
        setIsDetailsOpen(false);
        setSelectedProject(null);
    };

    useEffect(() => {
        // Dispatch the new action to get only the user's projects
        dispatch(fetchUserProjects());
    }, [dispatch]);

    // This filtering is no longer needed since the backend does it for us
    // const userProjects = projects?.filter(project =>
    //     project.team_members?.some(member => member.id === user?.id)
    // );

    if (isLoading) {
        return (
            <div className="projects-container">
                <div className="projects-header">
                    <h1>My Projects</h1>
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
                <h1>My Projects</h1>
                <p>Error loading projects: {error.message}</p>
            </div>
        );
    }

    return (
        <div className="projects-container">
            <div className="projects-header">
                <h1>My Projects</h1>
            </div>
            {data?.length === 0 ? (
                <div className="projects-card no-projects">
                    <p>You are not a member of any projects yet.</p>
                </div>
            ) : (
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
                            {data?.map(project => (
                                <tr key={project?.id}>
                                    <td>{project?.name}</td>
                                    <td className="description-cell">
                                        <div className="description-text">
                                            {project?.description}
                                        </div>
                                    </td>
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
                                        <span className="action-icon view-icon" onClick={() => handleOpenDetails(project)}>
                                            <FaEye size='20px' />
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <UserPrjectDetails
                open={isDetailsOpen}
                handleClose={handleCloseDetails}
                project={selectedProject}
            />
        </div>
    );
}

export default UserDashboard;