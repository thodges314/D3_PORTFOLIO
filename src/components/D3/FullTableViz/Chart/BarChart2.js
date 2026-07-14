import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const cappedValue = (v) => (v > 400 ? 410 : v);

const colorScale = d3
  .scaleLinear()
  .domain([0, 100, 300])
  .range(['#ff5c39', '#fafafa', '#3782ba'])
  .clamp(true);

export const BarChart = ({ value, xScale }) => {
  const chartRef = useRef(null);

  const drawChart = () => {
    if (!chartRef.current) return;

    const cellWidth = d3
      .select(chartRef.current)
      .node()
      .getBoundingClientRect().width;

    xScale.range([0, cellWidth - 50]);
    const cellHeight = 20;
    d3.select(chartRef.current).selectAll('*').remove();
    const svg = d3
      .select(chartRef.current)
      .append('svg')
      .attr('width', `${cellWidth - 20}px`)
      .attr('height', cellHeight)
      .attr('padding', 0)
      .attr('margin', 0);

    svg
      .append('line')
      .style('stroke', '#f3f3f3')
      .style('stroke-width', '1px')
      .style('stroke-linecap', 'round')
      .attr('x1', 0)
      .attr('y1', cellHeight / 2)
      .attr('x2', xScale(400) + 20)
      .attr('y2', cellHeight / 2);

    const gBar = svg.append('g');

    //  for linear gradient
    const defs = svg.append('defs');
    const lg = defs
      .append('linearGradient')
      .attr('id', 'Gradient2')
      .attr('x1', 0)
      .attr('x2', 1)
      .attr('y1', 0)
      .attr('y2', 0);
    lg.append('stop').attr('offset', '90%').attr('stop-color', colorScale(400));
    lg.append('stop').attr('offset', '100%').attr('stop-color', 'white');
    gBar
      .append('rect')
      .attr('x', () => xScale(Math.min(100, cappedValue(value))) + 12)
      .attr('width', () =>
        Math.abs(xScale(cappedValue(value)) - xScale(100)) === 0
          ? 1
          : Math.abs(xScale(cappedValue(value)) - xScale(100))
      )
      .attr('height', '75%')
      .attr('fill', () =>
        value > 400 ? 'url(#Gradient2)' : colorScale(value)
      );

    gBar
      .append('text')
      .attr('width', 20)
      .attr('height', 20)
      .attr('dx', () => {
        let offset = 14;
        offset = cappedValue(value) >= 100 ? 14 : -4;
        if (cappedValue(value) < 10) offset = -2;
        return xScale(cappedValue(value)) + offset;
      })
      .attr('dy', '1.1em')
      .attr('fill', '#34769E')
      .style('font-size', '12px')
      .text(value);

    svg
      .append('line')
      .style('stroke', '#34769E')
      .style('stroke-width', '1.5px')
      .style('stroke-dasharray', '4')
      .style('stroke-linecap', 'round')
      .attr('x1', xScale(100) + 12)
      .attr('y1', 0)
      .attr('x2', xScale(100) + 12)
      .attr('y2', cellHeight);
  };

  useEffect(() => drawChart(), [value, xScale]);

  window.addEventListener('resize', drawChart);

  return <div ref={chartRef}></div>;
};
