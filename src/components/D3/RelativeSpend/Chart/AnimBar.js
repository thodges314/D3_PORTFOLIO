// This is a bar that overlays another bar and matches the background, giving the
// illusion of the bar underneath animating up
export const AnimBar = (element, xScale, barWidth, innerHeight, animDur) => {
  const animBarXOffset = 10;
  const barWidthModifier = 1.2;
  const animDurModifier = 3;
  // Adds a bar for animating
  element
    .append('rect')
    .attr('class', 'anim-bar')
    .attr('x', xScale('selection') - animBarXOffset)
    .attr('y', 0)
    .attr('width', barWidth * barWidthModifier)
    .attr('height', innerHeight)
    .attr('fill', 'white')
    .transition()
    .delay(animDur * animDurModifier)
    .duration(animDur * animDurModifier)
    .attr('height', '0')
    .remove();
};
