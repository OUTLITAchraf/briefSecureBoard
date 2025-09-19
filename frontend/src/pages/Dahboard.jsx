import React from "react";
import { useSelector } from "react-redux";
import ManagerDashboard from "./managerDashboard/ManagerDashboard";
import UserDashboardStatistic from "./userDashboard/UserDashboardStatistic";
import AdminDashboard from "./AdminDashboard/AdminDashboard";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <p>Loading...</p>;
  }

  const role = user?.roles?.[0]?.name; 

  return (
    <div>

      {role === "admin" && (
        <div>
          <AdminDashboard/>
        </div>
      )}

      {role === "manage" && (
        <div>
          <ManagerDashboard />
        </div>
      )}

      {role === "user" && (
        <div>
          <UserDashboardStatistic />
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
