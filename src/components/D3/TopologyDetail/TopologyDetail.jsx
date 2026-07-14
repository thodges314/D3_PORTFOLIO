import React from 'react';
import * as d3 from 'd3';
import { useD3 } from '../../../hooks/useD3';
import { ProcessData } from './ProcessData';
import { Headers } from './Chart/Headers';
import { TableData } from './Chart/TableData';
import { InitiateDraw } from '../SharedD3Exports/InitiateDraw/InitiateDraw';
import { Tooltip } from '../SharedD3Exports/ToolTip/Tooltip';
import { ClearChart } from '../SharedD3Exports/ClearChart/ClearChart';
import '../SharedD3Exports/ToolTip/ToolTip.scss';
import './TopologyDetail.scss';

export const TopologyDetail = ({ simulatorData }) => {
  const ref = useD3(() => {
    function drawChart() {
      ClearChart('.topology-detail-table');
      // Create Tooltip
      const tooltip = Tooltip('topology-detail-tooltip');
      if (simulatorData) {
        // Process Data
        const data4Viz = ProcessData(simulatorData);
        // Variables for viz
        const element = d3.select(ref.current);

        // Ensure element still exists before continuing
        // This avoids errors caused by observers referencing removed elements
        if (element.node() === undefined || element.node() === null) {
          return;
        }
        const table = element.append('table');
        // Add headers
        Headers(table);
        // Add Table Data
        TableData(data4Viz, table, tooltip);
      }
    }
    ClearChart('.topology-detail-table');
    InitiateDraw(ref.current, drawChart);
  }, [simulatorData]);
  return <div className="topology-detail-table" ref={ref} />;
};
