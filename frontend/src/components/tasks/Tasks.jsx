import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Tasks.css'; // Use the same CSS file for a consistent design
import { FaTrash, FaEdit, FaEye } from 'react-icons/fa';
import { fetchTasks } from '../../features/TasksSlice';
import AddTaskForm from './AddTaskForm/AddTaskForm';
import DeleteTask from './DeleteTask';
import EditTaskForm from './EditTaskForm';
import TaskDetails from './TaskDetails';


const TasksList = () => {
    const dispatch = useDispatch();
    const { tasks, isLoading, error } = useSelector((state) => state.tasks);


    // State to manage the add task form popup
    const [openAddTaskForm, setOpenAddTaskForm] = useState(false);

    const handleOpenAddTaskForm = () => {
        setOpenAddTaskForm(true);
    };

    const handleCloseAddTaskForm = () => {
        setOpenAddTaskForm(false);
    };

    // State for the delete confirmation popup
    const [openDeletePopup, setOpenDeletePopup] = useState(false);
    const [taskIdToDelete, setTaskIdToDelete] = useState(null);

    const handleOpenDeletePopup = (taskId) => {
        setTaskIdToDelete(taskId);
        setOpenDeletePopup(true);
    };

    const handleCloseDeletePopup = () => {
        setOpenDeletePopup(false);
        setTaskIdToDelete(null);
    };

    // State for the edit task form
    const [openEditForm, setOpenEditForm] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);

    const handleOpenEditForm = (task) => {
        setTaskToEdit(task);
        setOpenEditForm(true);
    };

    const handleCloseEditForm = () => {
        setOpenEditForm(false);
        setTaskToEdit(null);
    };

    // New state for the details popup
    const [openDetailsPopup, setOpenDetailsPopup] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const handleOpenDetailsPopup = (task) => {
        setSelectedTask(task);
        setOpenDetailsPopup(true);
    };

    const handleCloseDetailsPopup = () => {
        setOpenDetailsPopup(false);
        setSelectedTask(null);
    };

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    // Function to determine the status chip class
    const getStatusClass = (status) => {
        switch (status) {
            case 'todo':
                return 'task-status-todo';
            case 'doing':
                return 'task-status-doing';
            case 'done':
                return 'task-status-done';
            default:
                return '';
        }
    };

    // Conditional rendering for loading and error states
    if (isLoading) {
        return (
            <div className="projects-container">
                <div className="projects-header">
                    <h1>Task List</h1>
                </div>
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p className="loading-text">Loading tasks, please wait...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="projects-container">
                <h1>Task List</h1>
                <p>Error loading tasks: {error.message}</p>
            </div>
        );
    }

    return (
        <div className="projects-container">
            <div className="projects-header">
                <h1>Task List</h1>
                <button className="add-project-btn" onClick={handleOpenAddTaskForm}>Add Task</button>
            </div>
            {
                tasks?.length === 0 ? (
                    <div className="projects-card no-projects">
                        <p>You don't have any tasks yet. Start by adding one!</p>
                    </div>
                ) : (
                    <div className="projects-card">
                        <table className="projects-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Assigned To</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks?.map((task) => (
                                    <tr key={task?.id}>
                                        <td>{task?.name}</td>
                                        <td>{task?.description}</td>
                                        <td>{task?.assigned_user?.name || 'Unassigned'}</td>
                                        <td>
                                            <span className={`task-status-chip ${getStatusClass(task.status)}`}>
                                                {task?.status}
                                            </span>
                                        </td>
                                        <td className="actions">
                                            <span className="action-icon view-icon" onClick={() => handleOpenDetailsPopup(task)}>
                                                <FaEye size='20px' />
                                            </span>
                                            <span className="action-icon edit-icon" onClick={() => handleOpenEditForm(task)}>
                                                <FaEdit />
                                            </span>
                                            <span className="action-icon delete-icon" onClick={() => handleOpenDeletePopup(task?.id)}>
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
            <AddTaskForm
                open={openAddTaskForm}
                handleClose={handleCloseAddTaskForm}
            />
            {/* Render the Delete Task confirmation popup */}
            <DeleteTask
                open={openDeletePopup}
                handleClose={handleCloseDeletePopup}
                taskIdToDelete={taskIdToDelete}
            />

            {/* Render the new Edit Task form dialog */}
            <EditTaskForm
                open={openEditForm}
                handleClose={handleCloseEditForm}
                taskToEdit={taskToEdit}
            />

            {/* Render the new Task Details dialog */}
            <TaskDetails
                open={openDetailsPopup}
                handleClose={handleCloseDetailsPopup}
                task={selectedTask}
            />
        </div>
    );
};

export default TasksList;