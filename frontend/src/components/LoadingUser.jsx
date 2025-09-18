import React from 'react';
import './LoadingUser.css'; // import CSS file

function LoadingUser() {
  return (
    <div className="loadingUser-container">
      <div className="spinner-loadingUser"></div>
      <p className="loadingUser-text">LoadingUser...</p>
    </div>
  );
}

export default LoadingUser;
