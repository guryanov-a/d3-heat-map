import * as d3 from 'd3';
import { heatMapStore } from './stores/HeatMapStore';

export function createTempRangeScales(dataset, {width, padding}) {
  const { baseTemperature } = heatMapStore.data;
  const minVariance = d3.min(dataset, (d) => d.variance);
  const maxVariance = d3.max(dataset, (d) => d.variance);
  let xScale = d3
    .scaleLinear()
    .domain([
      baseTemperature + minVariance,
      baseTemperature + maxVariance,
    ])
    .range([padding, width - padding]);

  let colorScale = d3
    .scaleLinear()
    .domain([
      baseTemperature + minVariance,
      baseTemperature,
      baseTemperature + maxVariance,
    ])
    .range(['rgb(49, 54, 149)', 'rgb(255, 255, 191)', 'rgb(165, 0, 38)']);

  return {
    xScale,
    colorScale,
  };
}