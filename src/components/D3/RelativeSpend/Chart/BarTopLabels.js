import * as d3 from 'd3';

export const BarTopLabels = (
  element,
  FindArrTotal,
  xScale,
  yScale,
  barWidth,
  bauData,
  optData,
  selectionData,
  animDur
) => {
  const bauMax = FindArrTotal(bauData);
  const barLabelOffset = 6;

  // Add Bau Bar Text
  element
    .append('text')
    .attr('class', 'bar-top-label')
    .attr('x', xScale('bau') + 0.5 * barWidth)
    .attr('y', yScale(bauMax) - barLabelOffset)
    .attr('text-anchor', 'middle')
    .text(`$${d3.format(',')(bauMax)}`);

  const optMax = FindArrTotal(optData);
  // Add Opt Bar Text
  element
    .append('text')
    .attr('class', 'bar-top-label')
    .attr('x', xScale('opt') + 0.5 * barWidth)
    .attr('y', yScale(optMax) - barLabelOffset)
    .attr('text-anchor', 'middle')
    .text(`$${d3.format(',')(optMax)}`);

  const selectionMax = FindArrTotal(selectionData);
  const textAnimModifier = 4.5;
  // Add selection data bar text
  element
    .append('text')
    .attr('class', 'bar-top-label selection-bar-text')
    .attr('x', xScale('selection') + 0.5 * barWidth)
    .attr('y', yScale(selectionMax) - barLabelOffset)
    .attr('text-anchor', 'middle')
    .text(`$${d3.format(',')(selectionMax)}`)
    .attr('opacity', '0')
    .transition()
    .duration(animDur)
    .delay(animDur * textAnimModifier)
    .attr('opacity', '1');
};
