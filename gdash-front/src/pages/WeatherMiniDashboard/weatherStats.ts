import type { CapitalWeather } from "../../services/CapitalWeather";

export function getHottestCapital(data: CapitalWeather[]) {
  return [...data].sort((a, b) => b.temperature - a.temperature)[0];
}

export function getAverageTemperature(data: CapitalWeather[]) {
  return data.reduce((acc, c) => acc + c.temperature, 0) / data.length;
}

export function getStrongestWind(data: CapitalWeather[]) {
  return [...data].sort((a, b) => b.wind - a.wind)[0];
}
