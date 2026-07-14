import { numberWithCommas } from '../../../../utils/formatCommas';

export const Circles = (markContainer, xScale, yScale, useAnimation) => {
  const xOffset = 2.75;
  const yOffset = -8;
  markContainer
    .append('circle')
    .attr('cx', (d) => xScale(d.channelName))
    .attr('cy', (d) => {
      if (useAnimation) {
        return yScale(0);
      }
      return yScale(d.optimized_cpc);
    })
    .attr('r', '5')
    .style('fill', (d) => d.color)
    .attr('stroke', (d) => d.color);

  // circle text
  const circleText = markContainer
    .append('text')
    .attr(
      'transform',
      (d) =>
        `translate(${xScale(d.channelName) + xOffset},${
          yScale(d.optimized_cpc) + yOffset
        }) rotate(-90)`
    )
    .attr('class', 'circle-text')
    .text((d) => {
      let cpc = d.optimized_cpc;
      cpc = cpc.toFixed(2);
      cpc = numberWithCommas(cpc);
      return `$${cpc}`;
    });

  if (useAnimation) {
    markContainer
      .selectAll('circle')
      .transition()
      .duration(250)
      .attr('cy', (d) => yScale(d.optimized_cpc));
    circleText.attr('opacity', 0).transition().duration(450).attr('opacity', 1);
  }
};
