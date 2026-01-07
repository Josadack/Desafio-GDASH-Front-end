import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis
} from "recharts";
import { buscarWeatherLogs } from "../../services/Api";
import type WeatherLogDto from "../../model/WeatherLogDto";

interface TemperatureChartProps {
  lastWeather?: { city?: string } | null;
  token: string;
}

export function TemperatureChart({ lastWeather, token }: TemperatureChartProps) {
  const [logs, setLogs] = useState<WeatherLogDto[]>([]);

  useEffect(() => {
    if (!token || !lastWeather?.city) return;

    buscarWeatherLogs((data: WeatherLogDto[]) => {
      if (!data || data.length === 0) return;

      const filteredLogs = data
        .filter(
          (log) =>
            log.temperature > 0 &&
            log.createdAt &&
            log.city.toLowerCase().trim() === lastWeather.city?.toLowerCase().trim()
        )
        .sort((a, b) =>
          new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
        );

      // Pegamos apenas os últimos 7 registros para manter o visual limpo como na home
      setLogs(filteredLogs.slice(-7));
    }, token);
  }, [lastWeather, token]);

  return (
    <div className="bg-[#1E293B] text-white p-6 rounded-2xl border border-white/5 shadow-2xl">
      <div className="flex flex-col mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          Histórico de Temperatura <span className="text-[#3B82F6] text-sm font-normal">| {lastWeather?.city}</span>
        </h2>
        <p className="text-gray-400 text-sm">Variação das últimas leituras</p>
      </div>

      {/* Grid de valores rápidos (estilo os quadradinhos da home) */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
        {logs.map((log, index) => (
          <div key={index} className="bg-white/5 p-3 rounded-lg min-w-[100px] text-center border border-white/5">
            <span className="text-[10px] text-gray-400 block mb-1 uppercase tracking-wider">
              {/* Adiciona Data e Hora: 20/12 - 18:19 */}
              {new Date(log.createdAt!).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} - {new Date(log.createdAt!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="text-lg font-bold">{Math.round(log.temperature)}°C</span>
          </div>
        ))}
      </div>

      {/* Gráfico Estilo Sparkline */}
      <div className="w-full h-[180px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={logs}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            {/* Escondemos as linhas de grade e eixos para um look clean */}
            <XAxis dataKey="createdAt" hide />
            <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />

            <Tooltip
              contentStyle={{
                backgroundColor: "#1E293B",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#F1F5F9"
              }}
              labelFormatter={(label) => new Date(label).toLocaleString()}
              formatter={(value) => [`${value}°C`, "Temperatura"]}
            />

            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#3B82F6"
              strokeWidth={4}
              dot={{ r: 4, fill: "#3B82F6", strokeWidth: 2, stroke: "#1E293B" }}
              activeDot={{ r: 7, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}