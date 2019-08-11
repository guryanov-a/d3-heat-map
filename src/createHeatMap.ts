import * as d3 from 'd3';
import { setMonth } from 'date-fns';
import { CHART_HEIGHT, CHART_WIDTH } from './constants';
import { createTempRange } from './createTempRange';
import { createHeatMapScales } from './createHeatMapScales';
import { createHeatMapAxes } from './createHeatMapAxes';
import { heatMapStore } from './stores/HeatMapStore';

export function createHeatMap(dataset) {
  const { baseTemperature } = heatMapStore.data;
  const {scales: {
    colorScale
  }} = createTempRange(dataset);

  let svg = d3
    .select('#heat-map')
    .append('svg')
    .attr('width', CHART_WIDTH)
    .attr('height', CHART_HEIGHT);

  let scales = createHeatMapScales(dataset);
  createHeatMapAxes(svg, scales);

  let xScaleStepLength = (scales.xScale(dataset[1].date) - scales.xScale(dataset[0].date)) * 12;
  let yScaleStepLength =
    scales.yScale(setMonth(new Date(0), dataset[1].date.getMonth()))
    -
    scales.yScale(setMonth(new Date(0), dataset[0].date.getMonth()));
  let cellsD3 = svg
    .selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('x', (d) => scales.xScale(setMonth(d.date, 0)))
    .attr('y', (d) => scales.yScale(
        setMonth(
          new Date(0),
          d.date.getMonth()
        )
      ) - (yScaleStepLength / 2)
    )
    .attr('width', xScaleStepLength)
    .attr('height', yScaleStepLength)
    .attr('data-month', d => d.date.getMonth())
    .attr('data-year', d => d.date.getFullYear())
    .attr('data-temp', d => baseTemperature + d.variance)
    .attr('fill', (d) => colorScale(baseTemperature + d.variance))
    .each(function() {
      this.classList.add('cell');
    });

  let tooltip: HTMLElement = document.getElementById('tooltip');

  cellsD3.on('mouseenter', ({}) => {
  });
  cellsD3.on('mouseleave', () => {
  });

  return svg;
}