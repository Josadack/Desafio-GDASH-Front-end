import type WeatherLogDto from "../model/WeatherLogDto";


export function getLastCities(
  logs: WeatherLogDto[],
  limit = 5
): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  const sorted = [...logs].sort(
    (a, b) =>
      new Date(b.createdAt ?? 0).getTime() -
      new Date(a.createdAt ?? 0).getTime()
  );

  for (const log of sorted) {
    const city = log.city?.trim();
    if (!city) continue;

    const key = city.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(city);
    }

    if (result.length >= limit) break;
  }

  return result;
}
