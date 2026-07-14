// spider chart, spider chart, doin the things a spider chart can.
import React, { useEffect, useRef, useContext } from 'react';
import * as d3 from 'd3';
import ToolTipContext from '../../../context/ToolTipContext';
import './DoughnutChart.scss';

const WIDTH = 600;
const HEIGHT = 600;
const MARGIN = 50;
const RADIUS = Math.min(WIDTH, HEIGHT) / 2 - MARGIN;

const prepData = (data, xAttr, yAttr) =>
  data
    .map((d) => ({ name: d[yAttr], value: d[xAttr] }))
    .filter((d) => d.value !== null)
    .sort((a, b) => a.value - b.value);

const pieGenerator = d3.pie().value((d) => parseFloat(d.value));

const arcGenerator = d3
  .arc()
  .innerRadius(RADIUS * 0.4)
  .outerRadius(RADIUS * 0.7);

const labelArcGenerator = d3
  .arc()
  .innerRadius(RADIUS * 0.8)
  .outerRadius(RADIUS * 0.8);

const hoverArcGenerator = d3
  .arc()
  .innerRadius(RADIUS * 0.4)
  .outerRadius(RADIUS * 0.77);

const trimmedText = (text) =>
  text.length > 10 ? text.substring(0, 7) + '...' : text;

export const DoughnutChart = ({ data, title, subtitle, yAttr, xAttr }) => {
  const svgRef = useRef(null);
  const chartGRef = useRef(null);
  const labelsGRef = useRef(null);
  const preppedDataRef = useRef(null);
  const colorPaletteRef = useRef(null);
  const toolTipRef = useContext(ToolTipContext);

  //tooptip functions
  const moveTooltip = (e, d) => {
    const { clientX, clientY } = e;
    const { scrollX, scrollY } = window;
    const x = clientX + scrollX;
    const y = clientY + scrollY;
    const {
      data: { name },
      value,
    } = d;
    const textArray = [name, Number(value).toFixed(0)];
    const position = { x: x, y: y };
    toolTipRef.current.moveToolTip(textArray, position);
  };

  const hideTooltip = () => toolTipRef.current.hideToolTip();

  const generatePalette = (data) => {
    colorPaletteRef.current = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range(['#cccccc', '#185482']);
  };

  const drawChart = () =>
    chartGRef.current
      .selectAll('path')
      .data(preppedDataRef.current)
      .enter()
      .append('path')
      .attr('d', arcGenerator)
      .attr('fill', (_d, i) => colorPaletteRef.current(i))
      .attr('stroke', 'white')
      .style('stroke-width', 2)
      .attr('opacity', 0.8)
      .on('mouseover', (e, d) => {
        d3.select(e.target)
          .transition()
          .duration(200)
          .attr('d', hoverArcGenerator);
        moveTooltip(e, d);
      })
      .on('mouseout', (e, d) => {
        d3.select(e.target).transition().duration(200).attr('d', arcGenerator);
        hideTooltip();
      });

  const drawLabels = () => {
    labelsGRef.current
      .selectAll('polyline')
      .data(preppedDataRef.current)
      .enter()
      .append('polyline')
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .style('fill', 'none')
      .attr('points', (d) => {
        const posA = arcGenerator.centroid(d);
        const posB = labelArcGenerator.centroid(d);
        const posC = labelArcGenerator.centroid(d);
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        posC[0] = RADIUS * 0.8 * (midAngle < Math.PI ? 1 : -1);
        return [posA, posB, posC];
      });

    labelsGRef.current
      .selectAll('text')
      .data(preppedDataRef.current)
      .enter()
      .append('text')
      .text((d) => trimmedText(d.data.name))
      .attr('transform', (d) => {
        const pos = labelArcGenerator.centroid(d);
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = RADIUS * 0.82 * (midAngle < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .style('text-anchor', (d) => {
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return midAngle < Math.PI ? 'start' : 'end';
      });
  };

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    chartGRef.current = svg
      .append('g')
      .attr('class', 'chartG')
      .attr('transform', `translate(${WIDTH / 2}, ${HEIGHT / 2})`);
    labelsGRef.current = svg
      .append('g')
      .attr('class', 'labels-g')
      .attr('transform', `translate(${WIDTH / 2}, ${HEIGHT / 2})`);

    preppedDataRef.current = pieGenerator(prepData(data, xAttr, yAttr));

    generatePalette(data);
    drawChart();
    drawLabels();
  }, [data]);

  return (
    <div>
      <h3 className="text-primary" id="viz-title">
        {title}
      </h3>
      <p className="text-primary" id="viz-subtitle">
        {subtitle}
      </p>
      <svg
        ref={svgRef}
        preserveAspectRatio="xMidYMid meet"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width="100%"
        height="100%"
        style={{
          position: 'relative',
          top: '-8%',
        }}
      ></svg>
    </div>
  );
};
