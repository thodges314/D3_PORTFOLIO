import * as d3 from 'd3';
import { dataFieldsByColumn } from '../../../../utils/constants';
import { oldLifestage, prime } from './chartCategories.json';

const numberAsPercent = (num) => `${(num * 100).toFixed(2)}%`;

const scatterplot = (selection, props) => {
  const {
    data,
    width,
    height,
    margin,
    radiusScale,
    colorScale,
    xValue,
    yValue,
    rValue,
    toolTipRef,
  } = props;

  const moveTooltip = (e, d) => {
    const textArray = [
      d[dataFieldsByColumn['value']],
      ['Index', d[dataFieldsByColumn['index']].toFixed(0)],
      ['Z-Score', d[dataFieldsByColumn['zscore']].toFixed(2)],
      [
        'Target Percentage',
        numberAsPercent(d[dataFieldsByColumn['targetPercentage']]),
      ],
      [
        'Reference Percentage',
        numberAsPercent(d[dataFieldsByColumn['referencePercentage']]),
      ],
    ];
    const position = { x: e.pageX, y: e.pageY };
    toolTipRef.current.moveToolTip(textArray, position);
  };

  const chartLabels = {
    topLeft: { main: 'Overperforming', sub: 'Moderate Growth Potential' },
    topRight: { main: 'Overperforming', sub: 'Top Growth Potential' },
    bottomRight: { main: 'Underperforming', sub: 'Moderate Growth Potential' },
    bottomLeft: { main: 'Underperforming', sub: 'Low Growth Potential' },
  };
  const xAxisLabel = 'Percent of total reference';
  const yAxisLabel = 'Index';
  const xRefLine = 0.025;
  const yRefLine = 100;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const chartG = selection
    .append('g')
    .attr('width', `${innerWidth}px`)
    .attr('height', `${innerHeight}px`)
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // D3 scales
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, xValue))
    .range([0, innerWidth])
    .nice();
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, yValue))
    .range([innerHeight, 0])
    .nice();

  const encodeCategory =
    data[0][dataFieldsByColumn.subPage] === 'Lifestage' ? oldLifestage : prime;

  // D3 axis
  const yAxisGenerator = d3
    .axisLeft(yScale)
    .tickSize(-innerWidth)
    .tickPadding(10);
  const xAxisTickFormat = (number) => d3.format('.1%')(number);
  const xAxisGenerator = d3
    .axisBottom(xScale)
    .tickFormat(xAxisTickFormat)
    .tickSize(-innerHeight)
    .tickPadding(10)
    .ticks(8);

  // render x axis
  const xAxis = chartG
    .append('g')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(xAxisGenerator);
  chartG
    .append('text')
    .attr('class', 'axis-label fill-gray')
    .attr('y', innerHeight + 50)
    .attr('x', innerWidth / 2 - 80)
    .text(xAxisLabel);

  xAxis.selectAll('.tick text').attr('class', 'scatter-tick-text');
  xAxis.selectAll('.tick line').attr('class', 'scatter-tick-line');
  xAxis.select('.domain').remove();

  // render y axis
  const yAxis = chartG.append('g').call(yAxisGenerator);
  chartG
    .append('text')
    .attr('class', 'axis-label fill-gray')
    .attr('y', -50)
    .attr('transform', `rotate(-90)`)
    .attr('text-anchor', 'middle')
    .attr('x', -innerHeight / 2)
    .text(yAxisLabel);

  yAxis.selectAll('.tick text').attr('class', 'scatter-tick-text');
  yAxis.selectAll('.tick line').attr('class', 'scatter-tick-line');
  yAxis.select('.domain').remove();

  // render reference lines
  chartG
    .append('line')
    .attr('class', 'ref-lines')
    .attr('id', 'y-ref-line')
    .attr('x1', 0)
    .attr('y1', yScale(yRefLine))
    .attr('y2', yScale(yRefLine))
    .attr('x2', innerWidth);
  chartG
    .append('line')
    .attr('class', 'ref-lines')
    .attr('id', 'x-ref-line')
    .attr('y1', 0)
    .attr('y2', innerHeight)
    .attr('x1', xScale(xRefLine))
    .attr('x2', xScale(xRefLine))
    .attr('class', 'ref-lines');

  // render circles
  chartG
    .append('g')
    .selectAll('dot')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'scatter-circle')
    .attr('cy', (d) => yScale(yValue(d)))
    .attr('cx', (d) => xScale(xValue(d)))
    .attr('r', (d) => radiusScale(rValue(d)))
    .attr('fill', (d) =>
      colorScale(encodeCategory[d[dataFieldsByColumn.personixCategory]])
    )
    .on('mouseover', (e, d) => {
      moveTooltip(e, d);
    });
  // .attr('fill', 'lightblue');

  // chart labels
  chartG
    .append('text')
    .attr('class', 'chart-label fill-gray')
    .attr('y', -20)
    .attr('x', 10)
    .text(chartLabels.topLeft.main);
  chartG
    .append('text')
    .attr('class', 'chart-label fill-gray')
    .attr('y', -40)
    .attr('x', 10)
    .text(chartLabels.topLeft.sub);
  chartG
    .append('text')
    .attr('class', 'chart-label fill-gray')
    .attr('id', 'top-right-label')
    .attr('y', -20)
    .attr('x', innerWidth - 150)
    .text(chartLabels.topRight.main);
  chartG
    .append('text')
    .attr('class', 'chart-label fill-gray')
    .attr('y', -40)
    .attr('x', innerWidth - 150)
    .text(chartLabels.topRight.sub);
  chartG
    .append('text')
    .attr('class', 'chart-label fill-gray')
    .attr('id', 'bottom-left-label')
    .attr('y', innerHeight - 40 + 80)
    .attr('x', 10)
    .text(chartLabels.bottomLeft.main);
  chartG
    .append('text')
    .attr('class', 'chart-label fill-gray')
    .attr('y', innerHeight - 20 + 80)
    .attr('x', 10)
    .text(chartLabels.bottomLeft.sub);
  chartG
    .append('text')
    .attr('class', 'chart-label fill-gray')
    .attr('id', 'bottom-right-label')
    .attr('y', innerHeight - 40 + 80)
    .attr('x', innerWidth - 150)
    .text(chartLabels.bottomRight.main);
  chartG
    .append('text')
    .attr('class', 'chart-label fill-gray')
    .attr('y', innerHeight - 20 + 80)
    .attr('x', innerWidth - 150)
    .text(chartLabels.bottomRight.sub);
};

export default scatterplot;
