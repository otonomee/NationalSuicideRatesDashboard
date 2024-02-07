import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function GenderComparison() {
  const d3Container = useRef(null);

  useEffect(() => {
    if (d3Container.current) {
      d3.json("https://suicide-rate-api-2eb3035f31b7.herokuapp.com/api/suicide_rates/gender_comparison").then((data) => {
        const svg = d3.select(d3Container.current);

        const width = d3Container.current.clientWidth; // Set width to width of container
        const height = 250;
        const margin = { top: 20, right: 50, bottom: 30, left: 50 };

        const x = d3
          .scaleLinear()
          .domain(d3.extent(data, (d) => d[0]))
          .range([0, width - margin.left - margin.right]);

        const y = d3
          .scaleLinear()
          .domain([0, d3.max(data, (d) => Math.max(d[1], d[2]))])
          .range([height - margin.top - margin.bottom, 0]);

        const lineMale = d3
          .line()
          .x((d) => x(d[0]))
          .y((d) => y(d[1]));

        const lineFemale = d3
          .line()
          .x((d) => x(d[0]))
          .y((d) => y(d[2]));

        const g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        g.append("g")
          .attr("transform", "translate(0," + (height - margin.top - margin.bottom) + ")")
          .call(
            d3
              .axisBottom(x)
              .tickValues(d3.range(Math.ceil(data[0][0] / 10) * 10, data[data.length - 1][0], 10)) // Set ticks to increment by 10
              .tickFormat(d3.format(".0f"))
          )
          .selectAll("text") // Set axis font size to 14px
          .style("font-size", "14px");

        g.append("g")
          .call(d3.axisLeft(y))
          .selectAll("text") // Set axis font size to 14px
          .style("font-size", "14px");

        g.append("path").datum(data).attr("fill", "none").attr("stroke", "blue").attr("stroke-width", 2.5).attr("d", lineMale);

        g.append("path").datum(data).attr("fill", "none").attr("stroke", "pink").attr("stroke-width", 2.5).attr("d", lineFemale);

        const color = d3.scaleOrdinal().domain(["Male", "Female"]).range(["blue", "pink"]);

        const legend = svg
          .append("g")
          .attr("class", "legend")
          .attr("transform", "translate(" + width / 2 + "," + margin.top / 500 + ")"); // Move legend to top

        const legendEntries = legend.selectAll(".legendEntry").data(color.domain()).enter().append("g").attr("class", "legendEntry");

        legendEntries
          .append("rect")
          .attr("x", function (d, i) {
            return (i - color.domain().length / 2) * 60;
          })
          .attr("y", 3) // Adjust vertical alignment of the square
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", color);

        legendEntries
          .append("text")
          .attr("x", function (d, i) {
            return (i - color.domain().length / 2) * 60 + 28; // Add horizontal space between the square and the text
          })
          .attr("y", 12) // Adjust vertical alignment of the text
          .attr("dy", ".35em")
          .style("text-anchor", "start")
          .style("font-size", "13px") // Make text smaller
          .text(function (d) {
            return d;
          });
      });
    }
  }, []);

  return <svg className="d3-component" width="100%" height={250} ref={d3Container} />; // Increase SVG height
}

export default GenderComparison;
