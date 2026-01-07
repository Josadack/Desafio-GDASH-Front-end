import axios from "axios";
import type { AirQualityDto } from "../model/AirQualityDto";

export async function getAirQuality(
  lat: number,
  lon: number
): Promise<AirQualityDto> {
  const { data } = await axios.get(
    "https://air-quality-api.open-meteo.com/v1/air-quality",
    {
      params: {
        latitude: lat,
        longitude: lon,
        hourly: "pm10,pm2_5,ozone,nitrogen_dioxide",
      },
    }
  );

  return {
    time: data.hourly.time,
    pm10: data.hourly.pm10,
    pm2_5: data.hourly.pm2_5,
    ozone: data.hourly.ozone,
    nitrogen_dioxide: data.hourly.nitrogen_dioxide,
  };
}
