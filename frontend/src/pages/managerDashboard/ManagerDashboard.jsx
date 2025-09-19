
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import { FaRegListAlt, FaTasks } from 'react-icons/fa';
import { IoIosArrowForward } from "react-icons/io";

import './ManagerDashboard.css';
import { fetchManagerDashboardData } from '../../features/ProjectsSlice';

// Register the necessary Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const ManagerDashboard = () => {
    const dispatch = useDispatch();
    const {statistics:{data, isLoading, error} } = useSelector((state) => state.projects);

    useEffect(() => {
        dispatch(fetchManagerDashboardData());
    }, [dispatch]);

    if (isLoading) {
        return (
            <div className="dashboard-container">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p className="loading-text">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-container">
                <p>Error loading dashboard data: {error.message}</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="dashboard-container">
                <p>No dashboard data available.</p>
            </div>
        );
    }

    // Chart.js data configuration
    const chartData = {
        labels: ['To-Do', 'Doing', 'Done'],
        datasets: [
            {
                label: 'Number of Tasks',
                data: [data.taskStatusData.todo, data.taskStatusData.doing, data.taskStatusData.done],
                backgroundColor: [
                    '#f39c12',
                    '#3498db',
                    '#27ae60',
                ],
                borderColor: [
                    '#d68010',
                    '#2980b9',
                    '#219653',
                ],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Tasks by Status',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                },
            },
        },
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Dashboard</h1>
            <div className="stats-cards-container">
                <div className="stat-card">
                    <div className="card-icon-bg"><FaRegListAlt className="card-icon" /></div>
                    <div className="card-content">
                        <span className="card-label">Total Projects</span>
                        <span className="card-value">{data.totalProjects}</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="card-icon-bg"><FaTasks className="card-icon" /></div>
                    <div className="card-content">
                        <span className="card-label">Total Tasks</span>
                        <span className="card-value">{data.totalTasks}</span>
                    </div>
                </div>
            </div>
            <div className="dashboard-sections-container">
                <div className="chart-section dashboard-card">
                    <Bar data={chartData} options={chartOptions} />
                </div>
                <div className="recent-projects-section dashboard-card">
                    <h3>Recent Projects</h3>
                    <ul>
                        {data.lastFiveProjects.map(project => (
                            <li key={project.id} className="recent-project-item">
                                <IoIosArrowForward />
                                <span className="project-name">{project.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ManagerDashboard;