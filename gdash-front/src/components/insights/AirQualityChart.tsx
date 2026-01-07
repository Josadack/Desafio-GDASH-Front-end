
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { AirQualityDto } from "../../model/AirQualityDto";
import { MiniAirChart } from "./MiniAirChart";

interface Props {
  city: string;
  data: AirQualityDto;
}

const POLLUTANTS = [
  {
    key: "no2",
    label: "NO₂",
    color: "#FACC15",
    description: "Gás liberado por veículos e indústrias",
  },
  {
    key: "o3",
    label: "O₃",
    color: "#F97316",
    description: "Ozônio ao nível do solo, comum à tarde",
  },
  {
    key: "pm10",
    label: "PM10",
    color: "#22C55E",
    description: "Partículas inaláveis (poeira e fumaça)",
  },
  {
    key: "pm2_5",
    label: "PM2.5",
    color: "#38BDF8",
    description: "Partículas finas que penetram nos pulmões",
  },
];


export function AirQualityChart({ city, data }: Props) {
  // transforma arrays paralelos em objetos
  const chartData = data.time.map((time, index) => ({
    time: time.slice(11, 16),
    pm2_5: data.pm2_5[index],
    pm10: data.pm10[index],
    no2: data.nitrogen_dioxide[index],
    o3: data.ozone[index],
  }));

  return (
    <div className="mt-6 p-4 bg-[#1E293B] rounded-xl border border-white/10 text-white">
      <h2 className="text-xl font-semibold mb-1">
        Qualidade do ar · {city}
      </h2>

      <p className="text-sm text-white/70 mb-4">
        Concentração de poluentes nas próximas horas (µg/m³)
      </p>

      {/* GRID DOS MINI GRÁFICOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {POLLUTANTS.map((item) => (
          <MiniAirChart
  key={item.key}
  title={item.label}
  description={item.description}
  dataKey={item.key}
  color={item.color}
  data={chartData}
          />
        ))}
      </div>
    </div>
  );
}

