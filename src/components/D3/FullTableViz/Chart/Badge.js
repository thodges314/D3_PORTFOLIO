import * as d3 from 'd3';

export const Badge = (currTd, value) => {
  const colorScale = d3
    .scaleOrdinal()
    .domain(['weak', 'good', 'strong'])
    .range(['#b4b4b4', 'lightblue', '#00a3e0']);
  const svg = currTd.append('svg').attr('width', '100%').attr('height', '100%');
  const gBadge = svg.append('g');
  gBadge
    .append('rect')
    .attr('width', 70)
    .attr('height', 18)
    .attr('fill', () => colorScale(value))
    .attr('rx', 8);

  gBadge
    .append('text')
    .attr('width', 50)
    .attr('height', 30)
    .attr('dy', '1.1em')
    .attr('dx', '0.7em')
    .attr('fill', 'white')
    .text(value.toUpperCase());
};
