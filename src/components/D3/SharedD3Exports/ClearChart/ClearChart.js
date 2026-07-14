import * as d3 from 'd3';

export const ClearChart = (targetElement) => {
  const element = d3.select(targetElement);
  // reset and clean
  if (!element.empty()) element.selectAll('*').remove();
};
