import React from 'react';
import * as d3 from 'd3';
import { useD3 } from '../../../hooks/useD3';
import { InitiateDraw } from '../SharedD3Exports/InitiateDraw/InitiateDraw';
import { Tooltip } from '../SharedD3Exports/ToolTip/Tooltip';
import { ClearChart } from '../SharedD3Exports/ClearChart/ClearChart';
import { ProcessData } from './ProcessData';
import { Headers } from './Chart/Headers';
import { TableData } from './Chart/TableData';
import '../SharedD3Exports/ToolTip/ToolTip.scss';
import './ScenariosItemized.scss';

export const ScenarioItemized = ({ scenariosData }) => {
  const ref = useD3(() => {
    function drawChart() {
      ClearChart('.scenarios-itemized-table');
      // Create Tooltip
      const tooltip = Tooltip('scenarios-itemized-tooltip');
      if (scenariosData) {
        // // Process Data
        const data4Viz = ProcessData(scenariosData);
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
  }, [scenariosData]);
  return <div className="scenarios-itemized-table" ref={ref} />;
};
