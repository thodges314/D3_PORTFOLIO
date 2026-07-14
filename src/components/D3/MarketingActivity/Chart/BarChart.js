import * as d3 from "d3";

export const BarChart = (currTd, obj, labelData, xScale, tooltip) => {
  const animDur = 250;
  const animDelay = 2;
  const animTextDelay = 1.2;
  const currTdSvgContainer = currTd
    .append("div")
    .attr("class", "bar-container")
    // Sets the width of bar container scaled to the maximum percent minus the label width
    .style("width", () => xScale(labelData) + "px");

  const currSvg = currTdSvgContainer
    .append("svg")
    .style("height", "100%")
    .style("width", "100%");
  const currBar = currSvg
    .append("rect")
    .style("fill", () => obj.color)
    .attr("height", "100%")
    .attr("width", "0%");

  currBar
    .transition()
    .delay(animDur * animDelay)
    .duration(animDur)
    .attr("width", "100%");

  const currTdLabel = currTd
    .append("div")
    .attr("class", "bar-label")
    .text(labelData.toFixed(1) + "%")
    .style("opacity", 0);

  currTdLabel
    .transition()
    .delay(animTextDelay * animDur * animDelay)
    .duration(animDur / 2)
    .style("opacity", 1);
};
