export const ProcessData = (data, topologyDetailLevel) => {
  // Code adapted from ../FractionalConversions/ProcessData
  // created by Jarvis @jaraym_acxiom
  // percent and totalSum are not needed for this viz
  // these values are used to sort in the same order as FractionalConversions

  // Create a set contain unique values for the channel names
  // stored as mta_sample.l1 keys
  const objValues = new Set();
  data.forEach((obj) => {
    objValues.add(obj[topologyDetailLevel]);
  });

  // The containing Arr contains arrays of obj with given value
  // for each mta_sample.l1 value in the set,
  // push an array of all the items in the dataset that
  // have the matching mta_sample.l1 value
  const containingArr = [];
  objValues.forEach((val) => {
    containingArr.push(
      data.filter((entry) => entry[topologyDetailLevel] === val)
    );
  });

  // Create a new array data4Viz that will contain the info for the visualization
  // this includes the optimized CPC that's calculated using optimal spend
  // and optimized conversions
  let data4Viz = [];
  containingArr.forEach((arr) => {
    let totalSum = 0;
    let optimalSpend = 0;
    let optimizedConv = 0;
    arr.forEach((obj) => {
      totalSum += obj['mta_sample.total_conv'];
      optimalSpend += obj['mta_sample.total_investment'];
      optimizedConv += obj['mta_sample.total_conv'];
    });
    if (optimizedConv === 0) {
      console.error('Data Issue in Lollipop Chart: Optimized CPC is 0');
      data4Viz.push({
        channelName: arr[0][topologyDetailLevel],
        color: arr[0]['mta_sample.l1_hex_color'],
        totalSum,
        percent: null,
        optimized_cpc: 0,
      });
    } else {
      data4Viz.push({
        channelName: arr[0][topologyDetailLevel],
        color: arr[0]['mta_sample.l1_hex_color'],
        totalSum,
        percent: null,
        optimized_cpc: optimalSpend / optimizedConv,
      });
    }
  });

  const totalFracConv = data4Viz.reduce(
    (total, value) => total + value.totalSum,
    0
  );
  // Then divide each channel's totalSum by the grand total
  data4Viz.forEach((obj) => {
    Object.defineProperty(obj, 'percent', {
      value: (obj.totalSum / totalFracConv) * 100,
    });
  });

  // create sorted data set by fract conv in reverse order from biggest to smallest
  // this ensures the visualization is shown in order
  data4Viz = data4Viz.sort((obj1, obj2) => obj1.percent - obj2.percent);
  data4Viz.reverse();

  // Return the processed data for visualizing
  // return data4Viz;
  return data4Viz;
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
    label: 'CPC',
    dataRef: 'optimized_cpc',
    dataType: 'number',
    prefix: '$',
    suffix: '',
  },
];
