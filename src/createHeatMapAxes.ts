import * as d3 from 'd3';
import { CHART_HEIGHT, CHART_WIDTH, CHART_PADDING } from './constants';

export function createHeatMapAxes(svg, {xScale, yScale}) {
  let xAxis = d3
    .axisBottom(xScale)
    .tickSizeOuter(0);
  let yAxis = d3
    .axisLeft(yScale)
    .ticks(d3.timeMonth)
    .tickFormat(d3.timeFormat('%B'))
    .tickSizeOuter(0);

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0)
    .attr("x", 0 - (CHART_HEIGHT / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Months");
  svg.append("text")
    .attr("y", CHART_HEIGHT)
    .attr("x", CHART_WIDTH / 2)
    .attr("dy", "-1em")
    .style("text-anchor", "middle")
    .text("Years");

  svg
    .append('g')
    .attr('id', 'x-axis')
    .attr('transform', `translate(0, ${CHART_HEIGHT - CHART_PADDING})`)
    .call(xAxis);
  svg
    .append('g')
    .attr('id', 'y-axis')
    .attr('transform', `translate(${CHART_PADDING}, 0)`)
    .call(yAxis);

  return {
    xAxis,
    yAxis,
  }
}