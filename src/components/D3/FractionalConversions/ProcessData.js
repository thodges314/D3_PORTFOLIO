export const ProcessData = (simulatorData, topologyDetailLevel) => {
  // From discussion with Brian 2/23,
  // we need to sum the fractional bucket conversions for each channel.
  // This is implemented by first creating an array "channelNames" with
  // all unique channel names.
  // For each in channelNames, loop through the dataset and
  // calculate the total sum of all item's fractional bucket conversion
  // with that channelName.
  // Then add that as a key value pair for all objects with that channelName
  // to a data4Viz obj along with the name, color and percent

  // Create a set contain unique values for the channel names stored as mta_sample.l1 keys
  const objValues = new Set();
  simulatorData.forEach((obj) => {
    objValues.add(obj[topologyDetailLevel]);
  });

  // The containing Arr contains arrays of obj with given value
  // for each mta_sample.l1 value in the set,
  // push an array of all the items in the dataset that
  // have the matching mta_sample.l1 value
  const containingArr = [];
  objValues.forEach((val) => {
    containingArr.push(
      simulatorData.filter((entry) => entry[topologyDetailLevel] === val)
    );
  });

  // Create a new array data4Viz that will contain the info for the visualization
  // this includes the total fract convs for each channal, the channel name
  // and the percentage of the whole for each fract conv
  let data4Viz = [];

  containingArr.forEach((arr) => {
    let totalSum = 0;
    arr.forEach((obj) => {
      totalSum += obj['mta_sample.total_conv'];
    });
    // TODO Replace with general solution
    // where the data for all the charts is validated before the chart is drawn
    // If the fract conversions are negative due to bad data, total sum should just be zero
    if (totalSum < 0) totalSum = 0;
    data4Viz.push({
      channelName: arr[0][topologyDetailLevel],
      color: arr[0]['mta_sample.l1_hex_color'],
      totalSum,
      percent: null,
    });
  });

  // Calculate the percentages for each channel
  // First calculate the grand total for everything
  const totalFracConv = data4Viz.reduce(
    (total, value) => total + value.totalSum,
    0
  );
  // Then divide each channel's totalSum by the grand total as long as total sum is greater than zero
  data4Viz.forEach((obj) => {
    let percentage = 0;
    if (obj.totalSum > 0) percentage = (obj.totalSum / totalFracConv) * 100;
    Object.defineProperty(obj, 'percent', {
      value: percentage,
    });
  });

  // create sorted data set by fract conv in reverse order from biggest to smallest
  // this ensures the visualization is shown in order
  data4Viz = data4Viz.sort((obj1, obj2) => obj1.percent - obj2.percent);
  data4Viz.reverse();

  // Return the processed data for visualizing
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
  },
];
