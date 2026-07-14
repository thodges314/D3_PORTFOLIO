export const Lines = (markContainer, xScale, yScale, useAnimation) => {
  markContainer
    .append('line')
    .attr('x1', (d) => xScale(d.channelName))
    .attr('x2', (d) => xScale(d.channelName))
    .attr('y1', () => yScale(0))
    .attr('y2', () => yScale(0))
    .attr('stroke', (d) => d.color)
    .attr('stroke-width', '3px');
  const circleRadius = 5;
  if (useAnimation) {
    markContainer
      .selectAll('line')
      .transition()
      .duration(250)
      .attr('y1', (d) => yScale(d.optimized_cpc) + circleRadius);
  }
};
