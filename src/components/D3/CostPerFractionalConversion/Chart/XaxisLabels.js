import * as d3 from 'd3';
import { TextOverflowEllipsis } from '../../SharedD3Exports/TextOverflowEllipsis/TextOverflowEllipsis';

export const XaxisLabels = (element, innerHeight, xScale) => {
  element
    .append('g')
    .attr('transform', `translate(0, ${innerHeight + 10})`)
    .attr('class', 'xaxis-label')
    .call(d3.axisBottom(xScale))
    .selectAll('text')
    .text((d) => TextOverflowEllipsis(d, 15));
};
