import dayjs from 'dayjs';
import { PolygonData } from  '../state/store'; // adjust path as needed

// This function fetches temperature and updates polygons
export const fetchTemperature = async (
  polygons: PolygonData[],
  updateTemperature: (id: string, hour: number, temp: number) => void,
  setTemperatureData: (data: number[]) => void
) => {
  if (!polygons || polygons.length === 0) return;

  const lat = polygons[0].lat;
  const lon = polygons[0].lon;

  if (!lat || !lon) {
    console.warn('No valid coordinates found in polygons.');
    return;
  }

  const start = dayjs().subtract(15, 'day').format('YYYY-MM-DD');
  const end = dayjs().format('YYYY-MM-DD');

  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${start}&end_date=${end}&hourly=temperature_2m`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch weather data');

    const data = await res.json();
    const hourlyTemps: number[] = data?.hourly?.temperature_2m || [];

    setTemperatureData(hourlyTemps);

    polygons.forEach((polygon) => {
      hourlyTemps.forEach((temp, hour) => {
        updateTemperature(polygon.id, hour, temp);
      });
    });
  } catch (error) {
    console.error('❌ API fetch error:', error);
  }
};
