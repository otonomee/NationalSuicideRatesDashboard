import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function GenderDisparity() {
  const d3Container = useRef(null);

  useEffect(() => {
    if (d3Container.current) {
      d3.json("https://suicide-rate-api-2eb3035f31b7.herokuapp.com/api/suicide_rates/gender_disparity").then((data) => {
        const svg = d3.select(d3Container.current);

        const width = 400; // Define the width
        const height = 200; // Define the height

        const x = d3
          .scaleLinear()
          .domain(d3.extent(data, (d) => d[0])) // Adjust this to use the appropriate property from your data
          .range([0, width]);

        const y = d3
          .scaleLinear()
          .domain([0, d3.max(data, (d) => d[1])]) // Adjust this to use the appropriate property from your data
          .range([height, 0]);

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const line = d3
          .line()
          .x((d) => x(d[0])) // Adjust this to use the appropriate property from your data
          .y((d) => y(d[1])); // Adjust this to use the appropriate property from your data

        const groups = d3.group(data, (d) => d[2]); // Adjust this to use the appropriate property from your data

        svg.append("g").call(d3.axisBottom(x));

        svg.append("g").call(d3.axisLeft(y));

        Array.from(groups, ([key, value]) => {
          svg.append("path").datum(value).attr("fill", "none").attr("stroke", color(key)).attr("stroke-width", 1.5).attr("d", line);
        });
      });
    }
  }, []);

  return <svg className="d3-component" width={400} height={200} ref={d3Container} />;
}

export default GenderDisparity;
