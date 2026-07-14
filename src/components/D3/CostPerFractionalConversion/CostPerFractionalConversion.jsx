import React from 'react';
import * as d3 from 'd3';
import { useD3 } from '../../../hooks/useD3';
import { ClearChart } from '../SharedD3Exports/ClearChart/ClearChart';
import { ProcessData } from './ProcessData';
import { Marks } from './Chart/Marks';
import { XaxisLabels } from './Chart/XaxisLabels';
import { Tooltip } from '../SharedD3Exports/ToolTip/Tooltip';
import '../SharedD3Exports/ToolTip/ToolTip.scss';
import './CostPerFractionalConversion.scss';
import { InitiateDraw } from '../SharedD3Exports/InitiateDraw/InitiateDraw';

export const CostPerFractionalConversion = ({
  data,
  topologyDetailLevel,
  useAnimation = true,
}) => {
  const ref = useD3(() => {
    const drawChart = () => {
      if (data) {
        ClearChart('.lollipop-svg');
        // Process Data
        const data4Viz = ProcessData(data, topologyDetailLevel);
        // Create Tooltip
        const toolTip = Tooltip('cost-per-fractional-conversion-tooltip');

        // Variables for viz
        const element = d3.select('.lollipop-svg');

        // Ensure element still exists before continuing
        // This avoids errors caused by observers referencing removed elements
        if (element.node() === undefined || element.node() === null) {
          return;
        }
        const margin = { top: 0, bottom: 80, left: 0, right: 0 };
        const elWidth = element.node().getBoundingClientRect().width;
        const elHeight = element.node().getBoundingClientRect().height;
        const innerWidth = elWidth - margin.left - margin.right;
        const innerHeight = elHeight - margin.top - margin.bottom;
        const xScale = d3
          .scaleBand()
          .range([0, innerWidth])
          .domain(data4Viz.map((d) => d.channelName))
          .padding(1);
        const yScale = d3
          .scaleLinear()
          .domain([0, d3.max(data4Viz, (d) => d.optimized_cpc)])
          .range([innerHeight, 0]);

        // Add chart components
        XaxisLabels(element, innerHeight, xScale);
        Marks(data4Viz, element, xScale, yScale, useAnimation, toolTip);
      }
    };
    ClearChart('.lollipop-svg');
    InitiateDraw(ref.current, drawChart);
  }, [data]);

  return <svg className="lollipop-svg" ref={ref} />;
};
