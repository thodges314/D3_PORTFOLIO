import React, { useEffect, useContext, useRef } from 'react';
import * as d3 from 'd3';
import ToolTipContext from '../../../context/ToolTipContext';
import { dataFieldsByColumn } from '../../../utils/constants';
import { getIndexDescription } from '../../../utils/getTooltipDescription';
import './RadialScatter.scss';

const WIDTH = 1200;
const HEIGHT = 800;

const INNER_SQUARE = Math.min(WIDTH, HEIGHT);

const INNER_DOTS = INNER_SQUARE / 8;
const OUTER_DOTS = INNER_SQUARE / 2 - 60;
const OUTER_ARC = INNER_SQUARE / 2 - 30;
const TEXT_ARC = INNER_SQUARE / 2 - 26;

const NOTCH_LENGTH = 10;

const SMALL_DOT_RADIUS = 4;
const LARGE_DOT_RADIUS = 7;

const cleanNonAlphaEnums = (str) => str.replace(/[^A-Za-z0-9]/g, '');

const uniqueKey = (d) =>
  cleanNonAlphaEnums(
    `${d[dataFieldsByColumn['category']]}${d['dpa_main.marketing_name']}${
      d[dataFieldsByColumn['index']]
    }`
  );

const colorScale = d3
  .scaleLinear()
  .domain([0, 100, 150, 250])
  .range(['#ff5c39', '#A199A6', '#3e92d6', '#3782ba'])
  .clamp(true);

// const dotScaleUnclamped = d3
//   .scaleLinear()
//   .domain([0, 250])
//   .range([INNER_DOTS, OUTER_DOTS]);

const dotScale = d3
  .scaleLinear()
  .domain([0, 250])
  .range([INNER_DOTS, OUTER_DOTS]) // inner dot ring to outer dot ring
  .clamp(true);

const valueToCoords = (value, angle) => ({
  x: WIDTH / 2 + dotScale(value) * Math.sin(angle),
  y: HEIGHT / 2 - dotScale(value) * Math.cos(angle),
});

// const valueToCoordsUnclamped = (value, angle) => ({
//   x: WIDTH / 2 + dotScaleUnclamped(value) * Math.sin(angle),
//   y: HEIGHT / 2 - dotScaleUnclamped(value) * Math.cos(angle),
// });

const valueToCoordsNoScale = (value, angle) => ({
  x: WIDTH / 2 + value * Math.sin(angle),
  y: HEIGHT / 2 - value * Math.cos(angle),
});

const roundToTens = (num) => Math.round(num / 10) * 10;

const numberAsPercent = (num) => `${(num * 100).toFixed(2)}%`;

const numberIndeces = (data) =>
  data.map((d) => ({
    ...d,
    'dpa_main.index': parseFloat(d[dataFieldsByColumn['index']]),
  }));

const getCategories = (data) =>
  Array.from(new Set(data.map((d) => d[dataFieldsByColumn['category']])));

const nestCategories = (data) =>
  getCategories(data).map((category) => ({
    category: category,
    data: data.filter((d) => d[dataFieldsByColumn['category']] === category),
  }));

const overFlow = (datum) => datum.category.length - 2 * datum.data.length;

const alternateSortCategories = (data) => {
  const nstCategories = nestCategories(data).sort(
    (a, b) => overFlow(b) - overFlow(a)
  );
  const returnArray = [];
  let i = 0,
    j = nstCategories.length - 1;
  while (i < j) {
    returnArray.push(nstCategories[j--]);
    returnArray.push(nstCategories[i++]);
  }
  if (nstCategories.length % 2 !== 0) returnArray.push(nstCategories[i]);
  return returnArray;
};

const flattenElements = (data) =>
  alternateSortCategories(data).reduce((acc, cv) => acc.concat(cv.data), []);

export const RadialScatter = ({ data }) => {
  const svgRef = useRef(null);
  const axisGRef = useRef(null);
  const graphGRef = useRef(null);
  const dotsGRef = useRef(null);
  const seperatorGRef = useRef(null);
  const deltaThetaRef = useRef(null);
  const toolTipRef = useContext(ToolTipContext);
  const dataRef = useRef([]);
  const categoriesRef = useRef([]);
  const nestedElementsSortedRef = useRef({});
  const flattenedElementsRef = useRef([]);

  const getNotClasses = (category, prefix) =>
    categoriesRef.current
      .filter((c) => c !== category)
      .reduce(
        (acc, cv) => `${acc} ${prefix}-not-${cleanNonAlphaEnums(cv)}`,
        ''
      );

  //tooptip functions
  const moveTooltip = (e, d) => {
    const { clientX, clientY } = e;
    const { scrollX, scrollY } = window;
    const x = clientX + scrollX;
    const y = clientY + scrollY;
    const textArray = [
      d[dataFieldsByColumn['element']],
      d[dataFieldsByColumn['category']],
      ['Index', Number(d[dataFieldsByColumn['index']]).toFixed(0)],
      ['Z-Score', Number(d[dataFieldsByColumn['zscore']]).toFixed(2)],
      [
        'Target Percentage',
        numberAsPercent(d[dataFieldsByColumn.targetPercentage]),
      ],
      [
        'Reference Percentage',
        numberAsPercent(d[dataFieldsByColumn.referencePercentage]),
      ],
    ];
    const position = { x: roundToTens(x), y: roundToTens(y) };
    toolTipRef.current.moveToolTip(textArray, position);
  };

  const hideTooltip = () => toolTipRef.current.hideToolTip();

  const fadeOtherCategories = (cleanCategory) => {
    d3.selectAll(`.arc-text-not-${cleanCategory}`).attr('opacity', 0.3);
    d3.selectAll(`.arc-circle-not-${cleanCategory}`).attr('opacity', 0.3);
    d3.selectAll(`.notches-not-${cleanCategory}`).attr('opacity', 0.3);
    d3.selectAll(`.dot-not-${cleanCategory}`).attr('opacity', 0.4);
    d3.selectAll(`.arc-grid-not-${cleanCategory}`).attr('opacity', 0.1);
  };

  const restoreOtherCategories = (cleanCategory) => {
    d3.selectAll(`.arc-text-not-${cleanCategory}`).attr('opacity', 1);
    d3.selectAll(`.arc-circle-not-${cleanCategory}`).attr('opacity', 1);
    d3.selectAll(`.notches-not-${cleanCategory}`).attr('opacity', 1);
    d3.selectAll(`.dot-not-${cleanCategory}`).attr('opacity', 1);
    d3.selectAll(`.arc-grid-not-${cleanCategory}`).attr('opacity', 0.5);
  };

  const drawArc = ({ category, startIndex, endIndex }) => {
    const startAngle = startIndex * deltaThetaRef.current;
    const endAngle = endIndex * deltaThetaRef.current;
    const midAngle = (endAngle + startAngle) / 2;
    const cleanCategory = cleanNonAlphaEnums(category);
    const bottomHalf = midAngle > Math.PI / 2 && midAngle < (3 * Math.PI) / 2;

    const arc = d3
      .arc()
      .innerRadius(OUTER_ARC)
      .outerRadius(OUTER_ARC)
      .startAngle(startAngle)
      .endAngle(endAngle);

    const wideArc = d3
      .arc()
      .innerRadius(TEXT_ARC)
      .outerRadius(TEXT_ARC)
      .startAngle(startAngle - 0.18)
      .endAngle(endAngle + 0.18);

    const reverseWideArc = d3
      .arc()
      .innerRadius(TEXT_ARC + 8)
      .outerRadius(TEXT_ARC + 8)
      .startAngle(endAngle + 0.18)
      .endAngle(startAngle - 0.18);

    const textArc = /[Mm][\d\.\-e,\s]+[Aa][\d\.\-e,\s]+/.exec(
      bottomHalf ? reverseWideArc() : wideArc()
    );

    axisGRef.current
      .append('path')
      .attr('d', arc)
      .attr('id', `arc-${cleanCategory}`)
      .attr('class', `${getNotClasses(category, 'arc-circle')} arc-circle`)
      .attr('stroke-width', 0.5)
      .attr('transform', `translate(${WIDTH / 2}, ${HEIGHT / 2})`)
      .on('mouseover', () => {
        fadeOtherCategories(cleanCategory);
        hideTooltip();
      })
      .on('mouseout', () => restoreOtherCategories(cleanCategory));

    axisGRef.current
      .selectAll(`.notches-${cleanCategory}`)
      .data([startAngle, endAngle])
      .enter()
      .append('line')
      .attr(
        'class',
        `${getNotClasses(category, 'notches')} notches-${cleanCategory}`
      )
      .attr('x1', (d) => valueToCoordsNoScale(OUTER_ARC, d).x)
      .attr('y1', (d) => valueToCoordsNoScale(OUTER_ARC, d).y)
      .attr('x2', (d) => valueToCoordsNoScale(OUTER_ARC - NOTCH_LENGTH, d).x)
      .attr('y2', (d) => valueToCoordsNoScale(OUTER_ARC - NOTCH_LENGTH, d).y)
      .attr('stroke', '#00416a')
      .attr('stroke-width', 0.25);

    axisGRef.current
      .append('path')
      .attr('d', textArc)
      .attr('id', `arcText-${cleanCategory}`)
      .attr('stroke', 'none')
      .attr('stroke-width', 0)
      .attr('fill', 'none')
      .attr('transform', `translate(${WIDTH / 2}, ${HEIGHT / 2})`);

    axisGRef.current
      .append('text')
      .append('textPath')
      .attr('xlink:href', `#arcText-${cleanCategory}`)
      .style('text-anchor', 'middle')
      .attr('class', `${getNotClasses(category, 'arc-text')} arc-text`)
      .attr('startOffset', '50%')
      .attr('transform', `translate(${WIDTH / 2}, ${HEIGHT / 2})`)
      .text(category.toUpperCase())
      .on('mouseover', () => {
        fadeOtherCategories(cleanCategory);
        hideTooltip();
      })
      .on('mouseout', () => restoreOtherCategories(cleanCategory));
  };

  const drawArcs = () => {
    let startIndex = 0;
    nestedElementsSortedRef.current.forEach((elem) => {
      const endIndex = startIndex + elem.data.length;
      drawArc({ category: elem.category, startIndex, endIndex: endIndex - 1 });
      startIndex = endIndex;
    });
  };

  const drawDots = () => {
    dotsGRef.current = graphGRef.current
      .selectAll('circle')
      .data(flattenedElementsRef.current, (d) => uniqueKey(d))
      .enter()
      .append('circle')
      .attr(
        'class',
        (d) =>
          `dot-${cleanNonAlphaEnums(
            d[dataFieldsByColumn['category']]
          )} ${getNotClasses(
            d[dataFieldsByColumn['category']],
            'dot'
          )} data-circle`
      )
      .attr(
        'cx',
        (d, i) =>
          valueToCoords(
            d[dataFieldsByColumn['index']],
            i * deltaThetaRef.current
          ).x
      )
      .attr(
        'cy',
        (d, i) =>
          valueToCoords(
            d[dataFieldsByColumn['index']],
            i * deltaThetaRef.current
          ).y
      )
      .attr('r', SMALL_DOT_RADIUS)
      .attr('fill', (d) => colorScale(d[dataFieldsByColumn['index']]))
      .on('mouseover', (e, d) => {
        d3.select(e.target)
          .transition()
          .duration(200)
          .attr('r', LARGE_DOT_RADIUS);
        moveTooltip(e, d);
      })
      .on('mouseleave', (e, _d) => {
        d3.select(e.target)
          .transition()
          .duration(200)
          .attr('r', SMALL_DOT_RADIUS);
      });
  };

  const drawGridArc = ({ category, startIndex, endIndex, idx }) => {
    const startAngle = (startIndex - 0.5) * deltaThetaRef.current;
    const endAngle = (endIndex + 0.5) * deltaThetaRef.current;
    const cleanCategory = cleanNonAlphaEnums(category);

    const arc = d3
      .arc()
      .innerRadius(dotScale(idx))
      .outerRadius(dotScale(idx))
      .startAngle(startAngle)
      .endAngle(endAngle);

    axisGRef.current
      .append('path')
      .attr('d', arc)
      .attr(
        'class',
        `grid-circle arc-grid-${cleanCategory} ${getNotClasses(
          category,
          'arc-grid'
        )}`
      )
      .attr('stroke-width', 0.5)
      .attr('opacity', 0.5)
      .attr('transform', `translate(${WIDTH / 2}, ${HEIGHT / 2})`);
  };

  const drawGridArcs = () => {
    let startIndex = 0;
    nestedElementsSortedRef.current.forEach((elem) => {
      const endIndex = startIndex + elem.data.length;
      drawGridArc({
        category: elem.category,
        startIndex,
        endIndex: endIndex - 1,
        idx: 100,
      });
      startIndex = endIndex;
    });
  };

  const drawGrid = () => {
    const maxValue = 250;
    // spokes
    axisGRef.current
      .selectAll('line')
      .data(flattenedElementsRef.current, (d) => uniqueKey(d))
      .enter()
      .append('line')
      .attr(
        'class',
        (d) =>
          `spoke-${cleanNonAlphaEnums(
            d[dataFieldsByColumn['category']]
          )} grid-line`
      )
      .attr('x1', (_d, i) => valueToCoords(0, i * deltaThetaRef.current).x)
      .attr('y1', (_d, i) => valueToCoords(0, i * deltaThetaRef.current).y)
      .attr(
        'x2',
        (_d, i) => valueToCoords(maxValue, i * deltaThetaRef.current).x
      )
      .attr(
        'y2',
        (_d, i) => valueToCoords(maxValue, i * deltaThetaRef.current).y
      )
      .attr('stroke-width', 0.2)
      .attr('opacity', 0.6);

    drawGridArcs();

    //labels
    axisGRef.current
      .selectAll('text')
      .data([0, 100, 250])
      .enter()
      .append('text')
      .attr('class', 'grid-text')
      .attr('x', WIDTH / 2)
      .attr('y', (d) => HEIGHT / 2 - dotScale(d))
      .attr('dy', '-0.35em')
      .attr('dx', '0.2em')
      .text((d) => `${d}${d === 250 ? '+' : ''} INDEX`);
  };

  const drawLegend = () => {
    const legendG = d3.select(svgRef.current).append('g');
    const defs = legendG.append('defs');

    const linearGradient = defs
      .append('linearGradient')
      .attr('id', 'linear-gradient');

    linearGradient
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');

    linearGradient
      .selectAll('stop')
      .data([
        { offset: '0%', color: colorScale(0) },
        { offset: '40%', color: colorScale(100) },
        { offset: '60%', color: colorScale(150) },
        { offset: '100%', color: colorScale(250) },
      ])
      .enter()
      .append('stop')
      .attr('offset', (d) => d.offset)
      .attr('stop-color', (d) => d.color);

    legendG
      .append('rect')
      .attr('transform', 'translate(0,14)')
      .attr('width', 132)
      .attr('height', 20)
      .style('fill', 'url(#linear-gradient)');

    legendG
      .attr('transform', `translate(${WIDTH - 200},${HEIGHT - 100})`)
      .attr('class', 'legend');

    legendG
      .append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('class', 'legend-title fill-default')
      .text('Index')
      .append('svg:title')
      .text(getIndexDescription);

    const legendMarks = [
      { scale: 0, label: '0' },
      { scale: 100, label: '100' },
      { scale: 250, label: '250+' },
    ];

    legendG
      .selectAll('.legend-label')
      .data(legendMarks)
      .enter()
      .append('text')
      .attr('class', 'legend-label fill-default')
      .attr('x', (d) => (d.scale * 100) / 250)
      .attr('y', 60)
      .text((d) => d.label);
  };

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    axisGRef.current = svg.append('g').attr('class', 'axis');
    graphGRef.current = svg.append('g').attr('class', 'graph');
    seperatorGRef.current = svg.append('g').attr('class', 'seperators');
    dotsGRef.current = svg.append('g').attr('class', 'dots');
    dataRef.current = numberIndeces(data);
    categoriesRef.current = getCategories(data);
    nestedElementsSortedRef.current = alternateSortCategories(dataRef.current);
    flattenedElementsRef.current = flattenElements(dataRef.current);
    deltaThetaRef.current = (2 * Math.PI) / dataRef.current.length;

    drawGrid();
    drawArcs();
    drawDots();
    drawLegend();

    svg.on('mouseleave', hideTooltip);
  }, [data]);

  return (
    <div>
      <h3 className="text-primary" id="viz-title">
        Interests
      </h3>
      <p className="text-primary" id="viz-subtitle">
        By Group, By Highest Index
      </p>
      <svg
        ref={svgRef}
        preserveAspectRatio="xMidYMid meet"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width="100%"
        height="100%"
        transform="translate(0, -50)"
      ></svg>
    </div>
  );
};
