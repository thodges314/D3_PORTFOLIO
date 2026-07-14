import { getAggData } from '../../../utils/getAggData';

export const TotalColumn = (dataset, key) => {
  const grandTotal = dataset.reduce((total, value) => total + value[key], 0);
  return grandTotal;
};

const getTopScenarios = (data) => {
  let topScen1 = [];
  let topScen2 = [];
  for (let i = 0; i < data.length; i += 1) {
    if (data[i]['mta_sample.scenario_top_flg'] === 1) {
      topScen1.push(data[i]);
    }
    if (data[i]['mta_sample.scenario_top_flg'] === 2) {
      topScen2.push(data[i]);
    }
  }

  topScen1 = getAggData(topScen1);
  topScen2 = getAggData(topScen2);
  return {
    topScen1,
    topScen2,
  };
};

export const ProcessData = (scenariosData) => {
  // Reference Vars
  const topologyNameRef = 'mta_sample.l1_l4';
  const bauInvestmentRef = 'mta_sample.chan_tot_cost';
  const optimalSpendRef = 'mta_sample.total_investment';

  const topScenarios = getTopScenarios(scenariosData);

  const calculateInvestmentDiff = (optSpend, bauInvestment) => {
    if ((optSpend === 0 && bauInvestment === 0) || optSpend === bauInvestment) {
      return 0;
    }
    if (bauInvestment === 0 && optSpend !== 0) {
      return 100;
    }
    if (optSpend === 0) {
      return -100;
    }
    return -1 * (((bauInvestment - optSpend) / bauInvestment) * 100);
  };

  let top1Data = [];
  let top2Data = [];
  topScenarios.topScen1.forEach((obj) => {
    top1Data.push({
      topologyName: obj[topologyNameRef],
      optSpend: obj[optimalSpendRef],
      bauInvestment: obj[bauInvestmentRef],
      investmentDiff: calculateInvestmentDiff(
        obj[optimalSpendRef],
        obj[bauInvestmentRef]
      ),
    });
  });

  topScenarios.topScen2.forEach((obj) => {
    top2Data.push({
      topologyName: obj[topologyNameRef],
      optSpend: obj[optimalSpendRef],
      bauInvestment: obj[bauInvestmentRef],
      investmentDiff: calculateInvestmentDiff(
        obj[optimalSpendRef],
        obj[bauInvestmentRef]
      ),
    });
  });

  // Calculate Column Totals
  const optimalSpendTotalSumTop1 = TotalColumn(top1Data, 'optSpend');
  const optimalSpendTotalSumTop2 = TotalColumn(top2Data, 'optSpend');
  const bauInvestmentTotalSumTop1 = TotalColumn(top1Data, 'bauInvestment');
  const bauInvestmentTotalSumTop2 = TotalColumn(top2Data, 'bauInvestment');
  // Add percents for data4Viz
  top1Data.forEach((obj) => {
    const optSpendPercent = (obj.optSpend / optimalSpendTotalSumTop1) * 100;
    const bauInvestmentPercent =
      (obj.bauInvestment / bauInvestmentTotalSumTop1) * 100;
    // eslint-disable-next-line no-param-reassign
    obj.bauInvestmentPercent = bauInvestmentPercent;
    // eslint-disable-next-line no-param-reassign
    obj.optSpendPercent = optSpendPercent;
  });

  top2Data.forEach((obj) => {
    const optSpendPercent = (obj.optSpend / optimalSpendTotalSumTop2) * 100;
    const bauInvestmentPercent =
      (obj.bauInvestment / bauInvestmentTotalSumTop2) * 100;
    // eslint-disable-next-line no-param-reassign
    obj.bauInvestmentPercent = bauInvestmentPercent;
    // eslint-disable-next-line no-param-reassign
    obj.optSpendPercent = optSpendPercent;
  });

  // create sorted data set from biggest to smallest
  // this ensures the visualization is shown in order
  top1Data = top1Data.sort(
    (obj1, obj2) => obj1.bauInvestment - obj2.bauInvestment
  );
  top1Data.reverse();

  top2Data = top2Data.sort(
    (obj1, obj2) => obj1.bauInvestment - obj2.bauInvestment
  );
  top2Data.reverse();

  // Return the processed data for visualizing
  return { top1Data, top2Data };
};

export const toolTipData = [
  {
    label: 'Name',
    dataRef: 'name',
    dataType: 'string',
    prefix: '',
    suffix: '',
  },
  {
    label: 'Percent',
    dataRef: 'percent',
    dataType: 'number',
    prefix: '',
    suffix: '%',
  },
  {
    label: 'Total',
    dataRef: 'totalSum',
    dataType: 'number',
    prefix: '$',
    suffix: '',
  },
];
export const toolTipDataLastCol = [
  {
    label: 'Name',
    dataRef: 'name',
    dataType: 'string',
    prefix: '',
    suffix: '',
  },
  {
    label: 'Investment Difference',
    dataRef: 'investmentDiff',
    dataType: 'number',
    prefix: '',
    suffix: '%',
  },
];
