export const SortDataTopologyDetail = (inputData, inputData4Viz) => {
  // Sort the data4Viz from biggest to smallest
  const data4Viz = inputData4Viz.sort(
    (obj1, obj2) =>
      obj1.totalSum - obj2.totalSum || obj1.color.localeCompare(obj2.color)
  );
  data4Viz.reverse();
  /*
   * If we're showing the chart for l1_l4, the chart should be sorted in order
   * first nby the color group total dollar value,
   * then within each color group it should sorted by each bar's dollar value.
   */
  if (
    inputData[0]['mta_sample.topology_full'] ===
    inputData[0]['mta_sample.l1_l4']
  ) {
    // Create a set of colors
    const colorSet = new Set();
    data4Viz.forEach((obj) => {
      colorSet.add(obj.color);
    });

    /*
     * For Each Color in the set add a color and its sum to
     * colorTotalSumCount Obj for each color
     */
    const colorTotalSumCount = {};
    colorSet.forEach((color) => {
      data4Viz.forEach((obj) => {
        if (obj.color === color) {
          let currVal = colorTotalSumCount[color];
          if (!currVal) currVal = 0;
          colorTotalSumCount[color] = currVal + Number(obj.totalSum);
        }
      });
    });

    /*
     * Convert the object to an array of arrays so it can be sorted
     * each array contains the color followed by the sum
     */

    const colorArr = Object.entries(colorTotalSumCount);

    // Sort the data based on the dollar amount for Each L1_L4
    const colorArrSorted = colorArr.sort(
      (a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
    );

    /*
     * Starting with the colorGroup with the highest total,
     * add each of those objs to an array and return it to be visualized
     */
    const finalSortedArr = [];
    colorArrSorted.forEach((colorSumPair) => {
      data4Viz.forEach((obj) => {
        if (colorSumPair[0] === obj.color) finalSortedArr.push(obj);
      });
    });
    return finalSortedArr;
  }

  // Return if not l1_l4
  return data4Viz;
};
