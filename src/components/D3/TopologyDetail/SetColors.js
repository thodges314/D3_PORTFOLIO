import * as d3 from 'd3';

const colLowColor23 = '#baeadd';
const colMidColor23 = '#4cbecb';
const colHighColor23 = '#1a6693';
const lightTextColor23 = '#ccdbe5';
const lightTextColor4 = '#edceca';
const colLowColor4 = '#FF2400';
const colMidColor4 = 'white';
const colHighColor4 = 'green';
const darkColorCutoff = 330;

const isColorDark = (rgbColor) => {
  let formattedRgbColor = rgbColor;
  formattedRgbColor = rgbColor.replace('rgb(', '');
  formattedRgbColor = formattedRgbColor.replace(')', '');
  const rgbColorArr = formattedRgbColor.split(',');
  const r = Number(rgbColorArr[0]);
  const g = Number(rgbColorArr[1]);
  const b = Number(rgbColorArr[2]);
  if (r + g + b < darkColorCutoff) return true;
  return false;
};

const setColors = (val, lowColor, colorScale, lightTextColor) => {
  let styleOutput = '';
  if (val == null) {
    styleOutput += `background:${lowColor}`;
    return styleOutput;
  }
  const backgroundColor = colorScale(val);
  styleOutput += `background: ${backgroundColor};`;
  // if the background color is dark, make the text the light color
  if (isColorDark(backgroundColor)) {
    styleOutput += ` color: ${lightTextColor};`;
  }
  return styleOutput;
};

export const colorSetCol23 = (val, data4Viz, ref) => {
  const colMin = d3.min(data4Viz, (d) => d[ref]);
  const colMax = d3.max(data4Viz, (d) => d[ref]);
  const colMid = d3.median(data4Viz, (d) => d[ref]);
  const colorScaleCol = d3
    .scaleLinear()
    .domain([colMin, colMid, colMax])
    .range([colLowColor23, colMidColor23, colHighColor23]);
  return setColors(val, colLowColor23, colorScaleCol, lightTextColor23);
};

export const colorSetCol4 = (val, data4Viz, ref) => {
  const colMin = d3.min(data4Viz, (d) => d[ref]);
  const colMax = d3.max(data4Viz, (d) => d[ref]);
  const colMid = 0;
  const colorScaleCol = d3
    .scaleLinear()
    .domain([colMin, colMid, colMax])
    .range([colLowColor4, colMidColor4, colHighColor4]);
  return setColors(val, colLowColor4, colorScaleCol, lightTextColor4);
};
