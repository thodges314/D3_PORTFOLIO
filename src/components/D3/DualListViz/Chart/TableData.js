import { dataFieldsByColumn } from '../../../../utils/constants';
import { TextOverflowEllipsis } from '../../SharedD3Exports/TextOverflowEllipsis/TextOverflowEllipsis';

const MAX_CHARS = 45;

export const TableData = (data, tbody, yAttr, xAttr) => {
  if (data.length !== 0) {
    data.every((element) => {
      const dataRow = tbody.append('tr');
      dataRow
        .append('td')
        .attr('class', 'table-cell td_value text-gray')
        .attr('title', element[yAttr])
        .text(TextOverflowEllipsis(element[yAttr], MAX_CHARS));
      dataRow
        .append('td')
        .attr('class', 'table-cell td_index text-primary')
        .attr('title', element[xAttr])
        .text(
          element[dataFieldsByColumn.index]
            ? Number(element[xAttr]).toFixed(0)
            : 1
        );
      return true;
    });
  }
};
