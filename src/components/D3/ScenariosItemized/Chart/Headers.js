export const Headers = (table) => {
  const firstColumLabel = 'BAU Investment';
  const secondColumLabel = 'Optimal Investment';
  const thirdColumLabel = 'Difference in Investment';

  const mainHeaders = table.append('tr');
  mainHeaders.append('th').attr('class', 'table-header-border').text('');
  mainHeaders
    .append('th')
    .attr('colspan', 1)
    .attr('class', 'table-header-border')
    .text('Business as usual');
  mainHeaders
    .append('th')
    .attr('colspan', 2)
    .attr('class', 'table-header-border')
    .text('Scenario 2');
  mainHeaders
    .append('th')
    .attr('colspan', 2)
    .attr('class', 'table-header-border')
    .text('Scenario 3');
  const secondaryHeaders = table.append('tr');
  secondaryHeaders
    .append('th')
    .attr('class', 'table-header-border')
    .text('Topology Name');
  secondaryHeaders
    .append('th')
    .attr('class', 'table-header-border')
    .text(firstColumLabel);
  secondaryHeaders.append('th').text(secondColumLabel);
  secondaryHeaders
    .append('th')
    .attr('class', 'table-header-border')
    .text(thirdColumLabel);
  secondaryHeaders.append('th').text(secondColumLabel);
  secondaryHeaders
    .append('th')
    .attr('class', 'table-header-border')
    .text(thirdColumLabel);
};
