import { ToolTipLogic } from '../../SharedD3Exports/ToolTip/ToolTipLogic';
import { toolTipData } from '../ProcessData';

export const Bars = (
  data4Viz,
  element,
  yScale,
  innerWidth,
  innerHeight,
  toolTip,
  useAnimation
) => {
  let yOffset = 0;
  let xOffset = 0;
  const numBars = data4Viz.length;
  const minBarPerc = 0.01;
  const animBarDelay = 400;
  const animDur = 250;
  const animLabelDelay = 800;
  const animDelayDivisor = 25;
  const maxAnimTime = 800;
  const bar = element.selectAll('.bar').data(data4Viz).enter().append('g');
  const notFirstBarPaddingMultiplier = 1.57;
  const firstBarPaddingMultiplier = 0.56;
  const labelHeightOffset = 3;

  const barRect = bar
    .append('rect')
    .attr('class', 'percent-bar tooltip-trigger')
    .attr('x', () => {
      let output;
      if (xOffset === 0) {
        output = 0;
        xOffset = 0.1;
      } else {
        output = innerWidth / numBars + xOffset;
        xOffset += innerWidth / numBars;
      }
      return output;
    })

    .attr('y', (d) => {
      let output;
      if (useAnimation) {
        return innerHeight - (innerHeight - yScale(d.percent));
      }
      if (yOffset === 0) {
        output = yScale(d.percent);
      } else {
        output = yScale(d.percent) - yOffset;
      }
      yOffset = yOffset + innerHeight - yScale(d.percent);
      return output;
    })
    .attr('fill', (d) => d.color)
    .attr('width', () => innerWidth / numBars)
    .attr('height', (d) => {
      const barHt = innerHeight - yScale(d.percent);
      // heights below 2 units are hard to see, so return 2 as the minimum height
      if (barHt < 2) return 2;
      return barHt;
    });

  // Show tooltip on mouse over for Bars
  ToolTipLogic(barRect, animDur, toolTip, toolTipData);

  // Bar rect animations
  if (useAnimation) {
    bar
      .select('.percent-bar')
      .transition()
      .duration(animDur)
      .delay((d) => {
        const currAnimTime = animBarDelay + animDelayDivisor / d.percent;
        return currAnimTime > maxAnimTime ? maxAnimTime : currAnimTime;
      })
      .attr('y', (d) => {
        let output;
        let perc = d.percent;
        if (perc < minBarPerc) perc = minBarPerc;
        if (yOffset === 0) {
          output = yScale(perc);
        } else {
          output = yScale(perc) - yOffset;
        }
        yOffset = yOffset + innerHeight - yScale(d.percent);
        return output;
      });
  }

  // Create Bar Labels
  xOffset = 0;
  yOffset = 2;
  // Add barLabels
  bar
    .append('text')
    .attr('class', 'bar-label')
    .text((d) =>
      // Give an extra decimal place for numbers below 0.099
      // to help avoid showing values like 0.0%
      d.percent > 0.099
        ? `${d.percent.toFixed(1)}%`
        : `${d.percent.toFixed(2)}%`
    )
    // Position the labels using transform to allow for rotated labels
    .attr('transform', (d) => {
      let xOutput;
      if (xOffset === 0) {
        // Provide less padding if it is the first bar
        xOutput = (innerWidth / numBars) * firstBarPaddingMultiplier;
        xOffset = 0.1;
      } else {
        // Provide extra padding if it is not the first bar
        xOutput =
          (innerWidth / numBars) * notFirstBarPaddingMultiplier + xOffset;
        xOffset += innerWidth / numBars;
      }
      let yOutput;
      if (yOffset === 0) {
        yOutput = yScale(d.percent);
      } else {
        yOutput = yScale(d.percent) - yOffset;
      }
      yOffset = yOffset + innerHeight - yScale(d.percent);
      return `translate(${xOutput}, ${
        yOutput - labelHeightOffset
      }) rotate(-90)`;
    });

  // Bar Label Animations
  if (useAnimation) {
    bar
      .select('.bar-label')
      .attr('opacity', 0)
      .transition()
      .duration(animDur)
      .delay((d) => animLabelDelay + animDelayDivisor / d.percent)
      .delay((d) => {
        const currAnimTime = animLabelDelay + animDelayDivisor / d.percent;
        return currAnimTime > maxAnimTime ? maxAnimTime : currAnimTime;
      })
      .attr('opacity', 1);
  }
};
