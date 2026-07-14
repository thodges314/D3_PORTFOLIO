const colorLegend = (selection, props) => {
  const { colorScale, spacing } = props;

  const ticks = colorScale.domain();

  const groups = selection.selectAll('g').data(ticks);
  const groupsEnter = groups.enter().append('g').attr('class', 'tick');
  groupsEnter
    .merge(groups)
    .attr('transform', (_d, i) => `translate(${i * spacing + 140},0)`);
  groups.exit().remove();

  selection
    .append('text')
    .attr('fill', '#64615d')
    .text('Youngest Generation')
    .attr('dy', '0.32em')
    .attr('dx', '-0.8em');

  groupsEnter
    .append('rect')
    .merge(groups.select('rect'))
    .attr('height', spacing)
    .attr('width', spacing)
    .attr('x', -10)
    .attr('y', -10)
    .attr('fill', colorScale);

  selection
    .append('text')
    .attr('fill', '#64615d')
    .text('Oldest Generation')
    .attr('dy', '0.32em')
    .attr('dx', `${colorScale.domain().length * spacing + 138}px`);
};

export default colorLegend;
