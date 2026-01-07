// src/services/weatherService.ts
import type WeatherLogDto from "../model/WeatherLogDto";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ""; // configure se usar .env

export async function fetchLastWeather(): Promise<WeatherLogDto> {
  const res = await fetch(`${API_BASE}/weather/last`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erro fetching last weather: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data as WeatherLogDto;
}
