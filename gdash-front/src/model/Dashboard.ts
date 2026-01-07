// src/model/Dashboard.ts
export interface LastWeather {
  _id?: string;
  city?: string;
  temperature?: number;
  humidity?: number;
  condition?: string;
  wind_speed?: number;
  updatedAt?: string;
  createdAt?: string;
  [key: string]: any;
}

export interface Dashboard {
  totalUsers: number;
  totalWeatherRequests: number;
  lastWeather?: LastWeather | null;
}
