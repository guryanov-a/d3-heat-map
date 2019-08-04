import * as d3 from 'd3';

export function createTempRangeAxes(svg, { xScale }, {height, padding}) {
  let xAxis = d3.axisBottom(xScale).tickSizeOuter(0);

  svg
    .append('g')
    .attr('id', 'legend-x-axis')
    .attr('transform', `translate(0, ${height - padding})`)
    .call(xAxis);

  return { xAxis };
}