import React from 'react';
import * as d3 from 'd3';
import { useD3 } from '../../../hooks/useD3';
import './IndexBarChart.scss';

const IndexBarChart = ({ data, xAttr, yAttr, margin }) => {
  const ref = useD3(
    (svg) => {
      const element = d3.select(ref.current);
      // reset SVG size and clean
      element.attr('style', 'width: 100%; height: 100%');
      if (!element.empty()) element.selectAll('*').remove();

      const { width, height } = element.node().getBoundingClientRect();
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;
      const xValue = (d) => d[xAttr];
      const yValue = (d) => d[yAttr];

      // scales
      const x = d3
        .scaleLinear()
        .domain([0, d3.max(data, xValue)])
        .range([0, innerWidth])
        .nice();

      const y = d3
        .scaleBand()
        .domain(data.map(yValue))
        .range([0, innerHeight])
        .padding(0.6);

      // axes
      const xAxis = d3
        .axisBottom(x)
        .tickSize(innerHeight)
        .tickPadding(10)
        .ticks(3);

      const yAxis = d3.axisLeft(y).tickPadding(6);

      svg
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .attr('class', 'x-axis')
        .call(xAxis);

      svg
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .attr('class', 'y-axis')
        .call(yAxis);

      svg
        .selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .attr('y', (d) => y(yValue(d)))
        .attr('width', (d) => x(xValue(d)))
        .attr('height', y.bandwidth())
        .attr('fill', 'steelblue');
    },
    [data]
  );

  return <svg className="secondary-svg" ref={ref} />;
};

export default IndexBarChart;
