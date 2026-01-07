import { useEffect, useState } from "react";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";
import { CAPITALS_COORDS } from "../../services/CapitalWeather";
import { type WeeklyForecast, fetchWeeklyForecast } from "../../services/weeklyForecast";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// Componente para mostrar previsão semanal de uma capital
export default function WeeklyForecastRotator() {
    const [index, setIndex] = useState(0); // controla qual capital está ativa
    const [forecast, setForecast] = useState<WeeklyForecast | null>(null); // dados semanais da capital
    const INTERVAL_SECONDS = 20;

    const [secondsLeft, setSecondsLeft] = useState(INTERVAL_SECONDS);

    // Pegando a capital que corresponde ao índice atual
    const capital = CAPITALS_COORDS[index];

    // Troca de capital a cada 20 segundos
    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % CAPITALS_COORDS.length);
        }, 20000); // Muda a cada 20 segundos

        return () => clearInterval(timer); // limpa o intervalo quando o componente desmontar
    }, []);

    // Busca os dados semanais da capital atual
    useEffect(() => {
        fetchWeeklyForecast(capital.lat, capital.lon)
            .then(setForecast);
    }, [capital]);

    useEffect(() => {
        const countdown = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) return INTERVAL_SECONDS;
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(countdown);
    }, []);


    // Caso os dados ainda estejam carregando
    if (!forecast) {
        return (
            <div className="w-full flex justify-center py-10 text-slate-500">
                <DotLottieReact
                    src="https://lottie.host/e7d03e74-00cf-4253-8e3c-2166a921747d/3mkvsClcLh.lottie"
                    loop
                    autoplay
                />
            </div>
        );
    }

    return (
        <div className="relative z-10 max-w-6xl mx-auto px-6 mt-12">
            <div className="
            bg-slate-900/70
            border border-white/10
            rounded-2xl
            p-6
            space-y-6
            shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]
            shadow-sky-500/10 transition-shadow duration-300 hover:shadow-sky-400/20"
            >
                {/* Título */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white">
                        Previsão semanal ▫️ {capital.city}
                    </h2>
                    <p className="text-slate-400 text-sm">
                        Próxima capital em{" "}
                        <span className="text-sky-400 font-medium">
                            {secondsLeft}s
                        </span>
                    </p>
                </div>

                {/* Exibição da previsão semanal */}
                <div className="grid grid-cols-7 md:grid-cols-7 gap-2 text-center">
                    {forecast.dates.map((date, index) => (
                        <div
                            key={date}
                            className="bg-slate-800/60 rounded-xl p-2 border border-white/5"
                        >
                            <p className="text-[10px] text-slate-400">
                                {new Date(date + "T12:00:00").toLocaleDateString("pt-BR", {
                                    weekday: "short",
                                    timeZone: "America/Sao_Paulo",
                                })}
                            </p>

                            <p className="text-white font-semibold text-sm">
                                {Math.round(forecast.maxTemps[index])}℃
                            </p>

                            <p className="text-slate-400 text-xs">
                                {Math.round(forecast.minTemps[index])}℃
                            </p>
                        </div>
                    ))}
                </div>

                {/* Gráfico de Linha com a previsão semanal */}
                <div className="mt-6">
                    <h3 className="text-white font-semibold text-sm mb-3">
                        Temperaturas da semana
                    </h3>

                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart
                            data={forecast.dates.map((date, index) => ({
                                date,
                                maxTemp: forecast.maxTemps[index],
                                minTemp: forecast.minTemps[index],
                            }))}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                            <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="maxTemp"
                                stroke="#38bdf8"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                                activeDot={{ r: 5 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="minTemp"
                                stroke="#fca5a5"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                                activeDot={{ r: 5 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
