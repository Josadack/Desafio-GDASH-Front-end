import { useEffect, useState, useContext, useCallback, useMemo } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { buscarCity, buscarDashboard, buscarWeatherLogs } from "../../services/Api";
import type { Dashboard } from "../../model/Dashboard";
import { TemperatureChart } from "../../components/dashboard/TemperatureChart";
import { LastWeatherCard } from "../../components/dashboard/LastWeatherCard";
import type WeatherLogDto from "../../model/WeatherLogDto";
import { ExportButton } from "../../components/buttons/Button";
import { exportCSV, exportXLSX } from "../../services/ExportService";
import { ForecastCard } from "../../components/dashboard/ForecastCard";
import { SearchOverlay } from "../../components/dashboard/loader/SearchOverlay";
import { fetchWeeklyForecast, getCityCoords, type WeeklyForecast } from "../../services/weeklyForecast";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { WeatherRequestsCard } from "../../components/dashboard/WeatherRequestsCard";
import { UsersTotalCard } from "../../components/dashboard/UsersTotalCard";
import { getLastCities } from "../../services/LastCities.service";

export default function Dashboard() {
  const { usuario } = useContext(AuthContext);
  const [data, setData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [city, setCity] = useState("");
  const [cityWeather, setCityWeather] = useState<WeatherLogDto | null>(null);
  const [logs, setLogs] = useState<WeatherLogDto[]>([]);
  const [futureForecast, setFutureForecast] = useState<WeeklyForecast | null>(null);
  const [lastCities, setLastCities] = useState<string[]>([]);

  const getConditionText = (code: number) => {
    if (code === 0) return "Céu Limpo";
    if (code <= 3) return "Parcial. Nublado";
    if (code >= 51 && code <= 67) return "Chuva";
    if (code >= 71 && code <= 77) return "Neve";
    if (code >= 80 && code <= 82) return "Pancadas Chuva";
    if (code >= 95) return "Tempestade";
    return "Nublado";
  };

  const formatarDiaSemana = (dataString: string) => {
    if (!dataString) return "";
    const [ano, mes, dia] = dataString.split("T")[0].split("-").map(Number);
    const dataUTC = new Date(Date.UTC(ano, mes - 1, dia));
    return dataUTC
      .toLocaleDateString("pt-BR", { weekday: "long", timeZone: "UTC" })
      .replace("-feira", "");
  };

  const loadFutureDays = useCallback(async (cityName: string) => {
    try {
      const coords = await getCityCoords(cityName);
      if (coords) {
        const forecast = await fetchWeeklyForecast(coords.lat, coords.lon);
        setFutureForecast(forecast);
      }
    } catch (error) {
      console.error("Erro ao carregar dias futuros:", error);
    }
  }, []);

  const forecastData = useMemo(() => {
    const diasParaExibir: WeatherLogDto[] = [];
    const hoje = new Date();
    const logsExistentes = new Map<string, WeatherLogDto>();

    logs.forEach(log => {
      if (log.createdAt) {
        const key = new Date(log.createdAt).toLocaleDateString("pt-BR");
        logsExistentes.set(key, log);
      }
    });

    let forecastIndex = 0;

    for (let i = 0; i < 7; i++) {
      const dataAtual = new Date(hoje);
      dataAtual.setDate(hoje.getDate() + i);
      const dataKey = dataAtual.toLocaleDateString("pt-BR");

      if (logsExistentes.has(dataKey)) {
        diasParaExibir.push(logsExistentes.get(dataKey)!);
        continue;
      }

      if (futureForecast?.dates[forecastIndex]) {
        diasParaExibir.push({
          city: cityWeather?.city || data?.lastWeather?.city || "Cidade",
          temperature: Math.round(futureForecast.maxTemps[forecastIndex]),
          humidity: futureForecast.humidities[forecastIndex],
          condition: getConditionText(futureForecast.conditionCodes[forecastIndex]),
          conditionCode: futureForecast.conditionCodes[forecastIndex],
          createdAt: new Date(futureForecast.dates[forecastIndex]).toISOString(),
          updatedAt: new Date().toISOString(),
        } as WeatherLogDto);

        forecastIndex++;
        continue;
      }

      diasParaExibir.push({
        city: cityWeather?.city || data?.lastWeather?.city || "...",
        temperature: 0,
        humidity: 0,
        condition: "Buscando...",
        conditionCode: 0,
        createdAt: dataAtual.toISOString(),
      } as WeatherLogDto);
    }

    return diasParaExibir;
  }, [logs, futureForecast, cityWeather, data]);

  const fetchLogs = useCallback(async (nomeCidade: string) => {
    if (!usuario?.token || !nomeCidade) return;
    buscarWeatherLogs((allLogs: WeatherLogDto[]) => {
      const filtered = allLogs
        .filter(log => log.city.toLowerCase().trim() === nomeCidade.toLowerCase().trim())
        .sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());
      setLogs(filtered);
    }, usuario.token);
  }, [usuario?.token]);

  useEffect(() => {
    if (!usuario?.token) return;
    buscarWeatherLogs((allLogs: WeatherLogDto[]) => {
      setLastCities(getLastCities(allLogs, 5));
    }, usuario.token);
  }, [usuario?.token]);

  const fetchDashboard = useCallback(async (): Promise<Dashboard | null> => {
    if (!usuario?.token) return null;
    try {
      setLoading(true);
      const dashboard = await buscarDashboard(usuario.token);
      setData(dashboard);
      if (dashboard?.lastWeather?.city) {
        await fetchLogs(dashboard.lastWeather.city);
        await loadFutureDays(dashboard.lastWeather.city);
      }
      return dashboard;
    } catch (err) {
      console.error("Erro ao carregar dashboard", err);
      return null;
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-[#F1F5F9] p-4 sm:p-10">
      <div className="bg-[#1e293b]/40 border border-white/5 rounded-[2.5rem] p-8 mt-8 shadow-2xl backdrop-blur-sm overflow-hidden">
        <h2 className="text-xl font-semibold mb-8">
          Previsão real em{" "}
          <span className="text-blue-400 capitalize">
            {cityWeather?.city || data?.lastWeather?.city || "---"}
          </span>
        </h2>

        <div className="flex gap-4 overflow-x-auto pb-8 px-2 scrollbar-hide snap-x snap-mandatory lg:justify-center">
          {forecastData.map((log, index) => (
            <div key={index} className="shrink-0 snap-center">
              <ForecastCard
                label={formatarDiaSemana(log.createdAt!)}
                temp={log.temperature}
                weatherCode={log.conditionCode || 0}
                humidity={log.humidity}
                condition={log.condition}
              />
            </div>
          ))}
        </div>

        <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent w-full my-8" />

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
