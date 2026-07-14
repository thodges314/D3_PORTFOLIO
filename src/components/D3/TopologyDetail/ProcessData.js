/* eslint-disable no-param-reassign */
export const TotalColumn = (dataset, key) => {
  const grandTotal = dataset.reduce((total, value) => total + value[key], 0);
  return grandTotal;
};

export const ProcessData = (simulatorData) => {
  let data4Viz = [];
  // Reference Vars
  const topologyNameRef = 'mta_sample.l1_l4';
  const bauInvestmentRef = 'mta_sample.chan_tot_cost';
  const optimalSpendRef = 'mta_sample.total_investment';

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

  simulatorData.forEach((obj) => {
    data4Viz.push({
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
  const optimalSpendTotalSum = TotalColumn(data4Viz, 'optSpend');
  const bauInvestmentTotalSum = TotalColumn(data4Viz, 'bauInvestment');
  // Add percents for data4Viz
  data4Viz.forEach((obj) => {
    const optSpendPercent = (obj.optSpend / optimalSpendTotalSum) * 100;
    const bauInvestmentPercent =
      (obj.bauInvestment / bauInvestmentTotalSum) * 100;
    obj.bauInvestmentPercent = bauInvestmentPercent;
    obj.optSpendPercent = optSpendPercent;
  });

  // create sorted data set from biggest to smallest
  // this ensures the visualization is shown in order
  data4Viz = data4Viz.sort(
    (obj1, obj2) => obj1.bauInvestment - obj2.bauInvestment
  );
  data4Viz.reverse();

  // Return the processed data for visualizing
  return data4Viz;
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
