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
}