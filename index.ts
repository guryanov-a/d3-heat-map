import axios from "axios";
import * as d3 from "d3";
import {
  getDaysInMonth,
  setMonth,
  addDays,
} from 'date-fns';
import './index.scss';

const PLOT_DATA_PATH: string = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
const CHART_WIDTH: number = 1024;
const CHART_HEIGHT: number = 600;
const CHART_PADDING: number = 60;

document.addEventListener("DOMContentLoaded", function(): void {
  initHeatMap();
});

async function initHeatMap(): Promise<void> {
  const data = await getData();
  const { monthlyVariance } = data;

  const baseTemperatureTitle = document.getElementById('description');
  const baseTemperatureRange = {
    start: monthlyVariance[0].year,
    end: monthlyVariance[monthlyVariance.length - 1].year
  };
  baseTemperatureTitle.textContent = `${baseTemperatureRange.start}-${baseTemperatureRange.end}: base temperature ${data.baseTemperature}℃`;

  const dataset = parseServerHeatMapData(monthlyVariance);
  createHeatMap(dataset);
}

async function getData(): Promise<any> {
  let response;

  try {
    response = await axios.get(PLOT_DATA_PATH);
  } catch (error) {
    console.error(error);
  }

  if (response && response.data) {
    return response.data;
  } else {
    console.error(new Error('no data in response'));
  }
}

function parseServerHeatMapData(data) {
  return data.map(({month, year, variance}) => ({
    date: new Date(`${year}-${('0' + month).slice(-2)}-01`),
    variance,
  }));
}

function createHeatMapScales(dataset) {
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

function createHeatMapAxes(svg, {xScale, yScale}) {
  let xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
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

function createHeatMap(dataset) {
  let {scales: {
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
        d.date.getMonth())) - (yScaleStepLength / 2
      )
    )
    .attr('width', xScaleStepLength)
    .attr('height', yScaleStepLength)
    .attr('fill', (d) => colorScale(d.variance))
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

function createTempRange(dataset) {
  const sizes = {
    width: 400,
    height: 110,
    padding: 60,
  };

  let svg = d3
    .select('#temp-range')
    .append('svg')
    .attr('width', sizes.width)
    .attr('height', sizes.height);

  let scales = createTempRangeScales(dataset, sizes);
  let axes = createTempRangeAxes(svg, scales, sizes);

  let minTemp = d3.min(dataset, (d) => d.variance);
  let maxTemp = d3.max(dataset, (d) => d.variance);
  let tempStep = (maxTemp - minTemp) / sizes.width;
  let tempRange = Array.from({length: sizes.width});
  tempRange = tempRange.map((tempRangeItem, i) => minTemp + i * tempStep);

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

function createTempRangeScales(dataset, {width, height, padding}) {
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

function createTempRangeAxes(svg, { xScale }, {height, padding}) {
  let xAxis = d3.axisBottom(xScale).tickSizeOuter(0);

  svg
    .append('g')
    .attr('id', 'x-axis')
    .attr('transform', `translate(0, ${height - padding})`)
    .call(xAxis);

  return { xAxis };
}
