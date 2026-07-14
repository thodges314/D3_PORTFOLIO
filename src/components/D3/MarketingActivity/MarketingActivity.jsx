import React from 'react';
import * as d3 from 'd3';
import { useD3 } from '../../../hooks/useD3';
import { ProcessData, ControlTypeDataset, GetMaxValue } from './ProcessData';
import { Headers } from './Chart/Headers';
import { TableData } from './Chart/TableData';
import { ClearChart } from '../SharedD3Exports/ClearChart/ClearChart';
import { InitiateDraw } from '../SharedD3Exports/InitiateDraw/InitiateDraw';
import { Tooltip } from '../SharedD3Exports/ToolTip/Tooltip';
import '../SharedD3Exports/ToolTip/ToolTip.scss';
import './MarketingActivity.scss';

export const MarketingActivity = ({ simulatorData, topologyDetailLevel }) => {
  const ref = useD3(() => {
    function drawChart() {
      // Create Tooltip
      const tooltip = Tooltip('marketing-activity-tooltip');

      if (simulatorData) {
        ClearChart('.marketing-activity-table');
        // Process Data
        const data4Viz = ProcessData(simulatorData, topologyDetailLevel);

        // Variables for viz
        const element = d3.select(ref.current);

        // Ensure element still exists before continuing
        // This avoids errors caused by observers referencing removed elements
        if (element.node() === undefined || element.node() === null) {
          return;
        }
        const table = element.append('table');
        const maxPercents = {
          optimalSpend: GetMaxValue(data4Viz, 'optimalSpendPercent'),
          touches: GetMaxValue(data4Viz, 'touchesPercent'),
          conversions: GetMaxValue(data4Viz, 'conversionsPercent'),
        };
        // Add headers
        Headers(table);

        // Create dataset and table data for the controllable channels
        const controllableChannels = ControlTypeDataset(
          data4Viz,
          'Controllable'
        );
        TableData(
          controllableChannels,
          table,
          'Controllable',
          maxPercents,
          tooltip
        );

        // Create dataset and table data for passive channels
        const passiveChannels = ControlTypeDataset(data4Viz, 'Passive');
        TableData(passiveChannels, table, 'Passive', maxPercents, tooltip);

        // Create dataset and table data for not controllable channels
        const notControllableChannels = ControlTypeDataset(
          data4Viz,
          'Non-Controllable'
        );
        TableData(
          notControllableChannels,
          table,
          'Not&nbsp;Controllable',
          maxPercents,
          tooltip
        );
        // Add final borders at bottom of table
        const lastRow = table.append('tr');
        lastRow.append('td');
        lastRow.append('td').attr('class', 'table-bottom-border');
        lastRow.append('td').attr('class', 'table-bottom-border');
        lastRow.append('td').attr('class', 'table-bottom-border');
      } // closes the if statement to check for simulatorData
    }
    // Clear the chart, then draw chart
    ClearChart('.marketing-activity-table');
    InitiateDraw(ref.current, drawChart);
  }, [simulatorData]);
  return <div className="marketing-activity-table" ref={ref} />;
};
