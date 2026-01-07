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
    const diasParaExibir = [];
    const hoje = new Date();
    const logsExistentes = new Map<string, WeatherLogDto>();

    logs.forEach(log => {
      if (log.createdAt) {
        const dataFormatada = new Date(log.createdAt).toLocaleDateString('pt-BR');
        logsExistentes.set(dataFormatada, log);
      }
    });

    for (let i = 1; i < 7; i++) {
      const dataFutura = new Date();
      dataFutura.setDate(hoje.getDate() + i);
      const dataChave = dataFutura.toLocaleDateString('pt-BR');

      if (logsExistentes.has(dataChave)) {
        diasParaExibir.push(logsExistentes.get(dataChave)!);
      } else if (futureForecast && futureForecast.dates[i]) {
        diasParaExibir.push({
          city: cityWeather?.city || data?.lastWeather?.city || "Cidade",
          temperature: Math.round(futureForecast.maxTemps[i]),
          humidity: futureForecast.humidities[i],
          condition: getConditionText(futureForecast.conditionCodes[i]),
          conditionCode: futureForecast.conditionCodes[i],
          createdAt: new Date(futureForecast.dates[i]).toISOString(),
          updatedAt: new Date().toISOString(),
        } as WeatherLogDto);
      } else {
        diasParaExibir.push({
          city: cityWeather?.city || data?.lastWeather?.city || "...",
          temperature: 0,
          humidity: 0,
          condition: "Buscando...",
          conditionCode: 0,
          createdAt: dataFutura.toISOString(),
        } as WeatherLogDto);
      }
    }
    return diasParaExibir;
  }, [logs, cityWeather, data, futureForecast]);

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
        const lastCity = dashboard.lastWeather.city;
        await fetchLogs(lastCity);
        await loadFutureDays(lastCity);
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

  const handleBuscarCity = async () => {
    if (!city || !usuario?.token) return;
    try {
      setIsSearching(true);
      await buscarCity(setCityWeather, city, usuario.token);
      await loadFutureDays(city);
      await new Promise(resolve => setTimeout(resolve, 2000));
      const updatedDashboard = await buscarDashboard(usuario.token);
      if (updatedDashboard) {
        setData(updatedDashboard);

        // Ajuste aqui: Usamos o 'as' para dizer ao TS que confiamos que o formato está correto
        // ou garantimos que se não houver cidade, passamos null.
        if (updatedDashboard.lastWeather) {
          setCityWeather(updatedDashboard.lastWeather as WeatherLogDto);
        } else {
          setCityWeather(null);
        }
      }
      await fetchLogs(city);
      setCity("");
    } catch (error) {
      console.error("Erro na busca:", error);
    } finally {
      setIsSearching(false);
    }
  };

  if (loading) return    <DotLottieReact
      src="https://lottie.host/ab97b5da-8f85-4c10-be06-b36e13bc46a0/CzD6b28HrK.lottie"
      loop
      autoplay
    />

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-[#F1F5F9] p-4 sm:p-10">
      {isSearching && <SearchOverlay />}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2 bg-[#1e293b] p-1 rounded-xl border border-white/5 shadow-inner">
          <input
            type="text"
            placeholder="Digite a cidade"
            className="bg-transparent p-2 outline-none w-full sm:w-64 text-sm px-4 text-white"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button onClick={handleBuscarCity} className="px-6 py-2 bg-[#3B82F6] hover:bg-[#2563eb] text-white rounded-lg font-medium transition-all active:scale-95 shadow-lg">
            Buscar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <UsersTotalCard total={data?.totalUsers ?? 0} />
        <WeatherRequestsCard
          total={data?.totalWeatherRequests ?? 0}
          lastCities={lastCities}
          />
        <LastWeatherCard data={cityWeather ? { ...cityWeather, updatedAt: cityWeather.updatedAt || new Date().toISOString() } : data?.lastWeather} />
      </div>

      <div className="bg-[#1e293b]/40 border border-white/5 rounded-[2.5rem] p-8 mt-8 shadow-2xl backdrop-blur-sm overflow-hidden">
        <h2 className="text-xl font-semibold mb-8 flex items-center gap-2">
          Previsão real em <span className="text-blue-400 capitalize">{cityWeather?.city || data?.lastWeather?.city || "---"}</span>
        </h2>

        {/* CONTAINER DE SCROLL CORRIGIDO */}
        <div className="relative w-full">
          <div className="flex gap-4 overflow-x-auto pb-8 px-2 scrollbar-hide snap-x snap-mandatory lg:justify-center">
            {forecastData.map((log, index) => (
              <div
                key={index}
                className="shrink-0 snap-center" // shrink-0 impede o card de diminuir. snap-center ajuda na rolagem mobile.
              >
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
        </div>

        <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent w-full my-8" />

        <div className="mt-4">
          <h3 className="text-sm text-gray-400 mb-4 ml-2">Histórico de variações gravadas</h3>
          <TemperatureChart lastWeather={cityWeather || data?.lastWeather} token={usuario?.token!} />
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <ExportButton label="Exportar CSV" onClick={() => exportCSV(usuario?.token || "")} color="blue" />
        <ExportButton label="Exportar XLSX" onClick={() => exportXLSX(usuario?.token || "")} color="orange" />
      </div>
    </div>
  );
}