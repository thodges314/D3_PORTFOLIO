import React, { useEffect, useRef, useContext } from 'react';
import * as d3 from 'd3';
import ToolTipContext from '../../../context/ToolTipContext';
import './FilledLineChart.scss';
import { dataFieldsByColumn } from '../../../utils/constants.js';

const HEIGHT = 400;
const WIDTH = 400;
const LEFT_MARGIN = 50;
const BOTTOM_MARGIN = 80;
const RIGHT_MARGIN = 30;
const TOP_MARGIN = 10;
const GRAPH_WIDTH = WIDTH - LEFT_MARGIN - RIGHT_MARGIN;
const GRAPH_HEIGHT = HEIGHT - BOTTOM_MARGIN - TOP_MARGIN;
const GRID_GAP = 20;

const cleanNonAlphaEnums = (str) => str.replace(/[^A-Za-z0-9]/g, '');

const numberAsPercent = (num) => `${(num * 100).toFixed(2)}%`;

const prepData = (data, xAttr, yAttr) =>
  data
    .sort((a, b) => +a['dpa_main.value'] - +b['dpa_main.value'])
    .map((d) => ({ name: d[yAttr], value: +d[xAttr], ...d }));

const colorScale = d3
  .scaleLinear()
  .domain([0, 100, 300])
  .range(['#ff5c39', '#fafafa', '#3782ba'])
  .clamp(true);

const yScale = d3
  .scaleLinear()
  .domain([0, 300])
  .range([GRAPH_HEIGHT, 0])
  .clamp(true);

const xScale = d3.scaleLinear().range([0, GRAPH_WIDTH]);

const splitLabel = (string) =>
  string
    .split(' ')
    .filter((w) => w !== 'a')
    .reduce(
      (acc, _cv, idx, src) =>
        idx % 2 === 0 ? [...acc, src.slice(idx, idx + 2)] : acc,
      []
    )
    .map((pair) => pair.join(' '));

const line = d3
  .line()
  .x((_d, i) => xScale(i))
  .y((d) => yScale(d.value));

const area = d3
  .area()
  .x((_d, i) => xScale(i))
  .y0((d) => yScale(d.value))
  .y1(() => yScale(100));

const roundToTens = (num) => Math.round(num / 10) * 10;

export const FilledLineChart = ({ data, title, subtitle, yAttr, xAttr }) => {
  const svgRef = useRef(null);
  const axisGRef = useRef(null);
  const graphGRef = useRef(null);
  const dotsGRef = useRef(null);
  const toolTipRef = useContext(ToolTipContext);
  const preppedDataRef = useRef([]);

  //tooptip functions
  const moveTooltip = (e, d) => {
    const { clientX, clientY } = e;
    const { scrollX, scrollY } = window;
    const x = clientX + scrollX;
    const y = clientY + scrollY;
    console.log(d);
    // const { value } = d;
    const textArray = [
      '',
      ['Value:', d[dataFieldsByColumn.value]],
      ['Index', Number(d[dataFieldsByColumn.index].toFixed(0))],
      ['Z-Score', Number(d[dataFieldsByColumn.zscore].toFixed(2))],
      [
        'Target Percentage:',
        numberAsPercent(d[dataFieldsByColumn.targetPercentage]),
      ],
      [
        'Reference Percentage',
        numberAsPercent(d[dataFieldsByColumn.referencePercentage]),
      ],
    ];
    const position = { x: roundToTens(x), y: roundToTens(y) };
    toolTipRef.current.moveToolTip(textArray, position, true);
  };

  const hideTooltip = () => toolTipRef.current.hideToolTip();

  // draw axis
  const drawAxis = () => {
    const xAxisGenerator = d3
      .axisBottom(xScale)
      .ticks(preppedDataRef.current.length)
      .tickSize([-GRAPH_HEIGHT + GRID_GAP])
      .tickSizeOuter([0])
      .tickFormat('');

    const yAxisGenerator = d3
      .axisLeft(yScale)
      .tickValues([0, 100, 300])
      .tickSize(-GRAPH_WIDTH, 10)
      .tickSizeOuter(0);

    const xAxis = axisGRef.current
      .append('g')
      .attr('transform', `translate(0, ${GRAPH_HEIGHT})`)
      .call(xAxisGenerator);
    const yAxis = axisGRef.current.append('g').call(yAxisGenerator);

    yAxis.select('.domain').remove();

    yAxis.selectAll('.tick text').attr('class', 'd3-text-primary axis-text');
    yAxis.selectAll('.tick line').attr('class', 'dark-tick-line');
    yAxis.selectAll('.tick line').nodes()[0].remove();
    yAxis.selectAll('.tick line').nodes().reverse()[0].remove();

    xAxis.selectAll('.tick line').attr('class', 'tick-line');
    xAxis
      .selectAll('.tick line')
      .attr('transform', `translate(0, -${GRID_GAP})`);
    xAxis.select('.domain').attr('class', 'x-axis-line');
  };

  const drawXLabels = () => {
    const startLabel = splitLabel(preppedDataRef.current[0].name);
    const endLabel = splitLabel(
      preppedDataRef.current[preppedDataRef.current.length - 1].name
    );
    axisGRef.current
      .selectAll('.x-axis-label-left')
      .data(startLabel)
      .enter()
      .append('text')
      .attr('class', 'd3-text-primary x-axis-label-left')
      .attr('text-anchor', 'start')
      .attr('x', 0)
      .attr('y', (_d, i) => GRAPH_HEIGHT + (1 + i) * 20)
      .text((d) => d);
    axisGRef.current
      .selectAll('.x-axis-label-right')
      .data(endLabel)
      .enter()
      .append('text')
      .attr('class', 'd3-text-primary x-axis-label-right')
      .attr('text-anchor', 'end')
      .attr('x', GRAPH_WIDTH)
      .attr('y', (_d, i) => GRAPH_HEIGHT + (1 + i) * 20)
      .text((d) => d);
  };

  const createAreaGradient = () => {
    const [min, mx] = d3.extent(preppedDataRef.current, (d) => d.value);
    const max = Math.min(mx, 300);
    const cutoff = (max - 100) / (max - min);
    const cutoffPercentile = `${cutoff * 100}%`;
    const areaGradient = d3
      .select(svgRef.current)
      .append('defs')
      .append('linearGradient')
      .attr('id', `area-gradient-${cleanNonAlphaEnums(title)}`)
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    areaGradient
      .selectAll('stop')
      .data([
        { offset: '0%', color: colorScale(300) },
        { offset: cutoffPercentile, color: colorScale(300) },
        { offset: cutoffPercentile, color: colorScale(0) },
        { offset: '100%', color: colorScale(0) },
      ])
      .enter()
      .append('stop')
      .attr('offset', (d) => d.offset)
      .attr('stop-color', (d) => d.color);
  };

  const createLineGradient = () => {
    const [min, max] = d3.extent(preppedDataRef.current, (d) => d.value);
    const cutoff = (max - 100) / (max - min);
    const cutoffPercentile = `${cutoff * 100}%`;
    const lineGradient = d3
      .select(svgRef.current)
      .append('defs')
      .append('linearGradient')
      .attr('id', `line-gradient-${cleanNonAlphaEnums(title)}`)
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    lineGradient
      .selectAll('stop')
      .data([
        { offset: '0%', color: colorScale(max) },
        { offset: cutoffPercentile, color: colorScale(100) },
        { offset: '100%', color: colorScale(min) },
      ])
      .enter()
      .append('stop')
      .attr('offset', (d) => d.offset)
      .attr('stop-color', (d) => d.color);
  };

  const drawArea = () => {
    graphGRef.current
      .append('path')
      .datum(preppedDataRef.current)
      .attr('d', area)
      .style('opacity', 0.4)
      .style('fill', `url(#area-gradient-${cleanNonAlphaEnums(title)})`);
  };

  const drawLine = () => {
    graphGRef.current
      .append('path')
      .datum(preppedDataRef.current)
      .attr('class', 'line')
      .attr('d', line)
      .attr('stroke-width', 2.5)
      .attr('stroke', `url(#line-gradient-${cleanNonAlphaEnums(title)})`);
  };

  const drawDots = () => {
    dotsGRef.current
      .selectAll('.dot')
      .data(preppedDataRef.current)
      .enter()
      .append('circle')
      .attr('class', 'hover-dot')
      .attr('cx', (_d, i) => xScale(i))
      .attr('cy', (d) => yScale(d.value))
      .style('fill', (d) => colorScale(d.value))
      //   .style('fill', (d) => (d.value >= 100 ? colorScale(300) : colorScale(0)))
      .style('fill-opacity', 0.9)
      .on('mouseover', moveTooltip);
  };

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.on('mouseleave', hideTooltip);
    axisGRef.current = svg
      .append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(${LEFT_MARGIN},${TOP_MARGIN})`);
    graphGRef.current = svg
      .append('g')
      .attr('class', 'graph')
      .attr('transform', `translate(${LEFT_MARGIN},${TOP_MARGIN})`);
    dotsGRef.current = svg
      .append('g')
      .attr('class', 'dots')
      .attr('transform', `translate(${LEFT_MARGIN},${TOP_MARGIN})`);

    preppedDataRef.current = prepData(data, xAttr, yAttr);

    if (preppedDataRef.current.length > 0) {
      xScale.domain([0, preppedDataRef.current.length - 1]);
    }

    drawAxis();
    drawXLabels();
    createAreaGradient();
    drawArea();
    createLineGradient();
    drawLine();
    drawDots();
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
