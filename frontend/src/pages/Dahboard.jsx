import React from "react";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <p>Loading...</p>;
  }

  const role = user?.roles?.[0]?.name; 

  return (
    <div>
      <h1>Welcome, {user.name} 👋</h1>

      {role === "admin" && (
        <div>
          <h2>Admin Dashboard</h2>
          <p>You can manage users, projects</p>
        </div>
      )}

      {role === "manage" && (
        <div>
          <h2>Manager Dashboard</h2>
          <p>You can manage projects.</p>
        </div>
      )}

      {role === "user" && (
        <div>
          <h2>User Dashboard</h2>
          <p>You can just view projects assigne to you.</p>
        </div>
      )}

      {!role && (
        <div>
          <h2>No Role Assigned</h2>
          <p>Please contact the administrator.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
