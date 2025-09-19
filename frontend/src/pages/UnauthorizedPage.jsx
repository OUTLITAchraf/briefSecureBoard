import React from "react";
import { ShieldAlert, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./UnauthorizedPage.css";

function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-container">
      {/* Icon */}
      <ShieldAlert className="unauthorized-icon" />

      {/* Title */}
      <h1 className="unauthorized-title">Unauthorized Access</h1>
      <p className="unauthorized-text">
        Sorry, you don’t have permission to view this page.  
        Please contact your administrator if you think this is a mistake.
      </p>

      {/* Button */}
      <button
        onClick={() => navigate("/")}
        className="unauthorized-button"
      >
        <Home />
        Go Back Home
      </button>
    </div>
  );
}

export default UnauthorizedPage;
