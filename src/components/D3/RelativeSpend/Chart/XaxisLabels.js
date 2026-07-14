export const XaxisLabels = (element, xScale, yScale, barWidth, height) => {
  const axisLabelOffset = 15;

  // Add Bau Bar Text
  element
    .append('text')
    .attr('class', 'xaxis-label')
    .attr('x', xScale('bau') + 0.5 * barWidth)
    .attr('y', height - axisLabelOffset)
    .text('Business As Usual');

  // Add Opt Bar Text
  element
    .append('text')
    .attr('class', 'xaxis-label')
    .attr('x', xScale('opt') + 0.5 * barWidth)
    .attr('y', height - axisLabelOffset)
    .text('Optimized for Scenario');

  // Add  selected data Bar
  element
    .append('text')
    .attr('class', 'xaxis-label')
    .attr('x', xScale('selection') + 0.5 * barWidth)
    .attr('y', height - axisLabelOffset)
    .text('With Your Selections');
};
