import * as d3 from "d3";

export const Line = (
  data4Viz,
  element,
  yScale,
  innerWidth,
  innerHeight,
  numBars,
  xLineScale,
  xAccessor
) => {
  const yAccessor = (d) => d.percent;
  const yLineScale = d3.scaleLinear().domain([0, 100]).range([innerHeight, 0]);
  let lineYOffset = 0;
  const lineGen = d3
    .line()
    .curve(d3.curveCatmullRom)
    .x((d) => {
      return xLineScale(xAccessor(d)) + innerWidth / numBars / 2;
    })
    .y((d) => {
      let output;
      if (lineYOffset === 0) {
        output = yLineScale(yAccessor(d));
      } else {
        output = yScale(d.percent) - lineYOffset;
      }
      lineYOffset = lineYOffset + innerHeight - yLineScale(yAccessor(d));
      return output;
    });

  const line = element.append("path").lower().attr("d", lineGen(data4Viz));

  // Constructs a polygon to fill in the rest of the background
  // of the line:
  // start from 0 and the innerheight (bottom left corner)
  // add a point for the first bar
  // add a point for the last bar
  // add a point for innerWidth and 0 (top right corner)
  // add a point for innerWidth and innerHeight (bottom right corner)
  // SVG polygons automatically close back to the first point
  const polygonPoints = `0 ${innerHeight} , 
   ${
     xLineScale(xAccessor(data4Viz[0])) + innerWidth / numBars / 2
   } ${yLineScale(yAccessor(data4Viz[0]))}, 
 ${
   xLineScale(xAccessor(data4Viz[data4Viz.length - 1])) +
   innerWidth / numBars / 2
 } 0, 
 ${innerWidth} 0, 
 ${innerWidth} ${innerHeight}`;
  const fillPolygon = element
    .append("polygon")
    .lower()
    .attr("points", polygonPoints);
};
