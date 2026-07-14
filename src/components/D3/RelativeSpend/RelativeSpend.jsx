import React from 'react';
import * as d3 from 'd3';
import { useD3 } from '../../../hooks/useD3';
import { Tooltip } from '../SharedD3Exports/ToolTip/Tooltip';
import '../SharedD3Exports/ToolTip/ToolTip.scss';
import { ProcessData, FindMaxSpendForAll, FindArrTotal } from './ProcessData';
import { InitiateDraw } from '../SharedD3Exports/InitiateDraw/InitiateDraw';
import { BarTopLabels } from './Chart/BarTopLabels';
import { XaxisLabels } from './Chart/XaxisLabels';
import { Bars } from './Chart/Bars';
import { ClearChart } from '../SharedD3Exports/ClearChart/ClearChart';
import './RelativeSpend.scss';

export const RelativeSpend = ({
  bauData,
  optData,
  simulatorData,
  topologyDetailLevel,
}) => {
  const chartClassName = 'relative-spend-svg';
  const ref = useD3(() => {
    function drawChart() {
      ClearChart(`.${chartClassName}`);
      if (simulatorData && bauData && optData) {
        // Process Data
        const processedBauData = ProcessData(
          bauData,
          'mta_sample.chan_tot_cost',
          topologyDetailLevel
        );
        const processedOptData = ProcessData(
          optData,
          'mta_sample.total_investment',
          topologyDetailLevel
        );

        const selectionData = ProcessData(
          simulatorData,
          'mta_sample.total_investment',
          topologyDetailLevel
        );

        const maxSpend = FindMaxSpendForAll([
          processedBauData,
          processedOptData,
          selectionData,
        ]);

        // Clear Chart First
        ClearChart(chartClassName);

        // Variables for viz
        const element = d3.select('.relative-spend-svg');

        // Ensure element still exists before continuing
        // This avoids errors caused by observers referencing removed elements
        if (element.node() === undefined || element.node() === null) {
          return;
        }
        const margin = { top: 0, bottom: 30, left: 0, right: 0 };
        const elWidth = element.node().getBoundingClientRect().width;
        const elHeight = element.node().getBoundingClientRect().height;
        const innerWidth = elWidth - margin.left - margin.right;
        const innerHeight = elHeight - margin.top - margin.bottom;
        const animDur = 250;
        // Create X & Y Scales
        const paddingPerc = 0.1;
        const bars = ['bau', 'opt', 'selection'];
        const barWidth =
          (innerWidth * (1 - paddingPerc * (bars.length + 1))) / bars.length;
        const xScale = d3
          .scaleBand()
          .domain(bars)
          .range([0, innerWidth])
          .paddingInner(paddingPerc)
          .paddingOuter(paddingPerc * 4)
          .align(0.5);

        const roomForLabel = 30;
        const yScale = d3
          .scaleLinear()
          .domain([0, maxSpend])
          .range([innerHeight, roomForLabel]);

        // Create Tooltip
        const toolTip = Tooltip('relative-spend-tooltip');

        // Add Bars
        Bars(
          element,
          processedBauData,
          processedOptData,
          selectionData,
          xScale,
          yScale,
          barWidth,
          innerHeight,
          toolTip,
          animDur
        );

        // Add Top Labels to Bars
        BarTopLabels(
          element,
          FindArrTotal,
          xScale,
          yScale,
          barWidth,
          processedBauData,
          processedOptData,
          selectionData,
          animDur
        );

        // Add X Axis Labels
        XaxisLabels(
          element,
          xScale,
          yScale,
          barWidth,
          elHeight,
          processedBauData,
          processedOptData,
          selectionData
        );
      } // closes the if statement to check for simulatorData
    }
    // Clear the chart, then draw chart
    ClearChart(`.${chartClassName}`);
    InitiateDraw(ref.current, drawChart);
  }, [simulatorData]);

  return <svg className={chartClassName} ref={ref} />;
};
