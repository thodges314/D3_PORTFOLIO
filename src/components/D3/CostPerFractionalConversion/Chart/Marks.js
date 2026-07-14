import { TooltipTriggers } from './TooltipTriggers';
import { Circles } from './Circles';
import { Lines } from './Lines';

export const Marks = (
  data4Viz,
  element,
  xScale,
  yScale,
  useAnimation,
  tooltip
) => {
  const markContainer = element
    .selectAll('element')
    .data(data4Viz)
    .enter()
    .append('g')
    .attr('class', 'mark-container');

  // Add lines
  Lines(markContainer, xScale, yScale, useAnimation);
  // Add Circles
  Circles(markContainer, xScale, yScale, useAnimation);
  // Add Tooltip Triggers
  TooltipTriggers(markContainer, xScale, yScale, tooltip);
};
