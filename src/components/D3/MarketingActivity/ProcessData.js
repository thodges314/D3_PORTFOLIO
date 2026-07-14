export const ProcessData = (simulatorData, topologyDetailLevel) => {
  // This creates the data4Viz obj used by the visualization
  // this sums the optimal spend, touches and conversions for each channel.
  // This is implemented by first creating an array "channelNames" with
  // all unique channel names.
  // For each in channelNames, this loops through the dataset and
  // calculates the total sum of all item's needed dimensions
  // with that channelName.
  // Then adds that as a key value pair for all objects with that channelName
  // to a data4Viz obj along with the name, color, control type, total and percents

  // Reference Vars
  const optimalSpendRef = 'mta_sample.total_investment';
  const touchesRef = 'mta_sample.total_touches';
  const conversionsRef = 'mta_sample.total_conv';

  // Create a set contain unique values for the channel names stored as mta_sample.l1 keys
  const objValuesSet = new Set();
  simulatorData.forEach((obj) => {
    objValuesSet.add(obj[topologyDetailLevel]);
  });

  // The containing Arr contains arrays of obj with given value
  // for each mta_sample.l1 value in the set,
  // push an array of all the items in the dataset that
  // have the matching mta_sample.l1 value
  const containingArr = [];
  objValuesSet.forEach((val) => {
    containingArr.push(
      simulatorData.filter((entry) => entry[topologyDetailLevel] === val)
    );
  });

  // Create a new array data4Viz that will contain the info for the visualization
  // this includes the dimensions needed for each channal, the channel name
  // the totals and the percentage of the whole for each
  const data4Viz = [];
  containingArr.forEach((arr) => {
    let touchesTotalSum = 0;
    let optimalSpendTotalSum = 0;
    let conversionsTotalSum = 0;
    arr.forEach((obj) => {
      touchesTotalSum += obj[touchesRef];
      optimalSpendTotalSum += obj[optimalSpendRef];
      conversionsTotalSum += obj[conversionsRef];
    });
    data4Viz.push({
      channelName: arr[0][topologyDetailLevel],
      color: arr[0]['mta_sample.l1_hex_color'],
      touchesTotalSum,
      optimalSpendTotalSum,
      conversionsTotalSum,
      controlType: arr[0]['mta_sample.chan_type'],
      touchesPercent: null,
      optimalSpendPercent: null,
      conversionsPercent: null,
    });
  });

  // Calculate the percentages for each channel
  // Calculate the grand total for touches
  const totalTouches = data4Viz.reduce(
    (total, value) => total + value.touchesTotalSum,
    0
  );
  // Then divide each channel's totalSum by the grand total
  data4Viz.forEach((obj) => {
    if (totalTouches === 0) {
      console.error('Data Issue in Marketing Activity: Touches 0');
      Object.defineProperty(obj, 'touchesPercent', {
        value: 0,
      });
    } else {
      Object.defineProperty(obj, 'touchesPercent', {
        value: (obj.touchesTotalSum / totalTouches) * 100,
      });
    }
  });

  // Calculate the grand total for optimalSpend
  const totalOptimalSpend = data4Viz.reduce(
    (total, value) => total + value.optimalSpendTotalSum,
    0
  );
  // Then divide each channel's totalSum by the grand total
  data4Viz.forEach((obj) => {
    if (totalOptimalSpend === 0) {
      console.error('Data Issue in Marketing Activity: Opt Spend 0');
      Object.defineProperty(obj, 'optimalSpendPercent', {
        value: 0,
      });
    } else {
      Object.defineProperty(obj, 'optimalSpendPercent', {
        value: (obj.optimalSpendTotalSum / totalOptimalSpend) * 100,
      });
    }
  });

  // Calculate the grand total for conversions
  const totalConversions = data4Viz.reduce(
    (total, value) => total + value.conversionsTotalSum,
    0
  );
  // Then divide each channel's totalSum by the grand total
  data4Viz.forEach((obj) => {
    if (totalConversions === 0) {
      console.error('Data Issue in Marketing Activity: Conversions 0');
      Object.defineProperty(obj, 'conversionsPercent', {
        value: 0,
      });
    } else {
      Object.defineProperty(obj, 'conversionsPercent', {
        value: (obj.conversionsTotalSum / totalConversions) * 100,
      });
    }
  });

  // Return the processed data for visualizing
  return data4Viz;
};

// Returns a dataset filtered and sorted by the control type
export const ControlTypeDataset = (data4Viz, controlType) => {
  const outputDataset = data4Viz.filter(
    (entry) => entry.controlType === controlType
  );
  outputDataset.sort((a, b) => (a.channelName > b.channelName ? 1 : -1));
  return outputDataset;
};

// Returns the maximum value for a key in a JSON obj
export const GetMaxValue = (arr, key) => {
  let maxVal = 0;
  arr.forEach((obj) => {
    if (obj[key] > maxVal) maxVal = obj[key];
  });
  return maxVal;
};

export const toolTipDataCol2and3 = [
  {
    label: 'Channel',
    dataRef: 'channelName',
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
    prefix: '',
    suffix: '',
    decimalPlaces: 0,
  },
];
export const toolTipData = [
  {
    label: 'Channel',
    dataRef: 'channelName',
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
