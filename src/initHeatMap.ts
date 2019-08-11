import { parseServerHeatMapData } from './parseServerHeatMapData';
import { createHeatMap } from './createHeatMap';
import { getData } from './getData';
import { heatMapStore } from './stores/HeatMapStore';

export async function initHeatMap(): Promise<void> {
  heatMapStore.data = await getData();
  const { monthlyVariance, baseTemperature } = heatMapStore.data;
  const baseTemperatureTitle = document.getElementById('description');
  const baseTemperatureRange = {
    start: monthlyVariance[0].year,
    end: monthlyVariance[monthlyVariance.length - 1].year
  };
  baseTemperatureTitle.textContent = `${baseTemperatureRange.start}-${baseTemperatureRange.end}: base temperature ${baseTemperature}℃`;

  const dataset = parseServerHeatMapData(monthlyVariance);
  createHeatMap(dataset);
  
  const heatMapEl = document.querySelector('#heat-map');
  const tooltip = document.querySelector('#tooltip') as HTMLElement;
  const tooltipDate = tooltip.querySelector('.tooltip__date');
  const tooltipTemperature = tooltip.querySelector('.tooltip__temperature');
  const tooltipTemperatureVariance = tooltip.querySelector('.tooltip__temperature-variance');

  heatMapEl.addEventListener("mouseover", (event): void => {
    const eventTarget = event.target as SVGElement | HTMLElement;
    if (!eventTarget.classList.contains('cell')) return;
    const targetCoords = eventTarget.getBoundingClientRect();

    // set data attributes
    tooltip.dataset.year = eventTarget.dataset.year;

    // date text
    const date = new Date(Number(eventTarget.dataset.year), Number(eventTarget.dataset.month));
    tooltipDate.textContent = `Date: ${date.toLocaleDateString('default', { year: 'numeric', month: 'long' })}`;

    // temperature text
    tooltipTemperature.textContent = `Temperature: ${Number(eventTarget.dataset.temp).toFixed(2)}`;
    tooltipTemperatureVariance.textContent = `Temperature variance: ${Number(eventTarget.dataset.tempVariance).toFixed(2)}`;

    // show tooltip
    tooltip.classList.add('tooltip_visibility_visible');
    tooltip.style.top = `${targetCoords.top - tooltip.offsetHeight - targetCoords.width}px`;
    tooltip.style.left = `${targetCoords.left + targetCoords.width * 2}px`;
  });

  heatMapEl.addEventListener("mouseout", (event): void => {
    const eventTarget = event.target as SVGElement | HTMLElement;
    if (!eventTarget.classList.contains('cell')) return;

    eventTarget.style.top = null;
    eventTarget.style.left = null;
    tooltip.classList.remove('tooltip_visibility_visible');
  });
}