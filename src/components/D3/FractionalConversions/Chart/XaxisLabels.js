import { TextOverflowEllipsis } from '../../SharedD3Exports/TextOverflowEllipsis/TextOverflowEllipsis';

export const XaxisLabels = (
  data4Viz,
  element,
  height,
  innerWidth,
  numBars,
  xLineScale,
  xAccessor,
  marginBottom
) => {
  const labelTopPadding = 10;
  const xAxisPadding = 2;
  element
    .selectAll('.xaxis-label')
    .data(data4Viz)
    .enter()
    .append('text')
    .attr('class', 'xaxis-label')
    .attr(
      'transform',
      (d) =>
        `translate(${
          xLineScale(xAccessor(d)) + innerWidth / numBars / 2 + xAxisPadding
        },${height - marginBottom + labelTopPadding}) rotate(-90)`
    )
    .text((d) => TextOverflowEllipsis(d.channelName, 15));
};
