export function parseServerHeatMapData(data) {
  return data.map(({month, year, variance}) => ({
    date: new Date(`${year}-${('0' + month).slice(-2)}-01`),
    variance,
  }));
}