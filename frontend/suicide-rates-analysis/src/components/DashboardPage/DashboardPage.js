import React from "react";
import Trend from "../Trend.js";
// import GenderTrend from "../GenderTrend.js";
import GenderComparison from "../GenderComparison.js";
import RaceComparison from "../RaceComparison.js";
import AgeComparison from "../AgeComparison.js";
import GenderDisparity from "../GenderDisparity.js";
import "./DashboardPage.css"; // Make sure to create and import your CSS file

const DashboardPage = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-grid">
        <div className="metric-tile full-width">
          <h4 className="metric-header">Aggregate Suicide Rate Over Time (%)</h4>
          <Trend />
        </div>
        <div className="metric-tile full-width">
          <h4 className="metric-header">Suicide Rates By Gender</h4>
          <GenderComparison />
        </div>
        <div className="metric-tile full-width">
          <h4 className="metric-header">Suicide Rates by Race</h4>
          <RaceComparison />
        </div>
        <div className="metric-tile full-width">
          <h4 className="metric-header">Aggregate Average Suicide Rate By Age Group</h4>
          <AgeComparison />
        </div>
        {/* <div className="metric-tile full-width">
          <h4 className="metric-header">Male to Female Suicide Ratio</h4>
          <GenderDisparity />
        </div> */}
      </div>
    </div>
  );
};

export default DashboardPage;
