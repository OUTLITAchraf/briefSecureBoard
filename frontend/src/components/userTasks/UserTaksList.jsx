// src/components/UserTasks.jsx

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './UserTasksList.css';
import { toast } from 'react-toastify';
import { MdOutlineDateRange } from "react-icons/md";
import { fetchUserTasks, updateTaskStatus } from '../../features/ProjectsSlice';

const UserTasksList = () => {
    const dispatch = useDispatch();
    const { userTasks: { data, isLoading, error, test } } = useSelector((state) => state.projects);

    useEffect(() => {
        dispatch(fetchUserTasks());
        console.log('my tasks :', data);

    }, [dispatch]);

    const handleStatusChange = async(taskId, newStatus) => {
        try {
            console.log(`Sent data to update slice:`, data);
            const result = await dispatch(updateTaskStatus({ taskId, newStatus }));

            if (result.meta.requestStatus === 'fulfilled') {
                toast.success('Task status updated successfully!');
            }
        } catch (error) {
            console.error('Error while dispatching update status:', error);
            toast.error('Failed to update the status, please try again');
        }
        
    };

    // Helper function for UI consistency
    const getStatusChipClass = (status) => {
        if (!status) return '';
        return `task-status-chip status-${status.replace(/ /g, '_').toLowerCase()}`;
    };

    if (isLoading) {
        return <div className="loading-container"><div className="spinner"></div><p>Loading tasks...</p></div>;
    }

    if (error) {
        return <div className="error-container"><p>Error loading tasks: {error.message || 'An unknown error occurred.'}</p></div>;
    }

    return (
        <div className="tasks-container">
            <div className="tasks-header">
                <h1>My Assigned Tasks </h1>
            </div>
            {data?.length === 0 ? (
                <div className="no-tasks-card">
                    <p>You have no tasks assigned to you yet.</p>
                </div>
            ) : (
                <div className="tasks-list">
                    {data?.map((task) => (
                        <div key={task?.id} className="task-card">
                            <div className="task-details">
                                <h3 className="task-name">{task?.name}</h3>
                                <div className="task-meta">
                                    <span className="task-project-name">
                                        Project: {task?.project?.name || 'N/A'}
                                    </span>
                                    {/* <span className="task-created-at">
                                        <MdOutlineDateRange /> Created {task?.created_at} ago
                                    </span> */}
                                </div>
                                <p className="task-description">{task?.description}</p>
                            </div>
                            <div className="task-actions">
                                <select
                                    className={`task-status-select ${getStatusChipClass(task.status)}`}
                                    value={task?.status}
                                    onChange={(e) => handleStatusChange(task?.id, e.target.value)}
                                >
                                    <option value="To-Do">To-Do</option>
                                    <option value="Doing">Doing</option>
                                    <option value="Done">Done</option>
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserTasksList;