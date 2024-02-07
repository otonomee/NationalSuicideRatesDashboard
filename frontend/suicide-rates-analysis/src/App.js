import React from "react";
import "./App.css";
// import GenderTrend from "./components/GenderTrend.js";
// import GenderComparison from "./components/GenderComparison.js";
// import RateTrend from "./components/RateTrend.js";
// import Trend from "./components/Trend.js";
// import GenderDisparity from "./components/GenderDisparity.js";
// import MetricCard from "./components/MetricCard/MetricCard.js";
import DashboardPage from "./components/DashboardPage/DashboardPage.js";
import Header from "./components/Header/Header.js";

function App() {
  return (
    <div className="App">
      <Header />

      <DashboardPage />
      <footer>
        <p>Data provided by U.S. Department of Health & Human Services. Dashboard created by Austin Allen.</p>
      </footer>
    </div>
  );
}

export default App;
