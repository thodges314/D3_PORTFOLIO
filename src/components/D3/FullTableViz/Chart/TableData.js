import * as d3 from 'd3';
import { BarChart } from './BarChart';
// import { Badge } from './Badge';
import { TextOverflowEllipsis } from '../../SharedD3Exports/TextOverflowEllipsis/TextOverflowEllipsis';
import { dataFieldsByColumn } from '../../../utils/constants';

const MAX_CHARS_BY_COLUMN = {
  category: 30,
  element: 70,
  value: 30,
  statRelevance: 30,
};

export const TableData = (data, tbody) => {
  if (data.length !== 0) {
    const xScale = d3.scaleLinear().domain([0, 400 * 1.2]);

    data.every((element) => {
      const dataRow = tbody.append('tr');
      dataRow
        .append('td')
        .attr('class', 'table-cell td_element')
        .attr('title', element[dataFieldsByColumn.elementCode])
        .text(
          TextOverflowEllipsis(
            element[dataFieldsByColumn.element],
            MAX_CHARS_BY_COLUMN.element
          )
        );
      dataRow
        .append('td')
        .attr('class', 'table-cell')
        .attr('title', element[dataFieldsByColumn.value])
        .text(
          TextOverflowEllipsis(
            element[dataFieldsByColumn.value],
            MAX_CHARS_BY_COLUMN.value
          )
        );
      dataRow
        .append('td')
        .attr('class', 'table-cell')
        .text(
          TextOverflowEllipsis(
            element[dataFieldsByColumn.category],
            MAX_CHARS_BY_COLUMN.category
          )
        );
      // const tdBadge =
      dataRow
        .append('td')
        .attr('class', 'table-cell center td_zscore')
        .text(
          TextOverflowEllipsis(
            Number(element[dataFieldsByColumn.statRelevance]).toFixed(2),
            MAX_CHARS_BY_COLUMN.statRelevance
          )
        );
      const tdBar = dataRow.append('td').attr('class', 'table-cell');

      // Badge(tdBadge, element[dataFieldsByColumn.statRelevance]);
      BarChart(
        tdBar,
        element[dataFieldsByColumn.index]
          ? Number(element[dataFieldsByColumn.index]).toFixed(0)
          : 1,
        xScale
      );
      return true;
    });
  }
};
