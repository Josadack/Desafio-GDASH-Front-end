import { CloudSun, CloudMoon } from "lucide-react";
import { CardDashboard } from "./CardDashboard";

interface Props {
  total: number;
  lastCities: string[];
}

export function WeatherRequestsCard({ total, lastCities }: Props) {
  // 🌙🌞 Regra simples de dia/noite (frontend only)
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
    <CardDashboard
      title="Requisições Climáticas"
      icon={weatherIcon}
    >
      {/* MÉTRICA PRINCIPAL */}
      <p
        className="text-3xl font-extrabold text-[#3B82F6]"
        title="Total de buscas climáticas realizadas pelos usuários"
      >
        {total}
      </p>

      {/* CONTEXTO DA MÉTRICA */}
      <p className="text-xs text-gray-400 mb-3">
        buscas registradas
      </p>

      {/* CONTEXTO DA LISTA */}
      <p className="text-xs text-gray-400 mb-2">
        Últimas cidades buscadas
      </p>

      {/* LISTA DE CIDADES */}
      <div className="text-sm text-gray-300 space-y-1">
        {lastCities.slice(0, 4).map((city, index) => (
          <div
            key={index}
            className="flex items-center gap-2 hover:translate-x-1 transition-all duration-200"
          >
            <span className="w-2 h-2 bg-blue-400 rounded-full" />
            <span className="font-medium text-gray-200">
              {city}
            </span>
          </div>
        ))}

        {lastCities.length > 4 && (
          <span className="text-xs text-gray-400 ml-4">
            +{lastCities.length - 4} outras
          </span>
        )}
      </div>
    </CardDashboard>
  );
}
