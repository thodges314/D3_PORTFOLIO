import { SortDataTopologyDetail } from './SortDataTopologyDetail';

export const ProcessData = (inputData, costType, topologyDetailLevel) => {
  /*
   * From discussion with Brian 2/23,
   * we need to sum the fractional bucket conversions for each channel.
   * This is implemented by first creating an array "channelNames" with
   * all unique channel names.
   * For each in channelNames, loop through the dataset and
   * calculate the total sum of all item's fractional bucket conversion
   * with that channelName.
   * Then add that as a key value pair for all objects with that channelName
   * to a data4Viz obj along with the name, color and percent
   * Create a set contain unique values for the channel names stored as the
   * topologyDetailLevel keys
   */
  const objValues = new Set();
  inputData.forEach((obj) => {
    objValues.add(obj[topologyDetailLevel]);
  });

  /*
   * The containing Arr contains arrays of obj with given value
   * for each mta_sample.l1 value in the set,
   * push an array of all the items in the dataset that
   * have the matching topologyDetailLevel value
   */
  const containingArr = [];
  objValues.forEach((val) => {
    containingArr.push(
      inputData.filter((entry) => entry[topologyDetailLevel] === val)
    );
  });

  /*
   * Create a new array data4Viz that will contain the info for the visualization
   * this includes the total fract convs for each channal, the channel name,
   * and the percentage of the whole for each fract conv
   */
  const data4Viz = [];
  containingArr.forEach((arr) => {
    let totalSum = 0;
    arr.forEach((obj) => {
      totalSum += obj[costType];
    });
    data4Viz.push({
      channelName: arr[0][topologyDetailLevel],
      color: arr[0]['mta_sample.l1_hex_color'],
      totalSum,
      percent: null,
    });
  });

  /*
   * Calculate the percentages for each channel
   * First calculate the grand total for everything
   */
  const grandTotal = data4Viz.reduce(
    (total, value) => total + value.totalSum,
    0
  );
  // Then divide each channel's totalSum by the grand total
  data4Viz.forEach((obj) => {
    const objPercent = (obj.totalSum / grandTotal) * 100;
    // This approach avoids directly mutating the data4Viz's obj
    Object.defineProperty(obj, 'percent', {
      value: objPercent,
    });
  });

  // Return the processed data for visualizing
  return SortDataTopologyDetail(inputData, data4Viz);
};

export const FindArrTotal = (dataset) => {
  const arrTotal = dataset.reduce((total, value) => total + value.totalSum, 0);
  return arrTotal.toFixed(0);
};

export const FindMaxSpendForAll = (datasetsArr) => {
  const totalSpendArr = [];
  datasetsArr.forEach((arr) => {
    const totalSpendForArr = FindArrTotal(arr);
    totalSpendArr.push(totalSpendForArr);
  });
  return Math.max(...totalSpendArr);
};

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
