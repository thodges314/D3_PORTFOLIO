import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const SHAPE_SIZE = 10;
const SQUARE_BASE = SHAPE_SIZE;
const TRIANGLE_SIZE = SHAPE_SIZE ** 2 / 2;
const CIRCLE_RADIUS = SHAPE_SIZE / 2;
const KEY_WIDTH = 80;

const colors = ['#ff5c39', '#3782ba', '#A199A6'];

export const BarChartMultiKey = ({ names }) => {
  const chartRef = useRef(null);
  const svgRef = useRef(null);
  const keysGRef = useRef([]);
  const valueCount = names.length;

  const drawEntry = (index) => {
    if (!svgRef.current) return;
    keysGRef.current[index] = svgRef.current
      .append('g')
      .attr('transform', `translate(${20 + index * KEY_WIDTH},0)`);
    const entry = names[index];
    const color = colors[index % colors.length];

    if (index === 0) {
      keysGRef.current[index]
        .append('rect')
        .attr('x', -SHAPE_SIZE / 2)
        .attr('y', 5)
        .attr('width', SQUARE_BASE)
        .attr('height', SQUARE_BASE)
        .attr('fill', color);
    }
    if (index === 1) {
      const triangle = d3.symbol().type(d3.symbolTriangle).size(TRIANGLE_SIZE);

      keysGRef.current[index]
        .append('path')
        .attr('d', triangle)
        .attr('transform', `translate(0, 11.5)`)
        .attr('fill', colors[index]);
    }
    if (index === 2) {
      keysGRef.current[index]
        .append('circle')
        .attr('cx', 0)
        .attr('cy', 10)
        .attr('r', CIRCLE_RADIUS)
        .attr('fill', colors[index]);
    }
    keysGRef.current[index]
      .append('text')
      .attr('dx', SHAPE_SIZE + 2)
      .attr('dy', '1.1em')
      .attr('fill', '#34769E')
      .style('font-size', '12px')
      .text(entry);
  };

  useEffect(() => {
    if (!chartRef.current) return;

    d3.select(chartRef.current).selectAll('*').remove();

    svgRef.current = d3
      .select(chartRef.current)
      .append('svg')
      .attr('padding', 0)
      .attr('margin', 0)
      .attr('width', '100%')
      .attr('height', 18);
    //   .attr('height', '100%');

    for (let idx = 0; idx < valueCount; idx++) drawEntry(idx);
  }, [names]);

  return <div ref={chartRef} style={{ padding: 0, margin: 0 }}></div>;
};
