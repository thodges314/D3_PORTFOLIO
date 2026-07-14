import React, { useEffect, useRef, useContext } from 'react';
import * as d3 from 'd3';
import usDMAdata from './dma.json';
import { getIndexDescription } from '../../../utils/getTooltipDescription';
import { dataFieldsByColumn } from '../../../utils/constants';
import ToolTipContext from '../../../context/ToolTipContext';
import './map.scss';

const colorScale = d3
  .scaleLinear()
  .domain([0, 100, 300])
  .range(['#ff5c39', '#fafafa', '#3782ba'])
  .clamp(true);

const numberAsPercent = (num) => `${(num * 100).toFixed(2)}%`;

export const USDMAMap = ({ data, chart_title, chart_subtitle }) => {
  const svgRef = useRef(null);
  const toolTipRef = useContext(ToolTipContext);
  const projection = d3.geoAlbersUsa();
  const pathGenerator = d3.geoPath(projection);

  const moveTooltip = (d) => {
    const backScaleX = d3
      .scaleLinear()
      .domain([0, 960])
      .range([0, svgRef.current.getBoundingClientRect().width]);
    const backScaleY = d3
      .scaleLinear()
      .domain([0, 500])
      .range([0, svgRef.current.getBoundingClientRect().height]);
    const bounds = pathGenerator.bounds(d);
    const name = d.properties.dma1;
    const itemIndex = d.properties.index;
    const x = (bounds[0][0] + bounds[1][0]) / 2;
    const y = bounds[0][1];
    const baseX = svgRef.current.getBoundingClientRect().left + window.scrollX;
    const baseY = svgRef.current.getBoundingClientRect().top + window.scrollY;
    const textArray = [
      name,
      ['Index', Number(itemIndex).toFixed(0)],
      ['Z-Score', Number(d.properties['Z-SCORE']).toFixed(2)],
      ['Target Percentage', numberAsPercent(d.properties['TARGETPERCENTAGE'])],
      [
        'Reference Percentage',
        numberAsPercent(d.properties['REFERENCEPERCENTAGE']),
      ],
    ];
    const position = { x: baseX + backScaleX(x), y: baseY + backScaleY(y) };
    toolTipRef.current.moveToolTip(textArray, position);
  };

  const hideTooltip = () => toolTipRef.current.hideToolTip();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const mapDropShadowG = svg.append('g');
    const mapG = svg.append('g');
    const legendG = svg.append('g');
    const mapHoverG = svg.append('g');

    usDMAdata.features.forEach((d) => {
      const match = data.find((e) => e['dpa_main.value'] === d.properties.id);
      // eslint-disable-next-line no-param-reassign
      d.properties.index = match ? match[dataFieldsByColumn.index] : 0;
      d.properties['Z-SCORE'] = match ? match[dataFieldsByColumn.zscore] : 0;
      d.properties['TARGETPERCENTAGE'] = match
        ? match[dataFieldsByColumn.targetPercentage]
        : 0;
      d.properties['REFERENCEPERCENTAGE'] = match
        ? match[dataFieldsByColumn.referencePercentage]
        : 0;
    });

    const defs = svg.append('defs');

    const linearGradient = defs
      .append('linearGradient')
      .attr('id', 'linear-gradient');

    linearGradient
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');

    // Append multiple color stops by using D3's data/enter step
    linearGradient
      .selectAll('stop')
      .data([
        { offset: '0%', color: colorScale(0) },
        { offset: '25%', color: colorScale(100) },
        { offset: '100%', color: colorScale(300) },
      ])
      .enter()
      .append('stop')
      .attr('offset', (d) => d.offset)
      .attr('stop-color', (d) => d.color);

    // Draw the rectangle and fill with gradient
    legendG
      .append('rect')
      .attr('transform', 'translate(0,14)')
      .attr('width', 132)
      .attr('height', 20)
      .style('fill', 'url(#linear-gradient)');

    mapDropShadowG
      .selectAll('.hover-state')
      .data(usDMAdata.features)
      .enter()
      .append('path')
      .attr('class', 'hover-state')
      .attr('d', pathGenerator)
      .attr('filter', 'url(#blur)');

    mapG
      .selectAll('.state')
      .data(usDMAdata.features)
      .enter()
      .append('path')
      .attr('class', 'state')
      .attr('d', pathGenerator)
      .style('fill', (d) =>
        d.properties.index ? colorScale(d.properties.index) : '#ccc'
      )
      .append('title')
      .text((d) => d.properties.dma1);

    legendG.attr('transform', 'translate(800,400)').attr('class', 'legend');
    legendG
      .append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('class', 'legend-title fill-default')
      .text('Index')
      .append('svg:title')
      .text(getIndexDescription);

    const legendMarks = ['0', '300+'];

    legendG
      .selectAll('.legend-label')
      .data(legendMarks)
      .enter()
      .append('text')
      .attr('class', 'legend-label fill-default')
      .attr('x', (_d, i) => i * 100)
      .attr('y', 60)
      .text((d) => d);

    // filter vvv //
    const blurFilter = defs.append('filter').attr('id', 'blur');

    blurFilter
      .append('feGaussianBlur')
      .attr('in', 'SourceAlpha')
      .attr('stdDeviation', '5')
      .attr('result', 'blur');

    blurFilter
      .append('feOffset')
      .attr('dx', '2')
      .attr('dy', '2')
      .attr('result', 'offsetBlur');

    const feMerge = blurFilter.append('feMerge');

    feMerge.append('feMergeNode').attr('in', 'offsetBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
    // filter ^^^ //

    mapHoverG
      .selectAll('.hover-state')
      .data(usDMAdata.features)
      .enter()
      .append('path')
      .attr('class', 'hover-state')
      .attr('d', pathGenerator)
      .on('mouseover', (_e, d) => moveTooltip(d));

    svg.on('mouseleave', hideTooltip);
  }, [data]);

  return (
    <div className="viz-container">
      <div className="title-container">
        <h3 className="text-primary" id="viz-title">
          {`${chart_title}®`}
        </h3>
      </div>
      <p className="text-primary" id="viz-subtitle">
        {chart_subtitle}
      </p>
      <svg
        ref={svgRef}
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 960 500"
        width="100%"
        height="90%"
        style={{
          position: 'relative',
          top: '-5%',
        }}
      />
    </div>
  );
};
