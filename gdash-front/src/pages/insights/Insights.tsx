import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { getWeatherLogs, buscarDashboard } from "../../services/Api";
import type WeatherLogDto from "../../model/WeatherLogDto";
import { InsightCard } from "../../components/insights/InsightCard";
import { gerarInsightsGemini } from "../../services/OpenIA";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { getAirQuality } from "../../services/airQualityService";
import { AirQualityChart } from "../../components/insights/AirQualityChart";
import type { AirQualityDto } from "../../model/AirQualityDto";
import { getCityCoords } from "../../services/weeklyForecast";


export default function Insights() {
  const { usuario } = useContext(AuthContext);

  const [logs, setLogs] = useState<WeatherLogDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [iaInsight, setIaInsight] = useState("");

  const [airQuality, setAirQuality] = useState<AirQualityDto | null>(null);
  const [city, setCity] = useState("");
  const [airError, setAirError] = useState<string | null>(null);

  useEffect(() => {
    if (!usuario?.token) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setAirError(null);
        setAirQuality(null);

        // Logs climáticos
        const dataLogs = await getWeatherLogs(usuario.token);
        setLogs(dataLogs);

        // Dashboard
        const dashboard = await buscarDashboard(usuario.token);
        console.log("DASHBOARD RAW:", dashboard);

        const last = dashboard.lastWeather;
        console.log("LAST WEATHER:", last);

        if (!last?.city) {
          setAirError("Cidade não encontrada no último registro.");
          return;
        }

        setCity(last.city);

        // Geocoding pelo nome da cidade
        const coords = await getCityCoords(last.city);

        if (!coords) {
          setAirError("Não foi possível obter coordenadas da cidade.");
          return;
        }

        // Qualidade do ar
        const air = await getAirQuality(coords.lat, coords.lon);

        setAirQuality({
          time: air.time.slice(0, 24),
          pm10: air.pm10.slice(0, 24),
          pm2_5: air.pm2_5.slice(0, 24),
          ozone: air.ozone.slice(0, 24),
          nitrogen_dioxide: air.nitrogen_dioxide.slice(0, 24),
        });

        // Insight IA
        const prompt = `
          Me dê um resumo inteligente sobre o clima da semana em ${last.city}.
          Use emojis simples 🌤️🌡️☀️.
          Texto corrido em até 5 linhas.
        `;

        const resultadoIA = await gerarInsightsGemini(prompt);
        setIaInsight(resultadoIA);
      } catch (err) {
        console.error(err);
        setAirError("Erro ao carregar dados de qualidade do ar.");
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [usuario?.token]);

  const averageTemperature = logs.length
    ? (
        logs.reduce((sum, l) => sum + l.temperature, 0) / logs.length
      ).toFixed(2)
    : "0";

  const averageHumidity = logs.length
    ? (
        logs.reduce((sum, l) => sum + l.humidity, 0) / logs.length
      ).toFixed(2)
    : "0";

  return (
    <div className="flex flex-col min-h-screen">
      <main className="grow p-6 overflow-auto bg-[#1E293B]">
        <h1 className="text-2xl text-white font-bold mb-6">
          Insights de IA
        </h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-white">
            <DotLottieReact
              src="https://lottie.host/3ed8d39b-a721-47de-950c-3a94e319bb11/Xdw95imcJq.lottie"
              loop
              autoplay
            />
            <span>Carregando insights...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <InsightCard
                title="Temperatura Média"
                value={`${averageTemperature}°C`}
              />
              <InsightCard
                title="Umidade Média"
                value={`${averageHumidity}%`}
              />
              <InsightCard
                title="Total de Registros"
                value={logs.length}
              />
            </div>

            {iaInsight && (
              <div className="mt-6 p-4 bg-[#1E293B] rounded-xl border border-white/10 text-white">
                <h2 className="text-xl font-semibold mb-2">
                  Insight da IA
                </h2>
                <p className="whitespace-pre-line">{iaInsight}</p>
              </div>
            )}

            {airQuality && (
              <AirQualityChart
                city={city}
                data={airQuality}
              />
            )}

            {airError && (
              <div className="mt-6 p-4 rounded-xl bg-yellow-500/10 text-yellow-300 border border-yellow-500/30">
                {airError}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
