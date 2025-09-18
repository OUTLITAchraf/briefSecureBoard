// src/components/Users/UsersList.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../features/UserSlice";
import { FiEdit, FiTrash2, FiUserPlus } from "react-icons/fi";
import Dialog from "@mui/material/Dialog";
import AddUserForm from "./AddUserForm";
import DeleteUser from "./DeleteUser";
import UpdateUserForm from "./UpdateUserForm"; // Import the UpdateUserForm modal
import './UsersList.css';

function UsersList() {
    const dispatch = useDispatch();
    const { list: users, isLoading, error } = useSelector((state) => state.users);

    const [openAdd, setOpenAdd] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);

    const [openUpdate, setOpenUpdate] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleOpenUpdate = (user) => {
        setSelectedUser(user);
        setOpenUpdate(true);
    };

    const handleCloseUpdate = () => {
        setSelectedUser(null);
        setOpenUpdate(false);
    };

    if (isLoading) {
        return (
            <div className="users-container">
                <div className="users-header">
                    <h1>Manage Users</h1>
                </div>
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p className="loading-text">Loading users, please wait...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="users-container">
                <h1>Manage Users</h1>
                <p>Error loading users: {error.message}</p>
            </div>
        );
    }

    return (
        <div className="users-container">
            <div className="users-header">
                <h1>Manage Users</h1>
                <button className="add-user-btn" onClick={() => setOpenAdd(true)}>
                    <FiUserPlus style={{ marginRight: "6px" }} /> Add User
                </button>
            </div>

            <div className="users-card">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, idx) => {
                            const role = user.roles[0]?.name || "user";
                            return (
                                <tr key={user.id}>
                                    <td>{idx + 1}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`role-badge ${role.toLowerCase()}`}>
                                            {role}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="actions">
                                            <button
                                                className="edit-btn"
                                                onClick={() => handleOpenUpdate(user)}
                                            >
                                                <FiEdit /> Edit
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => {
                                                    setUserIdToDelete(user.id);
                                                    setOpenDelete(true);
                                                }}
                                            >
                                                <FiTrash2 /> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Add User Dialog */}
            <AddUserForm open={openAdd} handleClose={() => setOpenAdd(false)} />

            {/* Delete User Dialog */}
            <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
                <DeleteUser
                    handleCloseDelete={() => setOpenDelete(false)}
                    userId={userIdToDelete}
                />
            </Dialog>

            {/* Update User Dialog */}
            <Dialog open={openUpdate} onClose={handleCloseUpdate}>
                {selectedUser && (
                    <UpdateUserForm
                        user={selectedUser}
                        handleCloseUpdate={handleCloseUpdate}
                    />
                )}
            </Dialog>
        </div>
    );
}

export default UsersList;
