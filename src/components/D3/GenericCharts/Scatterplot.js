import { useD3 } from "../../hooks/useD3";
import React from "react";
import * as d3 from "d3";
import "./scatterplot.css";

function Scatterplot({ data, collapsed }) {
  const ref = useD3(
    (svg) => {
      const element = d3.select("svg");
      // reset SVG size and clean
      element.attr("style", "width: 100%; height: 100%");
      if (!element.empty()) element.selectAll("*").remove();

      const collapsedSizes = {
        height: collapsed ? 8 : 1,
        squareHeight: collapsed ? 6 : 1,
        shrinkPct: collapsed ? 0.92 : 1,
      };
      const margin = collapsed
        ? { top: 50, right: 20, bottom: 30, left: 50 }
        : { top: 50, right: 20, bottom: 30, left: 150 };

      const width =
        element.node().getBoundingClientRect().width * collapsedSizes.shrinkPct;
      const height = element.node().getBoundingClientRect().height;
      //* collapsedSizes.shrinkPct;
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;
      const yValue = (d) => d["ibe_elements.value"];
      const xValue = (d) => d["ibe_elements.ibe_target_count"];
      const sideValue = (d) => d["ibe_elements.ibe_percent_of_total_target"];

      // scales
      const x = d3
        .scaleLinear()
        .domain([0, d3.max(data, xValue) + 50])
        .range([0, innerWidth])
        .nice();

      const y = d3
        .scalePoint()
        .domain(data.map(yValue))
        .range([0, innerHeight / collapsedSizes.height])
        .padding(0.6);

      const side = d3
        .scaleLinear()
        .domain(d3.extent(data, sideValue))
        .range([30, 80]);

      // axes
      const xAxis = d3
        .axisTop(x)
        .tickSize(-innerHeight / collapsedSizes.height)
        .tickPadding(10)
        .ticks(8);

      const yAxis = d3.axisLeft(y).tickSize(-innerWidth);

      svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .attr("class", "x-axis")
        .call(xAxis);

      svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .attr("class", "y-axis")
        .call(yAxis);

      // Add squares
      svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .attr("class", "chart")
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("width", (d) => side(sideValue(d)))
        .attr("height", (d) => side(sideValue(d)) / collapsedSizes.squareHeight)
        .attr("x", (d) => x(xValue(d)))
        .attr("y", (d) => y(yValue(d)))
        .attr("rx", 5)
        .attr("fill", "steelblue");

      // center the squares
      centerSquares();
      if (collapsed) {
        collapse();
      } else {
        uncollapse();
      }
    },
    [data.length, collapsed]
  );

  const centerSquares = () => {
    d3.selectAll("rect").each(function () {
      const height = d3.select(this).attr("height");
      const width = d3.select(this).attr("width");
      const x = d3.select(this).attr("x");
      const y = d3.select(this).attr("y");

      d3.select(this)
        .attr("x", x - width / 2)
        .attr("y", y - height / 2);
    });
  };

  const collapse = () => {
    d3.selectAll(".y-axis text").attr("class", "hidden");
    d3.select("svg").attr("class", "main-svg-collapsed");
  };

  const uncollapse = () => {
    d3.selectAll(".y-axis text").attr("class", "default");
    d3.select("svg").attr("class", "main-svg");
  };

  return <svg className={"main-svg"} ref={ref} />;
}

export default Scatterplot;
