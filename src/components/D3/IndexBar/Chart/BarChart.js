import * as d3 from 'd3';

const colorScale = d3
  .scaleLinear()
  .domain([0, 100, 300])
  .range(['#ff5c39', '#fafafa', '#3782ba'])
  .clamp(true);

export const BarChart = (currTd, value, xScale) => {
  // eslint-disable-next-line no-underscore-dangle
  const cellWidth = currTd._groups[0][0].clientWidth;
  // eslint-disable-next-line no-underscore-dangle
  const cellHeight = currTd._groups[0][0].clientHeight;
  const cappedValue = value > 300 ? 310 : value;
  xScale.range([0, cellWidth]);
  const svg = currTd.append('svg').attr('width', '100%').attr('height', '100%');

  svg
    .append('line')
    .style('stroke', '#f3f3f3')
    .style('stroke-width', '1px')
    .style('stroke-linecap', 'round')
    .attr('x1', 0)
    .attr('y1', cellHeight / 2)
    .attr('x2', xScale(400))
    .attr('y2', cellHeight / 2);
  const gBar = svg.append('g').attr('width', '100%').attr('height', '100%');

  //  for linear gradient
  const defs = svg.append('defs');
  const lg = defs
    .append('linearGradient')
    .attr('id', 'Gradient2')
    .attr('x1', 0)
    .attr('x2', 1)
    .attr('y1', 0)
    .attr('y2', 0);
  lg.append('stop').attr('offset', '90%').attr('stop-color', colorScale(300));
  lg.append('stop').attr('offset', '100%').attr('stop-color', 'white');

  gBar
    .append('rect')
    .attr('x', () => xScale(Math.min(100, cappedValue)) + 12)
    .attr('width', () =>
      Math.abs(xScale(cappedValue) - xScale(100)) === 0
        ? 1
        : Math.abs(xScale(cappedValue) - xScale(100))
    )
    .attr('height', '100%')
    .attr('fill', () => (value > 300 ? 'url(#Gradient2)' : colorScale(value)));

  gBar
    .append('text')
    .attr('width', 20)
    .attr('height', 20)
    .attr('dx', () => {
      let offset = 14;
      offset = cappedValue >= 100 ? 14 : -4;
      if (cappedValue < 10) offset = -2;
      return xScale(cappedValue) + offset;
    })
    .attr('dy', '1.1em')
    .attr('fill', '#34769E')
    .text(value);

  // if(value>400){
  // gBar
  // .append('text')
  // .attr('font-size', '8px')
  // .attr('dx', () => xScale(cappedValue) + 32)
  // .attr('dy', '1.1em')
  // .attr('fill', '#34769E')
  // .text(() => '\u25b2');
  // .text(() => '\u25b3');
  // }

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
