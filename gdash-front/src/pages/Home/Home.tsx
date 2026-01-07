import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import CapitaisCarousel from "../../components/home/CapitaisCarousel";
import { TechInfo } from "../../components/TechInfo";
import { useEffect, useState } from "react";
import { type CapitalWeather, fetchCapitalsWeather } from "../../services/CapitalWeather";
import WeeklyForecastRotator from "../../components/weekly/WeeklyForecastRotator";



export default function Home() {
  const [, setWeatherData] = useState<CapitalWeather[]>([]);
  const [, setCapitais] = useState<CapitalWeather[]>([]);
  const [, setLoading] = useState(true);

  useEffect(() => {
    fetchCapitalsWeather().then((data) => {
      setCapitais(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    fetchCapitalsWeather().then(setWeatherData);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
  {/* Overlay escuro */}
  <div className="absolute inset-0 bg-linear-to-b from-slate-900 via-slate-900 to-slate-950"></div>

  {/* Conteúdo principal */}
  <div className="relative max-w-3xl mx-auto flex flex-col items-center justify-center text-center space-y-10 px-6 pt-32 pb-20">
    <h1 className="text-6xl font-bold text-white leading-tight">
      <span className="block md:inline">Bem-vindo ao </span>
      <span className="block md:inline text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]">
        <TypeAnimation
          sequence={["GDASH", 3000, "", 800]}
          speed={50}
          cursor={true}
          repeat={Infinity}
        />
      </span>
    </h1>

    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
      A plataforma moderna para acompanhar dados climáticos em tempo real,
      visualizar métricas e explorar informações com inteligência.
    </p>
   
    <div className="flex justify-center gap-6 pt-4">
      <Link
        to="/login"
        className="px-8 py-3 rounded-xl text-slate-900 bg-sky-400 hover:bg-sky-300 transition text-lg font-medium shadow-lg shadow-sky-400/20"
      >
        Mostrar Dashboard
      </Link>

      <Link
        to="/explorer"
        className="px-8 py-3 rounded-xl border border-sky-400 text-sky-400 hover:bg-sky-400 hover:text-slate-900 transition text-lg font-medium"
      >
        Explorar
      </Link>
    </div>
  </div>

  <WeeklyForecastRotator />

  {/* === SOMENTE O CARROSSEL === */}
  <div className="relative w-full mt-10 pb-20 z-10">
    <h2 className="text-center text-3xl font-bold text-white mb-10">
      Principais Capitais do Brasil
    </h2>
    <CapitaisCarousel />
  </div>

  <div className="mt-10">
    <img src="caminho/para/o/grafico.png" alt="Gráfico de Tendências Climáticas" className="w-full h-auto" />
  </div>

  <div className="relative w-full flex justify-center pb-16 z-10">
    <TechInfo />
  </div>
</div>
  
  );
}
