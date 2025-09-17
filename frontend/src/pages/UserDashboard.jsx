import React, { useEffect, useState } from "react";
import "./UserDashboard.css";
import { FiEdit, FiTrash2, FiUserPlus } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { createUser, fetchUsers } from "../features/UserSlice";
import Loading from "../components/Loading";

function UserDashboard() {
  const dispatch = useDispatch();
  const { list: users, isLoading } = useSelector((state) => state.users);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleAddUser = (e) => {
    e.preventDefault();
    const form = e.target;
    const newUser = {
      name: form.name.value,
      email: form.email.value,
      password: e.target.password.value, 
      role: form.role.value,
    };

    dispatch(createUser(newUser));
    form.reset();
    setShowForm(false);
  }
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Manage Users</h2>
        <button className="btn add-user-btn" onClick={() => setShowForm(true)}>
          <FiUserPlus style={{ marginRight: "6px" }} /> Add User
        </button>
      </div>

      <table className="user-table">
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
          {users.map((user, index) => {
            const role = user.roles[0]?.name || "user";

            return (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${role}`}>{user.roles[0]?.name || "User"}</span>
                </td>
                <td>
                  <button className="btn edit-btn">
                    <FiEdit style={{ marginRight: "4px" }} /> Edit
                  </button>
                  <button className="btn delete-btn">
                    <FiTrash2 style={{ marginRight: "4px" }} /> Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Add User Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New User</h3>
            <form onSubmit={handleAddUser}>
              <input type="text" name="name" placeholder="Name" required />
              <input type="email" name="email" placeholder="Email" required />
              <input type="password" name="password" placeholder="Password" required />
              <select name="role" required>
                <option value="">Select Role</option>
                <option value="manage">Manage</option>
                <option value="user">User</option>
              </select>
              <div className="modal-buttons">
                <button type="submit" className="btn add-btn">
                  <FiUserPlus style={{ marginRight: "4px" }} /> Add
                </button>
                <button type="button" className="btn cancel-btn" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
