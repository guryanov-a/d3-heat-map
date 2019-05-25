import * as d3 from 'd3';
import { setMonth, getDaysInMonth, addDays } from 'date-fns';
import { CHART_PADDING, CHART_WIDTH, CHART_HEIGHT } from './constants';

export function createHeatMapScales(dataset) {
  let xScale = d3
    .scaleTime()
    .domain([
      d3.min(dataset, (d) => d.date),
      d3.max(dataset, (d) => d.date),
    ])
    .range([CHART_PADDING, CHART_WIDTH - CHART_PADDING]);
  let yStartMonth = setMonth(new Date(0), -1);
  let yStartMonthMiddle = Math.floor(getDaysInMonth(yStartMonth) / 2);
  let yStartDate = addDays(yStartMonth, yStartMonthMiddle);
  let yEndMonth = setMonth(new Date(0), 11);
  let yEndMonthMiddle = Math.floor(getDaysInMonth(yEndMonth) / 2);
  let yEndDate = addDays(yEndMonth, yEndMonthMiddle);
  let yScale = d3
    .scaleTime()
    .domain([
      yEndDate,
      yStartDate,
    ])
    .range([CHART_HEIGHT - CHART_PADDING, CHART_PADDING]);

  return {
    xScale,
    yScale,
  };
}