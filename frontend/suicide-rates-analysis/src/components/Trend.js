import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function SuicideRatesTrend() {
  const d3Container = useRef(null);
  const tooltip = useRef(null);

  useEffect(() => {
    if (d3Container.current) {
      d3.json("https://suicide-rate-api-2eb3035f31b7.herokuapp.com/api/suicide_rates/trend").then((data) => {
        const svg = d3.select(d3Container.current);

        const margin = { top: 20, right: 20, bottom: 30, left: 50 };
        const width = d3Container.current.clientWidth - margin.left - margin.right;
        const height = 250 - margin.top - margin.bottom;

        svg.attr("width", width + margin.left + margin.right);

        const x = d3
          .scaleLinear()
          .domain([d3.min(data, (d) => d[0]), 2018])
          .range([0, width]);

        const y = d3
          .scaleLinear()
          .domain([0, d3.max(data, (d) => d[1])])
          .range([height, 0]);

        const g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        g.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x).ticks(8).tickFormat(d3.format("d")))
          .selectAll("text")
          .style("font-size", "14px");

        g.append("g")
          .call(d3.axisLeft(y).tickFormat((d) => `${d}%`))
          .selectAll("text")
          .style("font-size", "14px");

        const line = g
          .append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-width", 3.5)
          .attr(
            "d",
            d3
              .line()
              .x((d) => x(d[0]))
              .y((d) => y(d[1]))
          );

        line
          .on("mouseover", (event, d) => {
            tooltip.current.style.display = "block";
            tooltip.current.innerHTML = `Year: ${d[0]}, Value: ${d[1]}%`;
          })
          .on("mousemove", (event, d) => {
            tooltip.current.style.left = event.pageX + "px";
            tooltip.current.style.top = event.pageY + "px";
          })
          .on("mouseout", () => {
            tooltip.current.style.display = "none";
          });
      });
    }
  }, []);

  return (
    <div>
      <svg className="d3-component" width="100%" height={300} ref={d3Container} />
      <div
        ref={tooltip}
        style={{
          position: "absolute",
          display: "none",
          backgroundColor: "black",
          color: "white",
          padding: "5px",
        }}
      />
    </div>
  );
}

export default SuicideRatesTrend;
