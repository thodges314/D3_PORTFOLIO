import {
  getIndexDescription,
  getZScoreDescription,
} from '../../../../utils/getTooltipDescription';

export const Headers = (table) => {
  const thead = table.append('thead');
  const tableHeaders = thead.append('tr');
  tableHeaders.append('th').text('ELEMENT');
  tableHeaders.append('th').text('VALUE');
  tableHeaders.append('th').text('CATEGORY');
  tableHeaders.append('th').text('Z-SCORE').attr('title', getZScoreDescription);
  tableHeaders.append('th').text('INDEX').attr('title', getIndexDescription);
};
