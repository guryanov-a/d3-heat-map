import * as d3 from 'd3';
import { createTempRangeScales } from './createTempRangeScales';
import { createTempRangeAxes } from './createTempRangeAxes';

export function createTempRange(dataset) {
  const sizes = {
    width: 400,
    height: 110,
    padding: 60,
  };

  let svg = d3
    .select('#legend')
    .append('svg')
    .attr('width', sizes.width)
    .attr('height', sizes.height);

  let scales = createTempRangeScales(dataset, sizes);
  let axes = createTempRangeAxes(svg, scales, sizes);

  let minTemp = d3.min(dataset, (d) => d.variance);
  let maxTemp = d3.max(dataset, (d) => d.variance);
  let tempStep = (maxTemp - minTemp) / sizes.width;
  let tempRange = Array.from({length: sizes.width});
  tempRange = tempRange.map((_, i) => minTemp + i * tempStep);

  svg
    .selectAll('rect')
    .data(tempRange)
    .enter()
    .append('rect')
    .attr('x', (d) => scales.xScale(d))
    .attr('y', 0)
    .attr('width', 5)
    .attr('height', sizes.height - sizes.padding)
    .attr('fill', (d) => scales.colorScale(d));

  return {
    svg,
    scales,
    axes,
  };
}