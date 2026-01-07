export default interface WeatherLogDto {
  city: string;
  temperature: number;
  humidity: number;
  condition: string;
  wind_speed: number;
  
  conditionCode?: number;
  timestamp?: string;  // opcional, já que não existe no backend
  createdAt?: string;
  updatedAt?: string;
}