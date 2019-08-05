import { parseServerHeatMapData } from './parseServerHeatMapData';
import { createHeatMap } from './createHeatMap';
import { getData } from './getData';

export async function initHeatMap(): Promise<void> {
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
  
  const heatMapEl = document.querySelector('#heat-map');
  const tooltip = document.querySelector('#tooltip');

  heatMapEl.addEventListener("mouseover", (event): void => {
    const eventTarget = event.target as SVGElement | HTMLElement;
    if (!eventTarget.classList.contains('cell')) return;
    const targetCoords = eventTarget.getBoundingClientRect();
    console.log(targetCoords);

    tooltip.style.top = `${targetCoords.top}px`;
    tooltip.style.left = `${targetCoords.left + targetCoords.width}px`;
    tooltip.classList.add('tooltip_visibility_visible');
  });

  heatMapEl.addEventListener("mouseout", (event): void => {
    const eventTarget = event.target as SVGElement | HTMLElement;
    if (!eventTarget.classList.contains('cell')) return;

    eventTarget.style.top = null;
    eventTarget.style.left = null;
    tooltip.classList.remove('tooltip_visibility_visible');
  });
}