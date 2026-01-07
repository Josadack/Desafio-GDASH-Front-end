// src/services/capitalsWeather.ts

export interface CapitalWeather {
  city: string;
  temperature: number;
  wind: number;
  condition: number;   // tem que ser NUMBER
}

export const CAPITALS_COORDS = [
  { city: "São Paulo", lat: -23.55, lon: -46.63 },
  { city: "Rio de Janeiro", lat: -22.90, lon: -43.20 },
  { city: "Belo Horizonte", lat: -19.92, lon: -43.94 },
  { city: "Brasília", lat: -15.79, lon: -47.88 },
  { city: "Curitiba", lat: -25.43, lon: -49.27 },
  { city: "Salvador", lat: -12.97, lon: -38.50 },
  { city: "Fortaleza", lat: -3.72, lon: -38.54 },
  { city: "Manaus", lat: -3.11, lon: -60.02 },
  { city: "Recife", lat: -8.05, lon: -34.90 },
  { city: "Porto Alegre", lat: -30.03, lon: -51.23 }
];

export async function fetchCapitalsWeather(): Promise<CapitalWeather[]> {
  const requests = CAPITALS_COORDS.map(async (c) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current_weather=true`;
    const res = await fetch(url);

    if (!res.ok) {
      return {
        city: c.city,
        temperature: 0,
        wind: 0,
        condition: -1 // ❌ código inválido (continua sendo number)
      };
    }

    const data = await res.json();

    return {
      city: c.city,
      temperature: data.current_weather?.temperature ?? 0,
      wind: data.current_weather?.windspeed ?? 0,
      humidity: data.current_weather?.relativehumidity ?? 0,
      condition: data.current_weather?.weathercode ?? -1   // ✔ number
    };
  });

  return Promise.all(requests);
}
