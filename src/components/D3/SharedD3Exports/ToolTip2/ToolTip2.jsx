import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from 'react';
import * as d3 from 'd3';
import './ToolTip2.scss';

const TOOLTIPOFFSET = 75;

const makeArrayHash = (array) =>
  array.reduce((hash, item) => {
    if (Array.isArray(item)) {
      return `${hash}.${item[0]}.${item[1]}`;
    }
    return `${hash}.${item}`;
  }, '');

const isTwoColumn = (array, forceTwoColumn) =>
  forceTwoColumn ||
  array.reduce((result, item) => result || Array.isArray(item), false);

const ToolTip2 = forwardRef(({ grow = false }, ref) => {
  const tooltipRef = useRef(null);
  const visibleRef = useRef(false);
  const arrayHashRef = useRef('');
  const twoColumnRef = useRef(false);

  const xPosition = (x) => {
    const maxRight = (twoColumnRef.current ? 350 : 200) + 20 - TOOLTIPOFFSET;
    const maxLeft = window.innerWidth - maxRight;
    return Math.min(x, maxLeft) - TOOLTIPOFFSET;
  };

  const drawTooltip = (textArray) => {
    if (makeArrayHash(textArray) === arrayHashRef.current) return;
    tooltipRef.current.selectAll('*').remove();
    if (textArray[0].length > 0) {
      tooltipRef.current
        .append('p')
        .attr('class', 'tooltip-paragraph')
        .append('strong')
        .attr('id', 'tooltip-value')
        .text(
          typeof textArray[0] === 'string' ? textArray[0] : textArray[0][0]
        );
    }

    if (twoColumnRef.current) {
      tooltipRef.current.style('width', '350px');
      const paragraphs = tooltipRef.current
        .selectAll('#tooltip-datarow')
        .data(textArray.slice(1))
        .enter()
        .append('p')
        .attr('class', 'tooltip-paragraph')
        .append('div')
        .attr('class', 'flex-row');

      paragraphs.each((itm, idx, nodes) => {
        if (Array.isArray(itm)) {
          d3.select(nodes[idx])
            .append('div')
            .style('max-width', '140px')
            .text(itm[0]);
          d3.select(nodes[idx])
            .append('div')
            .style('max-width', '190px')
            .style('align-self', 'flex-end')
            .text(itm[1]);
        } else {
          d3.select(nodes[idx])
            .append('div')
            .style('max-width', '330px')
            .text(itm);
        }
      });
    } else {
      tooltipRef.current.style('width', '200px');
      if (!grow)
        tooltipRef.current
          .selectAll('#tooltip-paragraph')
          .data(textArray.slice(1))
          .enter()
          .append('p')
          .attr('class', 'tooltip-paragraph')
          .append('span')
          .attr('class', 'tooltip-index')
          .text((d) => d);

      if (grow)
        tooltipRef.current
          .selectAll('#tooltip-paragraph')
          .data(textArray.slice(1))
          .enter()
          .append('p')
          .attr('class', 'tooltip-paragraph')
          .append('span')
          .attr('class', 'tooltip-index')
          .transition()
          .duration((_d, i) => (i + 1) * 150)
          .transition()
          .duration(150)
          .attr('opacity', 1)
          .text((d) => d);
    }

    arrayHashRef.current = makeArrayHash(textArray);
  };

  const moveToolTipFunc = (textArray, position, forceTwoColumn) => {
    twoColumnRef.current = isTwoColumn(textArray, forceTwoColumn);
    if (visibleRef.current) {
      tooltipRef.current
        .transition()
        .duration(300)
        .ease(d3.easeLinear)
        .style('left', `${xPosition(position.x)}px`)
        .style('bottom', `${window.innerHeight - position.y + 10}px`)
        .style('opacity', 1)
        .on('end', () => {
          visibleRef.current = true;
        });
      drawTooltip(textArray);
      tooltipRef.current.classed('hidden', false);
    } else {
      tooltipRef.current
        .style('left', `${xPosition(position.x)}px`)
        .style('bottom', `${window.innerHeight - position.y + 10}px`)
        .transition()
        .duration(300)
        .ease(d3.easeQuadIn)
        .style('opacity', 1)
        .on('end', () => {
          visibleRef.current = true;
        });
      drawTooltip(textArray);

      tooltipRef.current.classed('hidden', false);
    }
  };

  const hideToolTipFunc = () =>
    tooltipRef.current
      .transition()
      .duration(400)
      .ease(d3.easeQuadOut)
      .style('opacity', 0)
      .on('end', () => {
        tooltipRef.current.classed('hidden', true);
        visibleRef.current = false;
      });

  useImperativeHandle(ref, () => ({
    moveToolTip: (textArray, position, forceTwoColumn = false) => {
      moveToolTipFunc(textArray, position, forceTwoColumn);
    },
    hideToolTip: () => hideToolTipFunc(),
  }));

  useEffect(() => {
    tooltipRef.current = d3.select('#tooltip');
  }, []);

  return <div className="tooltip hidden bg-transparent" id="tooltip" />;
});

export default ToolTip2;
