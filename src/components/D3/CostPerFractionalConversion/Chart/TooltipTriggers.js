import { ToolTipLogic } from '../../SharedD3Exports/ToolTip/ToolTipLogic';
import { toolTipData } from '../ProcessData';

export const TooltipTriggers = (markContainer, xScale, yScale, tooltip) => {
  const leftOffset = 9;
  const yOffset = 50;
  const htOffset = 70;
  const toolTipTrigger = markContainer
    .append('rect')
    .attr('class', 'tooltip-trigger')
    .attr('x', (d) => xScale(d.channelName) - leftOffset)
    .attr('y', (d) => yScale(d.optimized_cpc) - yOffset)
    .attr('width', '16px')
    .attr('height', (d) => yScale(0) - yScale(d.optimized_cpc) + htOffset);

  // Show tooltip on mouse over for Bars
  ToolTipLogic(toolTipTrigger, 250, tooltip, toolTipData);
};
