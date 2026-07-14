import * as d3 from 'd3';
import { BarChart } from './BarChart';
import { ToolTipLogic } from '../../SharedD3Exports/ToolTip/ToolTipLogic';
import { toolTipData, toolTipDataCol2and3 } from '../ProcessData';
import { TextOverflowEllipsis } from '../../SharedD3Exports/TextOverflowEllipsis/TextOverflowEllipsis';

export const TableData = (
  channelDataset,
  table,
  label,
  maxPercents,
  tooltip
) => {
  const widthOfLabel = 70;
  const animDur = 250;
  const maxCharsChannelName = 29;
  channelDataset.forEach((obj, i) => {
    // Add a row for control type labels
    if (i === 0) {
      const labelRow = table.append('tr');
      // Add Control Type Label
      labelRow
        .attr('class', () => {
          if (label === 'Controllable') return 'channel-label';
          return 'channel-label top-pad';
        })
        .append('td')
        .html(label);
      labelRow.append('td').attr('class', 'borderTd');
      labelRow.append('td').attr('class', 'borderTd');
      labelRow.append('td').attr('class', 'borderTd');
    }
    const dataRow = table.append('tr');

    // Add the column for channel name labels
    const channelNameTd = dataRow
      .append('td')
      .attr('class', 'channelname')
      .text(TextOverflowEllipsis(obj.channelName, maxCharsChannelName));

    if (i === 0) {
      channelNameTd.attr('class', 'channelname-first');
    } else if (
      i === channelDataset.length - 1 &&
      label === 'Not&nbsp;Controllable'
    ) {
      channelNameTd.attr('class', 'channelname-last');
    }

    // create table data cells for each column
    const td1 = dataRow.append('td').attr('class', 'barchart tooltip-trigger');
    const td2 = dataRow.append('td').attr('class', 'barchart tooltip-trigger');
    const td3 = dataRow.append('td').attr('class', 'barchart tooltip-trigger');

    const widthOfBarContainer = td1.node().getBoundingClientRect().width;

    // Creates scales for columns with percent data
    const xScaleOptimalSpend = d3
      .scaleLinear()
      .domain([0, maxPercents.optimalSpend])
      .range([0, widthOfBarContainer - widthOfLabel]);

    const xScaleTouches = d3
      .scaleLinear()
      .domain([0, maxPercents.touches])
      .range([0, widthOfBarContainer - widthOfLabel]);

    const xScaleConversions = d3
      .scaleLinear()
      .domain([0, maxPercents.conversions])
      .range([0, widthOfBarContainer - widthOfLabel]);

    // Create barcharts in each table data cell
    BarChart(td1, obj, obj.optimalSpendPercent, xScaleOptimalSpend);
    BarChart(td2, obj, obj.touchesPercent, xScaleTouches);
    BarChart(td3, obj, obj.conversionsPercent, xScaleConversions);

    // Add tooltips for table data cells
    ToolTipLogic(td1, animDur, tooltip, toolTipData, {
      channelName: obj.channelName,
      percent: obj.optimalSpendPercent,
      totalSum: obj.optimalSpendTotalSum,
    });
    ToolTipLogic(td2, animDur, tooltip, toolTipDataCol2and3, {
      channelName: obj.channelName,
      percent: obj.touchesPercent,
      totalSum: obj.touchesTotalSum,
      decimalPlaces: obj.decimalPlaces,
    });
    ToolTipLogic(td3, animDur, tooltip, toolTipDataCol2and3, {
      channelName: obj.channelName,
      percent: obj.conversionsPercent,
      totalSum: obj.conversionsTotalSum,
      decimalPlaces: obj.decimalPlaces,
    });
  });
};
