import React, { useEffect, useRef, useContext } from 'react';
import * as d3 from 'd3';
import ToolTipContext from '../../../context/ToolTipContext';
import './FilledLineChartMultipleDPA.scss';
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

const SHAPE_SIZE = 10;
const SQUARE_BASE = SHAPE_SIZE;
const TRIANGLE_SIZE = SHAPE_SIZE ** 2 / 2;
const CIRCLE_RADIUS = SHAPE_SIZE / 2;
const KEY_WIDTH = 80;

const colors = ['#ff5c39', '#3782ba', '#A199A6'];
const shapes = ['square', 'triangle', 'circle'];

const cleanNonAlphaEnums = (str) => str.replace(/[^A-Za-z0-9]/g, '');

const numberAsPercent = (num) => `${(num * 100).toFixed(2)}%`;

const uniqueChartId = (data) =>
  `${cleanNonAlphaEnums(
    data[0][dataFieldsByColumn.category]
  )}-${cleanNonAlphaEnums(
    data[0][dataFieldsByColumn.element]
  )}-${cleanNonAlphaEnums(
    data[0][dataFieldsByColumn.elementCode]
  )}-${cleanNonAlphaEnums(data[0][dataFieldsByColumn.subPage])}`;

const getDpaNames = (data, xAttr) => Object.keys(data[0][xAttr]);

const prepData = (data, dpaNames, xAttr, yAttr) => {
  const objectKeys = Object.keys(data[0]).filter(
    (key) => typeof data[0][key] === 'object' && data[0][key] !== null
  );
  const sortedData = data.sort(
    (a, b) => +a['dpa_main.value'] - +b['dpa_main.value']
  );
  return dpaNames.reduce((acc, dpaName, idx) => {
    acc[dpaName] = sortedData.map((d) => {
      const returnObject = {
        name: d[yAttr],
        value: d[xAttr][dpaName],
        dpaName: dpaName,
        ...d,
      };
      objectKeys.forEach((key) => {
        returnObject[key] = d[key][dpaName];
      });
      return returnObject;
    });
    return acc;
  }, {});
};

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

const roundToTens = (num) => Math.round(num / 10) * 10;

export const FilledLineChartMultipleDPA = ({
  data,
  title,
  subtitle,
  yAttr,
  xAttr,
}) => {
  const svgRef = useRef(null);
  const axisGRef = useRef(null);
  const graphGRef = useRef(null);
  const dotsGRef = useRef(null);
  const keyDivRef = useRef(null);
  const keySvgRef = useRef(null);
  const keysGRef = useRef([]);
  const toolTipRef = useContext(ToolTipContext);
  const preppedDataRef = useRef({});
  const dpaNamesRef = useRef([]);

  //tooptip functions
  const moveTooltip = (e, d) => {
    const { clientX, clientY } = e;
    const { scrollX, scrollY } = window;
    const x = clientX + scrollX;
    const y = clientY + scrollY;
    console.log(d);
    const { dpaName } = d;
    const textArray = [
      dpaName,
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
    const prototype = Object.values(preppedDataRef.current)[0];
    const startLabel = splitLabel(prototype[0].name);
    const endLabel = splitLabel(prototype[prototype.length - 1].name);
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

  const drawLine = (data, color) => {
    graphGRef.current
      .append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('d', line)
      .attr('stroke-width', 1.5)
      .attr('stroke', color);
  };

  const drawDots = (data, color, shape) => {
    const chartId = uniqueChartId(data);
    if (shape === 'square') {
      dotsGRef.current
        .selectAll(`.square-${chartId}`)
        .data(data)
        .enter()
        .append('rect')
        .attr('class', `square-${chartId}`)
        .attr('x', (_d, i) => xScale(i) - SHAPE_SIZE / 2)
        .attr('y', (d) => yScale(d.value) - SHAPE_SIZE / 2)
        .attr('width', SQUARE_BASE)
        .attr('height', SQUARE_BASE)
        .style('fill', color)
        .on('mouseover', moveTooltip);
    } else if (shape === 'triangle') {
      const triangle = d3.symbol().type(d3.symbolTriangle).size(TRIANGLE_SIZE);
      dotsGRef.current
        .selectAll(`.triangle-${chartId}`)
        .data(data)
        .enter()
        .append('path')
        .attr('d', triangle)
        .attr('class', `triangle-${chartId}`)
        .attr(
          'transform',
          (d, i) => `translate(${xScale(i)}, ${yScale(d.value)})`
        )
        .attr('fill', color)
        .on('mouseover', moveTooltip);
    } else {
      dotsGRef.current
        .selectAll(`.circle-${chartId}`)
        .data(data)
        .enter()
        .append('circle')
        .attr('class', `circle-${chartId}`)
        .attr('cx', (_d, i) => xScale(i))
        .attr('cy', (d) => yScale(d.value))
        .style('fill', color)
        .attr('r', CIRCLE_RADIUS)
        .on('mouseover', moveTooltip);
    }
  };

  const drawKeyEntry = (idx) => {
    if (!svgRef.current) return;
    keysGRef.current[idx] = keySvgRef.current
      .append('g')
      .attr('transform', `translate(${20 + idx * KEY_WIDTH},0)`);
    const entry = dpaNamesRef.current[idx];
    const color = colors[idx % colors.length];

    if (idx === 0) {
      keysGRef.current[idx]
        .append('rect')
        .attr('x', -SHAPE_SIZE / 2)
        .attr('y', 5)
        .attr('width', SQUARE_BASE)
        .attr('height', SQUARE_BASE)
        .attr('fill', color);
    }
    if (idx === 1) {
      const triangle = d3.symbol().type(d3.symbolTriangle).size(TRIANGLE_SIZE);

      keysGRef.current[idx]
        .append('path')
        .attr('d', triangle)
        .attr('transform', `translate(0, 11.5)`)
        .attr('fill', colors[idx]);
    }
    if (idx === 2) {
      keysGRef.current[idx]
        .append('circle')
        .attr('cx', 0)
        .attr('cy', 10)
        .attr('r', CIRCLE_RADIUS)
        .attr('fill', colors[idx]);
    }
    keysGRef.current[idx]
      .append('text')
      .attr('dx', SHAPE_SIZE + 2)
      .attr('dy', '1.1em')
      .attr('fill', '#34769E')
      .style('font-size', '12px')
      .text(entry);
  };

  const drawKeys = () => {
    d3.select(keyDivRef.current).selectAll('*').remove();
    keySvgRef.current = d3
      .select(keyDivRef.current)
      .append('svg')
      .attr('padding', 0)
      .attr('margin', 0)
      .attr('width', '100%')
      .attr('height', 18);

    for (let idx = 0; idx < dpaNamesRef.current.length; idx++)
      drawKeyEntry(idx);
  };

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.on('mouseleave', hideTooltip);
    svg.selectAll('g').remove();
    axisGRef.current = svg
      .append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(${LEFT_MARGIN},${TOP_MARGIN + 30})`);
    graphGRef.current = svg
      .append('g')
      .attr('class', 'graph')
      .attr('transform', `translate(${LEFT_MARGIN},${TOP_MARGIN + 30})`);
    dotsGRef.current = svg
      .append('g')
      .attr('class', 'dots')
      .attr('transform', `translate(${LEFT_MARGIN},${TOP_MARGIN + 30})`);

    dpaNamesRef.current = getDpaNames(data, xAttr);
    console.log(dpaNamesRef.current);

    preppedDataRef.current = prepData(data, dpaNamesRef.current, xAttr, yAttr);

    if (data.length > 0) {
      xScale.domain([0, data.length - 1]);
    }

    drawAxis();
    drawXLabels();

    dpaNamesRef.current.forEach((name, i) => {
      drawLine(preppedDataRef.current[name], colors[i]);
      drawDots(preppedDataRef.current[name], colors[i], shapes[i]);
    });

    drawKeys();
  }, [data]);

  return (
    <div>
      <h3 className="text-primary" id="viz-title">
        {title}
      </h3>
      <p className="text-primary" id="viz-subtitle">
        {subtitle}
      </p>
      <div ref={keyDivRef} style={{ padding: 0, margin: 0 }}></div>
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
