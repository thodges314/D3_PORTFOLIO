import { ToolTipLogic } from '../../SharedD3Exports/ToolTip/ToolTipLogic';
import { toolTipData } from '../ProcessData';
import { AnimBar } from './AnimBar';
import { BarInnerLabel } from './BarInnerLabel';

export const Bars = (
  element,
  processedBauData,
  processedOptData,
  selectionData,
  xScale,
  yScale,
  barWidth,
  innerHeight,
  toolTip,
  animDur
) => {
  // Add bars for each dataset
  let barYoffset = 0;
  const bauBar = element
    .selectAll('.bau-bar')
    .data(processedBauData)
    .enter()
    .append('g')
    .attr('class', 'bar');
  // Add colored rectangle to bauBar
  bauBar
    .append('rect')
    .attr('class', 'bau-bar-rect')
    .attr('x', xScale('bau'))
    .attr('y', (d) => {
      const output = yScale(d.totalSum) + barYoffset;
      barYoffset -= innerHeight - yScale(d.totalSum);
      return output;
    })
    .attr('width', barWidth)
    .attr('height', (d) => innerHeight - yScale(d.totalSum))
    .attr('fill', (d) => d.color);

  barYoffset = 0;
  const optBar = element
    .selectAll('.opt-bar')
    .data(processedOptData)
    .enter()
    .append('g')
    .attr('class', 'bar');
  // Add colored rectangle to optBar
  optBar
    .append('rect')
    .attr('class', 'opt-bar-rect')
    .attr('x', xScale('opt'))
    .attr('y', (d) => {
      const output = yScale(d.totalSum) + barYoffset;
      barYoffset -= innerHeight - yScale(d.totalSum);
      return output;
    })
    .attr('width', barWidth)
    .attr('height', (d) => innerHeight - yScale(d.totalSum))
    .attr('fill', (d) => d.color);

  barYoffset = 0;
  const selectionBar = element
    .selectAll('.select-bar')
    .data(selectionData)
    .enter()
    .append('g')
    .attr('class', 'bar');
  // Add colored rectangle to selectionBar
  selectionBar
    .append('rect')
    .attr('class', 'selection-bar-rect')
    .attr('x', xScale('selection'))
    .attr('y', (d) => {
      const output = yScale(d.totalSum) + barYoffset;
      barYoffset -= innerHeight - yScale(d.totalSum);
      return output;
    })
    .attr('width', barWidth)
    .attr('height', (d) => innerHeight - yScale(d.totalSum))
    .attr('fill', (d) => d.color);

  // Add Bar Inner Labels
  BarInnerLabel(bauBar, 'bau', xScale, yScale, barWidth, innerHeight);
  BarInnerLabel(optBar, 'opt', xScale, yScale, barWidth, innerHeight);
  BarInnerLabel(
    selectionBar,
    'selection',
    xScale,
    yScale,
    barWidth,
    innerHeight
  );

  // Add Tooltip Triggers
  barYoffset = 0;
  const selectionBarTrigger = selectionBar
    .append('rect')
    .attr('class', 'selection-bar-trigger')
    .attr('x', xScale('selection'))
    .attr('y', (d) => {
      const output = yScale(d.totalSum) + barYoffset;
      barYoffset -= innerHeight - yScale(d.totalSum);
      return output;
    })
    .attr('width', barWidth)
    .attr('height', (d) => innerHeight - yScale(d.totalSum))
    .attr('fill', () => 'transparent');

  barYoffset = 0;
  const optBarTrigger = optBar
    .append('rect')
    .attr('class', 'opt-bar-rect')
    .attr('x', xScale('opt'))
    .attr('y', (d) => {
      const output = yScale(d.totalSum) + barYoffset;
      barYoffset -= innerHeight - yScale(d.totalSum);
      return output;
    })
    .attr('width', barWidth)
    .attr('height', (d) => innerHeight - yScale(d.totalSum))
    .attr('fill', () => 'transparent');

  barYoffset = 0;
  const bauBarTrigger = bauBar
    .append('rect')
    .attr('class', 'bau-bar-rect')
    .attr('x', xScale('bau'))
    .attr('y', (d) => {
      const output = yScale(d.totalSum) + barYoffset;
      barYoffset -= innerHeight - yScale(d.totalSum);
      return output;
    })
    .attr('width', barWidth)
    .attr('height', (d) => innerHeight - yScale(d.totalSum))
    .attr('fill', () => 'transparent');

  // Add Tooltips
  ToolTipLogic(selectionBarTrigger, animDur, toolTip, toolTipData);
  ToolTipLogic(optBarTrigger, animDur, toolTip, toolTipData);
  ToolTipLogic(bauBarTrigger, animDur, toolTip, toolTipData);

  // Add Anim Bar
  AnimBar(element, xScale, barWidth, innerHeight, animDur);
};
