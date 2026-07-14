import * as d3 from 'd3';

const sizeLegend = (selection, props) => {
  const { radiusScale, spacing, textOffset, numTicks, circleFill } = props;

  const ticks = radiusScale
    .ticks(numTicks)
    .filter((d) => d !== 0)
    .reverse();

  const groups = selection.selectAll('g').data(ticks);
  const groupsEnter = groups.enter().append('g').attr('class', 'tick');
  groupsEnter
    .merge(groups)
    .attr('transform', (_d, i) => `translate(${i * spacing},0)`);
  groups.exit().remove();

  groupsEnter
    .append('circle')
    .merge(groups.select('circle'))
    .attr('r', radiusScale)
    .attr('fill', circleFill);

  const format = d3.format('.0%');
  groupsEnter
    .append('text')
    .attr('fill', '#64615d')
    .merge(groups.select('text'))
    .text((d) => format(d))
    .attr('dy', '0.32em')
    .attr('x', (d) => radiusScale(d) + textOffset);
};

export default sizeLegend;
