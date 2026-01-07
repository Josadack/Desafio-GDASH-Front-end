import { CloudSun, CloudMoon } from "lucide-react";
import type { LastWeather } from "../../model/Dashboard";

interface Props {
  data?: LastWeather | null;
}

export function LastWeatherCard({ data }: Props) {

   const hour = new Date().getHours();
    const isNight = hour >= 18 || hour < 6;

     const weatherIcon = isNight ? (
    <CloudMoon
      size={32}
      className="text-indigo-400 drop-shadow-[0_0_6px_rgba(99,102,241,0.6)]"
    />
  ) : (
    <CloudSun
      size={32}
      className="text-blue-400 drop-shadow-[0_0_6px_rgba(197, 105, 0, 0.6)]"
    />
  );
    
  return (
    <div
      className="
      bg-[#1E293B] text-white
      border border-white/10 p-6 rounded-xl
      transition-all duration-300
      hover:scale-[1.02] hover:shadow-[0_4px_20px_rgba(59,130,246,0.25)]
      "
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Última Consulta</h2>
        <div className="p-3 rounded-xl bg-white/10">
           {weatherIcon}
        </div>
      </div>
   
      {data ? (
        <div className="space-y-2 text-[#3B82F6]">
          <div className="flex justify-between">
            <span className="text-sm text-[#94A3B8]">Cidade</span>
            <span className="font-medium">{data.city}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-[#94A3B8]">Temperatura</span>
            <span className="font-medium">{data.temperature}°C</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-[#94A3B8]">Umidade</span>
            <span className="font-medium">{data.humidity}%</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-[#94A3B8]">Condição</span>
            <span className="font-medium capitalize">{data.condition}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-[#94A3B8]">Atualizado</span>
            <span className="text-sm">
              {data.updatedAt ? new Date(data.updatedAt).toLocaleString() : "-"}
            </span>
          </div>
        </div>
      ) : (
        <p className="text-white/80">Nenhum registro de clima encontrado.</p>
      )}
    </div>
  );
}
