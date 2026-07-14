import * as d3 from 'd3';
import React from 'react';
import { useD3 } from '../../../hooks/useD3';
import { InitiateDraw } from '../SharedD3Exports/InitiateDraw/InitiateDraw';
import { Bars } from './Chart/Bars';
import { Line } from './Chart/Line';
import { XaxisLabels } from './Chart/XaxisLabels';
import { ProcessData } from './ProcessData';
import { ClearChart } from '../SharedD3Exports/ClearChart/ClearChart';
import { Tooltip } from '../SharedD3Exports/ToolTip/Tooltip';
import '../SharedD3Exports/ToolTip/ToolTip.scss';
import './FractionalConversions.scss';

export const FractionalConversions = ({
  simulatorData,
  topologyDetailLevel,
  useAnimation = true,
}) => {
  const ref = useD3(() => {
    function drawChart() {
      if (simulatorData) {
        ClearChart('.fractional-conversions-svg');
        // Process Data
        const data4Viz = ProcessData(simulatorData, topologyDetailLevel);

        // Create Tooltip
        const toolTip = Tooltip('fractional-conversions-tooltip');

        // Variables for viz
        const element = d3.select('.fractional-conversions-svg');

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
        const numBars = data4Viz.length;
        const xAccessor = (d) => d.channelName;
        const xLineScale = d3
          .scaleBand()
          .domain(data4Viz.map((d) => d.channelName))
          .range([0, innerWidth]);
        const yScale = d3
          .scaleLinear()
          .domain([0, 100])
          .range([innerHeight, 0]);

        // Add Bars
        Bars(
          data4Viz,
          element,
          yScale,
          innerWidth,
          innerHeight,
          toolTip,
          useAnimation
        );

        // Add Line
        Line(
          data4Viz,
          element,
          yScale,
          innerWidth,
          innerHeight,
          numBars,
          xLineScale,
          xAccessor
        );

        // Add XaxisLabels
        XaxisLabels(
          data4Viz,
          element,
          elHeight,
          innerWidth,
          numBars,
          xLineScale,
          xAccessor,
          margin.bottom
        );
      } // closes the if statement to check for simulatorData
    }
    // Clear the chart, then draw chart
    ClearChart('.fractional-conversions-svg');
    InitiateDraw(ref.current, drawChart);
  }, [simulatorData]);

  return <svg className="fractional-conversions-svg" ref={ref} />;
};
