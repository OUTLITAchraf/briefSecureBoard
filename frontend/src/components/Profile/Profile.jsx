// ProfileCard.js

import React from 'react';
import './Profile.css'; // Importe le fichier CSS
import { useSelector } from 'react-redux';
import EditForm from './EditProfile/EditForm';

const Profile = () => {
    let { user } = useSelector((state) => state.auth)


    return (
        <>
            <div className="profile-container">
                <div className="profile-header">
                    <h2>Profile Information</h2>
                </div>
                <div className="profile-info-grid">
                    <div className="profile-info-row">
                        <span className="profile-label">Name</span>
                        <span className="profile-value">{user?.name}</span>
                    </div>
                    <div className="profile-info-row">
                        <span className="profile-label">Email</span>
                        <span className="profile-value">{user?.email}</span>
                    </div>
                    <div className="profile-info-row">
                        <span className="profile-label">Role</span>
                        <span className="profile-value">{user?.roles[0]?.name}</span> {/* Affiche les rôles sous forme de chaîne de caractères */}
                    </div>
                </div>

            </div>
            <EditForm user={user}/>
        </>
    );
};

export default Profile;