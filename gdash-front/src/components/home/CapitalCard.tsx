import { WeatherIcon } from "../../utils/WeatherIcon";

interface CapitalCardProps {
  cidade: string;
  temperatura: number;
  condicao: number;
}

export default function CapitalCard({
  cidade,
  temperatura,
  condicao,
}: CapitalCardProps) {

  return (
    <div
      className="
      w-40 h-46
    shrink-0
    rounded-3xl p-4 
    flex flex-col items-center justify-between
    shadow-lg
    bg-linear-to-b from-[#1E2533] to-[#111723]
    border border-white/10
      "
    >
      {/* Ícone */}
      <div className="flex flex-col items-center gap-1">
        <div className="scale-90"><WeatherIcon code={condicao} /></div>

        {/* Horário ou título (aqui coloquei a cidade) */}
        <span className="text-white text-sm font-medium">
          {cidade}
        </span>
      </div>

      {/* Temperatura */}
      <span className="text-white text-3xl font-semibold tracking-tight">
        {temperatura.toFixed(0)}°
      </span>

    </div>
  );
}
