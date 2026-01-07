
import type { CapitalWeather } from "../../services/CapitalWeather";
import {
  getHottestCapital,
  getAverageTemperature,
  getStrongestWind
} from "./weatherStats";

interface Props {
  data: CapitalWeather[];
}

export default function WeatherStatsCards({ data }: Props) {
  const hottest = getHottestCapital(data);
  const avgTemp = getAverageTemperature(data);
  const strongestWind = getStrongestWind(data);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MiniCard
        title="🔥 Capital mais quente"
        value={`${hottest.city} • ${hottest.temperature.toFixed(0)}°`}
      />
      <MiniCard
        title="🌡️ Temperatura média"
        value={`${avgTemp.toFixed(1)}°`}
      />
      <MiniCard
        title="💨 Maior vento"
        value={`${strongestWind.city} • ${strongestWind.wind.toFixed(0)} km/h`}
      />
    </div>
  );
}

function MiniCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="
      bg-slate-900/60 rounded-2xl p-6
      border border-white/10
      text-center
    ">
      <p className="text-slate-400 text-sm">{title}</p>
      <p className="text-white text-2xl font-semibold mt-2">{value}</p>
    </div>
  );
}
