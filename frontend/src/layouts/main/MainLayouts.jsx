// MainLayout.jsx

import React from 'react';
import './MainLayout.css'; // N'oublie pas d'importer le fichier CSS
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchUser } from '../../features/AuthSlice';
import { Link, Outlet } from 'react-router-dom';
import Logout from '../../components/Auth/logout/Logout';

function MainLayout({ children }) {
    const dispatch = useDispatch()
    const { user } = useSelector(state => state.auth);

    const role = user?.roles?.[0]?.name; // because you load roles in backend

    
    return (
        <div className="main-layout-container">
            {/* Barre latérale (Sidebar) */}
            <aside className="sidebar">
                {/* Logo */}
                <div className="logo-container">
                    <h1>SecureBoard</h1>
                </div>

                {/* Liens de navigation */}
                <nav className="navigation-links">
                    <Link to='/home' className="nav-link">Dashboard</Link>
                    {role === 'manage' || role === 'admin' ? (
                        <Link to='/home/projects' className="nav-link">Projects</Link>
                    ) : null}
                    {role === 'admin' && (
                        <Link to='/home/dashboard-users' className="nav-link">Users</Link>
                    )}
                    
                </nav>
            </aside>

            {/* Contenu principal */}
            <main className="content-area">
                {/* Barre de navigation supérieure (Navbar) */}
                <header className="top-navbar">
                    <div className="profile-dropdown">
                        <span>{user?.name}</span>
                        <div className="dropdown-menu">
                            <Link to="/home/profile">Profil</Link>
                            <Logout />
                        </div>
                    </div>
                </header>

                {/* Contenu dynamique */}
                <div className="main-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default MainLayout;