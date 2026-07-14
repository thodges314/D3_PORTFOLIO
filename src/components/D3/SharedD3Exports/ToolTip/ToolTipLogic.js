import { numberWithCommas } from '../../../../utils/formatCommas';

// if creating tooltip using d3 enter(), do not pass inputData parameter
// otherwise specify inputData as an object
export const ToolTipLogic = (el, animDur, toolTip, toolTipData, inputData) => {
  const leftOffset = 55;
  const topOffset = 65;
  const defaultDecimalPlaces = 2;
  toolTip.html('');
  el.on('mouseover', (event, d) => {
    // eslint-disable-next-line no-param-reassign
    if (!d) d = inputData;

    toolTip.transition().duration(animDur).style('opacity', 1);
    toolTip
      .html('')
      .style('left', `${event.pageX - leftOffset - 125}px`)
      .style('top', `${event.pageY - topOffset - 40}px`);

    toolTipData.forEach((obj) => {
      toolTip
        .append('span')
        .text(() => {
          const { label } = obj;
          let data = d[obj.dataRef];

          // If decimalPlaces are included in the obj, use them
          // otherwise use the default decimal places
          const decimalPlaces =
            typeof obj.decimalPlaces !== 'undefined'
              ? obj.decimalPlaces
              : defaultDecimalPlaces;
          if (obj.dataType === 'number') {
            data = d[obj.dataRef].toFixed(decimalPlaces);
            data = numberWithCommas(data);
          }

          return `${label}: ${obj.prefix + data + obj.suffix}`;
        })
        .append('br');
    });
  }).on('mouseout', () => {
    toolTip.transition().duration(animDur).style('opacity', 0);
  });
};
