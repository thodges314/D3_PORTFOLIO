import { colorSetCol23, colorSetCol4 } from '../../TopologyDetail/SetColors';
import { ToolTipLogic } from '../../SharedD3Exports/ToolTip/ToolTipLogic';
import { toolTipData, toolTipDataLastCol } from '../ProcessData';
import { numberWithCommas } from '../../../../utils/formatCommas';

export const TableData = (data4Viz, table, tooltip) => {
  const animDur = 250;
  const defaultText = '--';
  const defaultBackground = 'background: white';
  const top1DataExists = data4Viz.top1Data.length !== 0;
  const top2DataExists = data4Viz.top2Data.length !== 0;

  for (let i = 0; i < data4Viz.top1Data.length; i += 1) {
    const currRow = table.append('tr');

    // create table data cells for each column
    currRow
      .append('td')
      .attr('class', 'topology-name')
      .text(data4Viz.top1Data[i].topologyName);

    const td2 = currRow
      .append('td')
      .attr('class', 'bau-investment')
      .attr('style', () =>
        top1DataExists
          ? colorSetCol23(
              data4Viz.top1Data[i].bauInvestment,
              data4Viz.top1Data,
              'bauInvestment'
            )
          : defaultBackground
      )
      .text(
        top1DataExists
          ? `$${numberWithCommas(
              data4Viz.top1Data[i].bauInvestment.toFixed(2)
            )}`
          : defaultText
      );

    const td3 = currRow
      .append('td')
      .attr('class', 'opt-spend')
      .attr('style', () =>
        top1DataExists
          ? colorSetCol23(
              data4Viz.top1Data[i].optSpend,
              data4Viz.top1Data,
              'optSpend'
            )
          : defaultBackground
      )
      .text(
        top1DataExists
          ? `$${numberWithCommas(data4Viz.top1Data[i].optSpend.toFixed(2))}`
          : defaultText
      );

    const td4 = currRow
      .append('td')
      .attr('class', 'investment-diff')
      .text(() => {
        if (!top1DataExists) return 'NA';
        if (data4Viz.top1Data[i].investmentDiff === 0) return 'NA';
        return `${data4Viz.top1Data[i].investmentDiff.toFixed(2)}%`;
      })
      .attr('style', () =>
        top1DataExists
          ? colorSetCol4(
              data4Viz.top1Data[i].investmentDiff,
              data4Viz.top1Data,
              'investmentDiff'
            )
          : defaultBackground
      );

    const td5 = currRow
      .append('td')
      .attr('class', 'opt-spend')
      .attr('style', () =>
        top2DataExists
          ? colorSetCol23(
              data4Viz.top2Data[i].optSpend,
              data4Viz.top2Data,
              'optSpend'
            )
          : defaultBackground
      )
      .text(
        top2DataExists
          ? `$${numberWithCommas(data4Viz.top2Data[i].optSpend.toFixed(2))}`
          : defaultText
      );

    const td6 = currRow
      .append('td')
      .attr('class', 'investment-diff')
      .text(() => {
        if (!top2DataExists) return 'NA';
        if (data4Viz.top2Data[i].investmentDiff === 0) return 'NA';
        return `${data4Viz.top2Data[i].investmentDiff.toFixed(2)}%`;
      })
      .attr('style', () =>
        top2DataExists
          ? colorSetCol4(
              data4Viz.top2Data[i].investmentDiff,
              data4Viz.top2Data,
              'investmentDiff'
            )
          : defaultBackground
      );

    // Add tooltips for table data cells
    ToolTipLogic(
      td2,
      animDur,
      tooltip,
      toolTipData,
      top1DataExists
        ? {
            name: data4Viz.top1Data[i].topologyName,
            percent: data4Viz.top1Data[i].bauInvestmentPercent,
            totalSum: data4Viz.top1Data[i].bauInvestment,
          }
        : {
            name: 'NA',
            percent: 0,
            totalSum: 0,
          }
    );
    ToolTipLogic(
      td3,
      animDur,
      tooltip,
      toolTipData,
      top1DataExists
        ? {
            name: data4Viz.top1Data[i].topologyName,
            percent: data4Viz.top1Data[i].optSpendPercent,
            totalSum: data4Viz.top1Data[i].optSpend,
          }
        : {
            name: 'NA',
            percent: 0,
            totalSum: 0,
          }
    );
    ToolTipLogic(
      td4,
      animDur,
      tooltip,
      toolTipDataLastCol,
      top1DataExists
        ? {
            name: data4Viz.top1Data[i].topologyName,
            investmentDiff: data4Viz.top1Data[i].investmentDiff,
          }
        : {
            name: 'NA',
            investmentDiff: 0,
          }
    );
    ToolTipLogic(
      td5,
      animDur,
      tooltip,
      toolTipData,
      top2DataExists
        ? {
            name: data4Viz.top2Data[i].topologyName,
            percent: data4Viz.top2Data[i].optSpendPercent,
            totalSum: data4Viz.top2Data[i].optSpend,
          }
        : {
            name: 'NA',
            percent: 0,
            totalSum: 0,
          }
    );
    ToolTipLogic(
      td6,
      animDur,
      tooltip,
      toolTipDataLastCol,
      top2DataExists
        ? {
            name: data4Viz.top2Data[i].topologyName,
            investmentDiff: data4Viz.top2Data[i].investmentDiff,
          }
        : {
            name: 'NA',
            investmentDiff: 0,
          }
    );
  }
};
