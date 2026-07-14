import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const cappedValue = (v) => (v > 400 ? 410 : v);
const SHAPE_SIZE = 10;
const SQUARE_BASE = SHAPE_SIZE;
const TRIANGLE_SIZE = SHAPE_SIZE ** 2 / 2;
const CIRCLE_RADIUS = SHAPE_SIZE / 2;
// gotta use trial and error for the y-shift values

const colors = ['#ff5c39', '#3782ba', '#A199A6'];

export const BarChartMulti = ({ value, xScale }) => {
  const chartRef = useRef(null);
  const shapesGRef = useRef(null);
  const values = Object.values(value).map((v) => Number(v).toFixed(0));
  const valueCount = values.length;
  console.log(values);

  const drawShape = (index) => {
    if (!shapesGRef.current) return;
    if (index === 0) {
      shapesGRef.current
        .append('rect')
        .attr('x', xScale(cappedValue(values[index])) - SHAPE_SIZE / 2)
        .attr('y', 5)
        .attr('width', SQUARE_BASE)
        .attr('height', SQUARE_BASE)
        .attr('fill', colors[index]);
    }
    if (index === 1) {
      const triangle = d3.symbol().type(d3.symbolTriangle).size(TRIANGLE_SIZE);
      shapesGRef.current
        .append('path')
        .attr('d', triangle)
        .attr(
          'transform',
          `translate(${xScale(cappedValue(values[index]))}, 11.5)`
        )
        .attr('fill', colors[index]);
    }
    if (index === 2) {
      shapesGRef.current
        .append('circle')
        .attr('cx', xScale(cappedValue(values[index])))
        .attr('cy', 10)
        .attr('r', CIRCLE_RADIUS)
        .attr('fill', colors[index]);
    }
  };

  const drawChart = () => {
    if (!chartRef.current) return;

    const cellWidth = d3
      .select(chartRef.current)
      .node()
      .getBoundingClientRect().width;

    xScale.range([6, cellWidth - 6]);
    const cellHeight = 20;
    d3.select(chartRef.current).selectAll('*').remove();
    const svg = d3
      .select(chartRef.current)
      .append('svg')
      .attr('width', cellWidth)
      .attr('height', cellHeight)
      .attr('padding', 0)
      .attr('margin', 0)
      .attr('transform', `translate(-4, 0)`);

    svg
      .append('line')
      .style('stroke', '#f3f3f3')
      .style('stroke-width', '1px')
      .style('stroke-linecap', 'round')
      .attr('x1', xScale(0))
      .attr('y1', cellHeight / 2)
      .attr('x2', xScale(400))
      .attr('y2', cellHeight / 2);

    svg
      .append('line')
      .style('stroke', '#34769E')
      .style('stroke-width', '1.5px')
      .style('stroke-dasharray', '4')
      .style('stroke-linecap', 'round')
      .attr('x1', xScale(100))
      .attr('y1', 0)
      .attr('x2', xScale(100))
      .attr('y2', cellHeight);

    shapesGRef.current = svg.append('g');

    for (let idx = 0; idx < valueCount; idx++) drawShape(idx);
  };

  useEffect(() => drawChart(), [value, xScale]);

  window.addEventListener('resize', drawChart);

  return <div ref={chartRef}></div>;
};
