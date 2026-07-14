import React from 'react';
import * as d3 from 'd3';
import { useD3 } from '../../../hooks/useD3';
import './DialChart.scss';

export const DialChart = ({
  percentage,
  percentTitle,
  percentSubtitleDollars,
  chartTitle,
  chartSubtitle,
}) => {
  const ref = useD3(() => {
    const tau = 2 * Math.PI;
    const width = 30;
    const height = 300;
    const positvePercent = percentage > 0;
    const outerRadius = Math.min(width, height) / 2;
    const innerRadius = (outerRadius / 4.5) * 4;
    const fontSize = '8';
    // Style wrapper element
    const element = d3.select(ref.current);

    const drawChart = () => {
      // Chart Titles
      // Chart Title Rendered
      element.append('h2').text(chartTitle);

      // Chart Subtitle Rendered

      element
        .append('p')
        .attr('class', () => {
          const subtitleLength = chartSubtitle?.length || 0;
          const subtitleClass =
            subtitleLength < 30 ? 'chart-subtitle' : 'large-subtitle';
          return subtitleClass;
        })
        .text(chartSubtitle || ` `);

      // Create SVG
      const svg = element
        .append('svg')
        .attr(
          'viewBox',
          `0 0 ${Math.min(width, height)} ${Math.min(width, height)}`
        )
        .attr('preserveAspectRatio', 'xMinYMin')
        .append('g')
        .attr(
          'transform',
          `translate(${Math.min(width, height) / 2},${
            Math.min(width, height) / 2
          })`
        );
      // TODO make translation dynamic for center of any div or table

      // Chart Labels
      const percentText = svg
        .append('text')
        .attr('class', 'percent-text')
        .text('0%')
        .attr('dy', 0)
        .attr('dx', 0);

      // Percent Title Text Rendered
      svg
        .append('text')
        .attr('class', 'percent-title')
        .text(percentTitle)
        .style('font-size', `${fontSize * 0.25}px`)
        .attr('dy', fontSize / 3)
        .attr('dx', 0);

      // Percent Subtitle Dollars Rendered
      svg
        .append('text')
        .attr('class', 'percent-subtitle-dollars-rendered')
        .text(percentSubtitleDollars)
        .style('font-size', `${fontSize * 0.28}px`)
        .attr('text-anchor', 'middle')
        .attr('dy', fontSize * 0.9);

      // Percent Subtitle Per
      svg
        .append('text')
        .attr('class', 'percent-subtitle-per')
        .text('Per Conversion')
        .style('font-size', `${fontSize * 0.28}px`)
        .attr('text-anchor', 'middle')
        .attr('dy', fontSize * 1.2);

      // Drawing Chart arcs
      const arc = d3
        .arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(0);

      function arcTween(transition) {
        let newAngle = (percentage + 1) / 16;
        if (positvePercent) newAngle = (percentage - 1) / 16;
        transition.attrTween('d', (d) => {
          const interpolate = d3.interpolate(d.endAngle, newAngle);
          const tempD = d;
          return function (t) {
            tempD.endAngle = interpolate(t);
            return arc(tempD);
          };
        });
      }

      function borderArcTween(transition) {
        const newAngle = percentage / 16;
        let prefixSymbol = '+';
        if (!positvePercent) prefixSymbol = '';
        transition.attrTween('d', (d) => {
          const interpolate = d3.interpolate(d.endAngle, newAngle);
          const tempD = d;
          return function (t) {
            tempD.endAngle = interpolate(t);
            percentText.text(
              `${prefixSymbol + Math.round((tempD.endAngle / tau) * 100)}%`
            );
            return arc(tempD);
          };
        });
      }

      const borderArc = d3
        .arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(0);

      // Background
      svg
        .append('path')
        .attr('class', 'background')
        .datum({ endAngle: tau })
        .attr('d', arc);

      const border = svg
        .append('path')
        .attr('class', 'border')
        .datum({ endAngle: 0 * tau })
        .attr('d', borderArc);

      const foreground = svg
        .append('path')
        .attr('class', 'mark')
        .datum({ endAngle: 0 * tau })
        .attr('class', positvePercent ? 'positive-mark' : 'negative-mark')
        .attr('d', arc);

      // Chart Animations
      foreground
        .transition()
        .delay(500)
        .duration(750)
        .call(arcTween, percentage);

      border
        .transition()
        .delay(500)
        .duration(750)
        .call(borderArcTween, percentage);
    };
    drawChart();
  }, []);
  return <div className="dial-chart-container" ref={ref} />;
};
