// MetricCard.js
import React from "react";
import "./MetricCard.css";

function MetricCard({ title, children }) {
  return (
    <div className="metric-card">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

export default MetricCard;
