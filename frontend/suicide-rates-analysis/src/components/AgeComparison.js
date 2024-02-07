import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

function AgeComparison() {
  const [data, setData] = useState(null);
  const d3Container = useRef(null);

  useEffect(() => {
    fetch("https://suicide-rate-api-2eb3035f31b7.herokuapp.com/api/suicide_rates/age_comparison")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  useEffect(() => {
    if (data && d3Container.current) {
      // Clear the SVG canvas to prevent duplications
      d3.select(d3Container.current).selectAll("*").remove();

      const margin = { top: 0, right: 20, bottom: 50, left: 120 }; // Increase bottom and left margins
      const width = 500 - margin.left - margin.right;
      const height = 330 - margin.top - margin.bottom;

      // Create SVG container
      const svg = d3
        .select(d3Container.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Extract age groups from the dataset
      const ageGroups = [...new Set(data.map((item) => item[0]))];

      // Calculate the average rate for each age group
      const averageRates = ageGroups.map((ageGroup) => {
        const rates = data.filter((item) => item[0] === ageGroup).map((item) => item[1]);
        const averageRate = d3.mean(rates);
        return { ageGroup, averageRate };
      });

      // Create a scale for the age groups and for the rates
      // Create a scale for the age groups and for the rates
      const yScale = d3.scaleBand().range([0, height]).domain(ageGroups).padding(0.3); // Increase padding to make bars narrower
      // Add the Y axis
      const yAxis = svg.append("g").call(d3.axisLeft(yScale));

      // Increase the font size of the y-axis labels
      yAxis.selectAll("text").attr("font-size", "12px");

      // Remove the y-axis line
      yAxis.select(".domain").attr("stroke", "none");
      // Create a logarithmic scale for the rates
      const xScale = d3
        .scaleLog()
        .domain([1, d3.max(averageRates, (d) => d.averageRate)])
        .range([0, width])
        .base(10);

      // Draw the bars
      // Draw the bars
      svg
        .selectAll()
        .data(averageRates)
        .enter()
        .append("rect")
        .attr("y", (d) => yScale(d.ageGroup))
        .attr("width", (d) => xScale(Math.max(1, d.averageRate))) // Use Math.max to ensure the rate is at least 1
        .attr("height", yScale.bandwidth())
        .attr("fill", "steelblue");

      // Add labels to the bars
      svg
        .selectAll()
        .data(averageRates)
        .enter()
        .append("text")
        .attr("x", (d) => xScale(Math.max(1, d.averageRate)) + 5) // Position the label to the right of the bar
        .attr("y", (d) => yScale(d.ageGroup) + yScale.bandwidth() / 2) // Position the label in the middle of the bar
        .text((d) => `${d3.format(".2s")(d.averageRate)}%`) // Format the rate as a percentage
        .attr("font-size", "12px")
        .attr("fill", "black");

      // Add the Y axis
      // svg.append("g").call(d3.axisLeft(yScale));

      // Add the X axis
      svg.append("g").attr("transform", `translate(0,${height})`);
      // .call(d3.axisBottom(xScale).tickFormat((d) => `${d3.format(".2s")(d)}%`)); // Modify tick format to show as percentage

      // Add the X axis
      // svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(xScale));
    }
  }, [data]); // Redraw the chart if data changes

  return <svg className="d3-component" ref={d3Container} style={{ width: "100%", height: "auto" }} />;
}

export default AgeComparison;
