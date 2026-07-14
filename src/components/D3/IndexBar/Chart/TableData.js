import * as d3 from 'd3';
import { BarChart } from './BarChart';
import { dataFieldsByColumn } from '../../../../utils/constants';

export const TableData = (data, tbody, yAttr, xAttr) => {
  if (data.length !== 0) {
    const xScale = d3.scaleLinear().domain([0, 400 * 1.2]);
    data.every((element) => {
      const dataRow = tbody.append('tr');
      dataRow
        .append('td')
        .attr('class', 'table-cell td_value text-gray')
        .append('div')
        .attr('title', element[yAttr])
        .text(element[yAttr]);
      const tdBar = dataRow
        .append('td')
        .attr('class', 'table-cell td_index')
        .attr('title', element[xAttr]);

      BarChart(
        tdBar,
        element[dataFieldsByColumn.index]
          ? Number(element[xAttr]).toFixed(0)
          : 1,
        xScale
      );
      return true;
    });
  }
};
