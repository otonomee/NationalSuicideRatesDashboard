import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function RaceComparison() {
  const d3Container = useRef(null);

  useEffect(() => {
    if (d3Container.current) {
      fetch("https://suicide-rate-api-2eb3035f31b7.herokuapp.com/api/suicide_rates/race_comparison")
        .then((response) => response.json())
        .then((data) => {
          const svg = d3.select(d3Container.current);

          const margin = { top: 20, right: 20, bottom: 40, left: 40 };
          const width = d3Container.current.clientWidth - margin.left - margin.right;
          const height = d3Container.current.clientHeight - margin.top - margin.bottom;

          const g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          const x = d3
            .scaleLinear()
            .domain(d3.extent(data, (d) => d[1]))
            .range([0, width]);

          const y = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d[2])])
            .range([height * 0.8, 0]); // compress the chart vertically by 20%

          data.sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]));

          const nestedData = Array.from(d3.group(data, (d) => d[0]));
          const color = d3.scaleOrdinal([...d3.schemeTableau10, ...d3.schemeSet3]);

          const line = d3
            .line()
            .defined((d) => d[2] !== null)
            .x((d) => x(d[1]))
            .y((d) => y(d[2]));

          nestedData.forEach(([key, values]) => {
            g.append("path").datum(values).attr("fill", "none").attr("stroke", color(key)).attr("stroke-width", 1.5).attr("d", line);
          });

          g.append("g")
            .attr("transform", "translate(0," + height * 0.8 + ")")
            .call(d3.axisBottom(x).tickFormat(d3.format("")))
            .selectAll("text")
            .style("font-size", "14px"); // set the font size of the x-axis to 14px

          g.append("g")
            .call(d3.axisLeft(y).tickFormat((d) => d + "%")) // express the y-axis as a percentage
            .selectAll("text")
            .style("font-size", "14px"); // set the font size of the y-axis to 14px

          g.append("g").call(d3.axisLeft(y));

          const legendEntryWidth = 220;
          const legend = g.append("g").attr("class", "legend");

          const legendEntriesPerRow = 2;
          const legendEntryHeight = 20;

          const legendEntries = legend
            .selectAll(".legendEntry")
            .data(color.domain())
            .enter()
            .append("g")
            .attr("class", "legendEntry")
            .attr("transform", function (d, i) {
              const column = i % legendEntriesPerRow;
              const row = Math.floor(i / legendEntriesPerRow);
              return "translate(" + column * legendEntryWidth + "," + row * legendEntryHeight + ")";
            });

          legendEntries.append("rect").attr("width", 10).attr("height", 10).style("fill", color);

          legendEntries
            .append("text")
            .attr("x", 14)
            .attr("y", 5)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .style("font-size", "12px")
            .text(function (d) {
              return d;
            });
          const legendWidth = legendEntriesPerRow * legendEntryWidth;
          legend.attr("transform", "translate(" + (width / 2 - legendWidth / 2) + ",-20)");
          //   const legendWidth = color.domain().length * legendEntryWidth;
          //   legend.attr("transform", "translate(" + (width / 2 - legendWidth / 2) + ",0)");

          //   const legendWidth = color.domain().length * legendEntryWidth;
          //   legend.attr("transform", "translate(" + (width / 2 - legendWidth / 2) + ",0)");
        });
    }
  }, []);

  return <svg className="d3-component" width="100%" height="100%" ref={d3Container} />;
}

export default RaceComparison;
