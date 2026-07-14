import { colorSetCol23, colorSetCol4 } from '../SetColors';
import { ToolTipLogic } from '../../SharedD3Exports/ToolTip/ToolTipLogic';
import { toolTipData, toolTipDataLastCol } from '../ProcessData';
import { numberWithCommas } from '../../../../utils/formatCommas';

export const TableData = (data4Viz, table, tooltip) => {
  const animDur = 250;
  data4Viz.forEach((obj) => {
    const currRow = table.append('tr');

    // create table data cells for each column
    currRow.append('td').attr('class', 'topology-name').text(obj.topologyName);

    const td2 = currRow
      .append('td')
      .attr('class', 'bau-investment')
      .attr('style', () =>
        colorSetCol23(obj.bauInvestment, data4Viz, 'bauInvestment')
      )
      .text(`$${numberWithCommas(obj.bauInvestment.toFixed(2))}`);

    const td3 = currRow
      .append('td')
      .attr('class', 'opt-spend')
      .attr('style', () => colorSetCol23(obj.optSpend, data4Viz, 'optSpend'))
      .text(`$${numberWithCommas(obj.optSpend.toFixed(2))}`);

    const td4 = currRow
      .append('td')
      .attr('class', 'investment-diff')
      .text(() => {
        if (obj.investmentDiff === 0) return 'NA';
        return `${obj.investmentDiff.toFixed(2)}%`;
      })
      .attr('style', () =>
        colorSetCol4(obj.investmentDiff, data4Viz, 'investmentDiff')
      );

    // Add tooltips for table data cells
    ToolTipLogic(td2, animDur, tooltip, toolTipData, {
      name: obj.topologyName,
      percent: obj.bauInvestmentPercent,
      totalSum: obj.bauInvestment,
    });
    ToolTipLogic(td3, animDur, tooltip, toolTipData, {
      name: obj.topologyName,
      percent: obj.optSpendPercent,
      totalSum: obj.optSpend,
    });
    ToolTipLogic(td4, animDur, tooltip, toolTipDataLastCol, {
      name: obj.topologyName,
      investmentDiff: obj.investmentDiff,
    });
  });
};
