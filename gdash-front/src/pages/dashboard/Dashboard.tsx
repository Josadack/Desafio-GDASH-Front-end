import { useEffect, useState, useContext, useCallback, useMemo } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { buscarDashboard, buscarWeatherLogs } from "../../services/Api";
import type { Dashboard } from "../../model/Dashboard";
import { TemperatureChart } from "../../components/dashboard/TemperatureChart";
import type WeatherLogDto from "../../model/WeatherLogDto";
import { ExportButton } from "../../components/buttons/Button";
import { exportCSV, exportXLSX } from "../../services/ExportService";
import { ForecastCard } from "../../components/dashboard/ForecastCard";
import { fetchWeeklyForecast, getCityCoords, type WeeklyForecast } from "../../services/weeklyForecast";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { getLastCities } from "../../services/LastCities.service";

const daysOfWeek = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

export default function Dashboard() {
  const { usuario } = useContext(AuthContext);
  const [data, setData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [cityWeather, setCityWeather] = useState<WeatherLogDto | null>(null);
  const [logs, setLogs] = useState<WeatherLogDto[]>([]);
  const [futureForecast, setFutureForecast] = useState<WeeklyForecast | null>(null);

  const getConditionText = (code: number) => {
    if (code === 0) return "Céu Limpo";
    if (code <= 3) return "Parcial. Nublado";
    if (code >= 51 && code <= 67) return "Chuva";
    if (code >= 71 && code <= 77) return "Neve";
    if (code >= 80 && code <= 82) return "Pancadas Chuva";
    if (code >= 95) return "Tempestade";
    return "Nublado";
  };

  const loadFutureDays = useCallback(async (cityName: string) => {
    const coords = await getCityCoords(cityName);
    if (!coords) return;
    const forecast = await fetchWeeklyForecast(coords.lat, coords.lon);
    setFutureForecast(forecast);
  }, []);

  const forecastData = useMemo(() => {
    const hoje = new Date();
    const dias: WeatherLogDto[] = [];
    let forecastIndex = 0;

    for (let i = 0; i < 7; i++) {
      const dataAtual = new Date(hoje);
      dataAtual.setDate(hoje.getDate() + i);

      if (futureForecast?.dates[forecastIndex]) {
        dias.push({
          city: cityWeather?.city || data?.lastWeather?.city || "Cidade",
          temperature: Math.round(futureForecast.maxTemps[forecastIndex]),
          humidity: futureForecast.humidities[forecastIndex],
          condition: getConditionText(futureForecast.conditionCodes[forecastIndex]),
          conditionCode: futureForecast.conditionCodes[forecastIndex],
          createdAt: dataAtual.toISOString(),
          updatedAt: new Date().toISOString(),
        } as WeatherLogDto);

        forecastIndex++;
      }
    }

    return dias;
  }, [futureForecast, cityWeather, data]);

  const fetchLogs = useCallback(async (city: string) => {
    if (!usuario?.token) return;
    buscarWeatherLogs((allLogs: WeatherLogDto[]) => {
      setLogs(
        allLogs.filter(
          log => log.city.toLowerCase().trim() === city.toLowerCase().trim()
        )
      );
    }, usuario.token);
  }, [usuario?.token]);

  const fetchDashboard = useCallback(async () => {
    if (!usuario?.token) return;
    setLoading(true);
    const dashboard = await buscarDashboard(usuario.token);
    setData(dashboard);

    if (dashboard?.lastWeather?.city) {
      await fetchLogs(dashboard.lastWeather.city);
      await loadFutureDays(dashboard.lastWeather.city);
    }

    setLoading(false);
  }, [usuario?.token, fetchLogs, loadFutureDays]);

  useEffect(() => {
    if (!usuario?.token) return;
    void fetchDashboard();
  }, [usuario?.token, fetchDashboard]);

  if (loading)
    return (
      <DotLottieReact
        src="https://lottie.host/ab97b5da-8f85-4c10-be06-b36e13bc46a0/CzD6b28HrK.lottie"
        loop
        autoplay
      />
    );

  const todayIndex = new Date().getDay();

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-[#F1F5F9] p-4 sm:p-10">
      <div className="bg-[#1e293b]/40 border border-white/5 rounded-[2.5rem] p-8 mt-8 shadow-2xl backdrop-blur-sm overflow-hidden">
        <h2 className="text-xl font-semibold mb-8">
          Previsão real em{" "}
          <span className="text-blue-400 capitalize">
            {cityWeather?.city || data?.lastWeather?.city || "---"}
          </span>
        </h2>

        <div className="flex gap-4 overflow-x-auto pb-8 px-2 scrollbar-hide lg:justify-center">
          {forecastData.map((log, index) => (
            <ForecastCard
              key={index}
              label={daysOfWeek[(todayIndex + index) % 7]}
              temp={log.temperature}
              weatherCode={log.conditionCode || 0}
              humidity={log.humidity}
              condition={log.condition}
            />
          ))}
        </div>

        <div className="h-px bg-white/10 w-full my-8" />

        <TemperatureChart
          lastWeather={cityWeather || data?.lastWeather}
          token={usuario?.token!}
        />
      </div>

      <div className="mt-8 flex gap-4">
        <ExportButton label="Exportar CSV" onClick={() => exportCSV(usuario?.token || "")} color="blue" />
        <ExportButton label="Exportar XLSX" onClick={() => exportXLSX(usuario?.token || "")} color="orange" />
      </div>
    </div>
  );
}
