import * as d3 from 'd3';

export function createTempRangeScales(dataset, {width, padding}) {
  let xScale = d3
    .scaleLinear()
    .domain([
      d3.min(dataset, (d) => d.variance),
      d3.max(dataset, (d) => d.variance),
    ])
    .range([padding, width - padding]);

  let colorScale = d3
    .scaleLinear()
    .domain([
      d3.min(dataset, (d) => d.variance),
      d3.mean(dataset, (d) => d.variance),
      d3.max(dataset, (d) => d.variance),
    ])
    .range(['rgb(49, 54, 149)', 'rgb(255, 255, 191)', 'rgb(165, 0, 38)']);

  return {
    xScale,
    colorScale,
  };
}