// spider chart, spider chart, doin the things a spider chart can.
import React, { useEffect, useRef, useContext } from 'react';
import * as d3 from 'd3';
import ToolTipContext from '../../../context/ToolTipContext';
import './SpiderChart.scss';

const width = 600;
const height = 600;

const prepData = (data, xAttr, yAttr) =>
  data
    .map((d) => ({ name: d[yAttr], value: d[xAttr] }))
    .filter((d) => d.value !== null)
    .sort((a, b) => a.value - b.value)
    .reduce((acc, cv, i) => {
      if (i % 2 === 0) {
        acc.push(cv);
      } else {
        acc.unshift(cv);
      }
      return acc;
    }, []);

const trimmedText = (text) =>
  text.length > 10 ? `${text.substring(0, 7)}...` : text;

const line = d3
  .line()
  .x((d) => d.x)
  .y((d) => d.y);

const roundToTens = (num) => Math.round(num / 10) * 10;

export const SpiderChart = ({ data, title, subtitle, yAttr, xAttr }) => {
  const svgRef = useRef(null);
  const axisGRef = useRef(null);
  const graphGRef = useRef(null);
  const dotsGRef = useRef(null);
  const scaleRef = useRef(null);
  const deltaXRef = useRef(null);
  const deltaThetaRef = useRef(null);
  const preppedDataRef = useRef(null);
  const toolTipRef = useContext(ToolTipContext);

  // utility functions

  const valueToCoords = (value, angle) => ({
    x: width / 2 + scaleRef.current(value) * Math.cos(angle + Math.PI / 2),
    y: height / 2 - scaleRef.current(value) * Math.sin(angle + Math.PI / 2),
  });

  const makeLoopPathCoords = (distance) => {
    const coords = [];
    for (let theta = 0; theta <= Math.PI * 2; theta += deltaThetaRef.current) {
      coords.push(valueToCoords(distance, theta));
    }
    return coords;
  };

  const makeGraphPathCoords = () => {
    const coords = preppedDataRef.current.map((d, i) =>
      valueToCoords(d.value, i * deltaThetaRef.current)
    );
    coords.push(valueToCoords(preppedDataRef.current[0].value, 0));
    return coords;
  };

  //tooptip functions
  const moveTooltip = (e, d) => {
    const { clientX, clientY } = e;
    const { scrollX, scrollY } = window;
    const x = clientX + scrollX;
    const y = clientY + scrollY;
    const { name, value } = d;
    const textArray = [name, Number(value).toFixed(0)];
    const position = { x: roundToTens(x), y: roundToTens(y) };
    toolTipRef.current.moveToolTip(textArray, position);
  };

  const hideTooltip = () => toolTipRef.current.hideToolTip();

  //drawing/updating functions
  const drawGrid = () => {
    const maxValue = scaleRef.current.domain()[1];

    // spokes
    axisGRef.current
      .selectAll('line')
      .data(preppedDataRef.current)
      .enter()
      .append('line')
      .attr('x1', width / 2)
      .attr('y1', height / 2)
      .attr(
        'x2',
        (_d, i) => valueToCoords(maxValue, i * deltaThetaRef.current).x
      )
      .attr(
        'y2',
        (_d, i) => valueToCoords(maxValue, i * deltaThetaRef.current).y
      )
      .attr('stroke', '#B1B0AE');

    //labels
    axisGRef.current
      .selectAll('.axis-label')
      .data(preppedDataRef.current)
      .enter()
      .append('text')
      .attr('class', 'axis-label')
      .attr(
        'x',
        (_d, i) => valueToCoords(1.2 * maxValue, i * deltaThetaRef.current).x
      )
      .attr(
        'y',
        (_d, i) => valueToCoords(1.2 * maxValue, i * deltaThetaRef.current).y
      )
      .text((d) => trimmedText(d.name))
      .attr('font-size', '10pt')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#64615d')
      .attr('opacity', 0)
      .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .attr('opacity', 1);

    //loops
    const levels = [];
    for (let i = deltaXRef.current; i <= maxValue; i += deltaXRef.current) {
      levels.push(i);
    }
    axisGRef.current
      .selectAll('.ring')
      .data(levels)
      .enter()
      .append('path')
      .attr('class', 'ring')
      .datum((d) => makeLoopPathCoords(d))
      .attr('d', line)
      .attr('stroke', '#B1B0AE')
      .attr('stroke-width', 1)
      .attr('fill', 'none')
      .attr('opacity', 0)
      .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .attr('opacity', 1);

    axisGRef.current
      .selectAll('.level-label')
      .data(levels)
      .enter()
      .append('text')
      .attr('class', 'levels-label')
      .attr('x', () => width / 2)
      .attr('y', (d) => valueToCoords(d, 0).y - 4)
      .text((d) => trimmedText(d))
      .attr('font-size', '12pt')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#64615d')
      .attr('opacity', 0)
      .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .attr('opacity', 1);

    axisGRef.current
      .append('path')
      .attr('class', 'hundred-ring')
      .datum(() => makeLoopPathCoords(100))
      .attr('d', line)
      .attr('stroke', '#64615d')
      .attr('stroke-width', 1)
      .attr('fill', 'none')
      .attr('stroke-dasharray', '5 5')
      .attr('opacity', 0)
      .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .attr('opacity', 1);
  };

  const drawWeb = () => {
    graphGRef.current
      .append('path')
      .attr('d', line(makeGraphPathCoords()))
      .attr('stroke', '#386981')
      .attr('stroke-width', 5)
      .attr('fill', '#C4D3DA')
      .attr('fill-opacity', 0.6)
      .attr('opacity', 0)
      .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .attr('opacity', 0)
      .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .attr('opacity', 1);
  };

  const drawDots = () => {
    // draw dots
    dotsGRef.current
      .selectAll('.draw-dots')
      .data(preppedDataRef.current)
      .enter()
      .append('circle')
      .attr('class', 'draw-dots')
      .attr('cx', (d, i) => valueToCoords(d.value, i * deltaThetaRef.current).x)
      .attr('cy', (d, i) => valueToCoords(d.value, i * deltaThetaRef.current).y)
      .attr('r', 5)
      .attr('fill', '#00416a')
      .on('mouseover', (e, d) => {
        d3.selectAll('.draw-dots')
          .transition()
          .duration(100)
          .ease(d3.easeLinear)
          .attr('r', 5);
        d3.select(e.target)
          .transition()
          .duration(200)
          .ease(d3.easeLinear)
          .attr('r', 10);
        moveTooltip(e, d);
      })
      .attr('opacity', 0)
      .transition()
      .duration(1000)
      .ease(d3.easeLinear)
      .attr('opacity', 0)
      .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .attr('opacity', 1);

    d3.select(svgRef.current).on('mouseleave', () => {
      d3.selectAll('.draw-dots')
        .transition()
        .duration(100)
        .ease(d3.easeLinear)
        .attr('r', 5);
      hideTooltip();
    });
  };

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    axisGRef.current = svg.append('g').attr('class', 'axis');
    graphGRef.current = svg.append('g').attr('class', 'graph');
    dotsGRef.current = svg.append('g').attr('class', 'dots');

    preppedDataRef.current = prepData(data, xAttr, yAttr);

    deltaThetaRef.current = (2 * Math.PI) / preppedDataRef.current.length;
    if (preppedDataRef.current.length > 0) {
      scaleRef.current = d3
        .scaleLinear()
        .domain([0, d3.max(preppedDataRef.current, (d) => d.value)])
        .range([0, 215])
        .nice();

      deltaXRef.current = scaleRef.current.domain()[1] / 5;

      drawGrid();
      drawWeb();
      drawDots();
    }
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
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="100%"
        style={{
          position: 'relative',
          top: '-8%',
        }}
      />
    </div>
  );
};
