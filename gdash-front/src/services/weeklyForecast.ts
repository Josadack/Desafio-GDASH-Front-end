export interface WeeklyForecast {
  dates: string[];
  maxTemps: number[];
  minTemps: number[];
  conditionCodes: number[]; // Novo: Para os ícones animados
  humidities: number[];     // Novo: Para o dado de umidade no card
}


export async function getCityCoords(cityName: string) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=pt&format=json`;
  const res = await fetch(url);
  const data = await res.json();
  
  if (data.results && data.results.length > 0) {
    return {
      lat: data.results[0].latitude,
      lon: data.results[0].longitude
    };
  }
  return null;
}

export async function fetchWeeklyForecast(
  lat: number,
  lon: number
): Promise<WeeklyForecast> {
  // Adicionamos weathercode e relative_humidity_2m_max na chamada
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode,relative_humidity_2m_max&timezone=auto`;

  const res = await fetch(url);
  const data = await res.json();

  return {
    dates: data.daily.time,
    maxTemps: data.daily.temperature_2m_max,
    minTemps: data.daily.temperature_2m_min,
    conditionCodes: data.daily.weathercode,
    humidities: data.daily.relative_humidity_2m_max
  };
}