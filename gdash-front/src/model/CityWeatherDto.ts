export default interface CityWeatherDto {
  city: string;
  temperature?: number;
  humidity?: number;
  condition?: string;
  wind_speed?: number;
  updatedAt?: string; // opcional, porque no POST inicial só temos a cidade
}
