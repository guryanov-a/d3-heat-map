interface MonthlyVarianceInterface {
  year: number;
}

interface HeatMapDataInterface {
  monthlyVariance: MonthlyVarianceInterface[];
  baseTemperature: number;
}

class HeatMapStore {
  data: HeatMapDataInterface;
}

export const heatMapStore = new HeatMapStore();