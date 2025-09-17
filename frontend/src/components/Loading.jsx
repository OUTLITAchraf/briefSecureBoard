import React from 'react';
import './Loading.css'; // import CSS file

function Loading() {
  return (
    <div className="loading-container">
      <div className="spinner-loading"></div>
      <p className="loading-text">Loading...</p>
    </div>
  );
}

export default Loading;
