import { WeatherIcon } from "../../utils/WeatherIcon";


interface ForecastCardProps {
  label: string; 
  temp: number;
  weatherCode: number; // Novo campo
  humidity?: number;    // Nova prop
  condition?: string;   // Nova prop
}

export function ForecastCard({ label, temp, weatherCode, humidity, condition }: ForecastCardProps) {
  return (
    <div className="shrink-0 min-w-[180px] bg-[#1e293b]/50 border border-white/5 p-5 rounded-4xl flex flex-col items-center gap-3 transition-all hover:scale-105 hover:bg-[#1e293b]/80 shadow-xl backdrop-blur-sm">
      
      {/* Dia da Semana */}
      <span className="text-gray-400 text-sm font-medium capitalize">{label}</span>
      
      {/* Ícone Animado */}
      <div className="w-14 h-14">
        <WeatherIcon code={weatherCode} />
      </div>
      
      {/* Temperatura Principal */}
      <span className="text-2xl font-bold text-white">{Math.round(temp)}°</span>

      {/* Divisor Suave */}
      <div className="h-px bg-white/10 w-full my-1" />

      {/* Novas Informações com Ícones Estáticos */}
      <div className="flex flex-col gap-2 w-full text-[13px]">
        <div className="flex justify-between items-center text-gray-400">
          <span className="flex items-center gap-1">💧 Umid.</span>
          <span className="text-blue-400 font-semibold">{humidity ?? '--'}%</span>
        </div>
        <div className="flex justify-between items-center text-gray-400">
          <span className="flex items-center gap-1">☁️ Cond.</span>
          <span className="text-blue-400 font-medium truncate max-w-[70px]" title={condition}>
            {condition ?? '---'}
          </span>
        </div>
      </div>
    </div>
  );
}