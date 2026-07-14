import { TextOverflowEllipsis } from '../../SharedD3Exports/TextOverflowEllipsis/TextOverflowEllipsis';

export const BarInnerLabel = (
  el,
  barName,
  xScale,
  yScale,
  barWidth,
  innerHeight
) => {
  let barYoffset = 0;
  const innerLabelOffset = 5;
  const innerLabelCutoff = 8;
  const labelCharCutoff = 20;

  // Add a label inside of bar
  el.append('text')
    // Checks if height of bar is greater than innerLabelCutoff so only rects tall enough show labels
    .attr('class', (d) =>
      (innerHeight - yScale(d.totalSum)) / 2 > innerLabelCutoff
        ? 'bar-inner-label show'
        : 'bar-inner-label hide'
    )
    .attr('x', xScale(barName) + 0.5 * barWidth)
    .attr('y', (d) => {
      const midBarOffset =
        (innerHeight - yScale(d.totalSum)) / 2 + innerLabelOffset;
      const output = yScale(d.totalSum) + barYoffset + midBarOffset;
      barYoffset -= innerHeight - yScale(d.totalSum);
      return output;
    })
    .text((d) => TextOverflowEllipsis(d.channelName, labelCharCutoff));
};
