import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface WeatherIconProps {
  code: number; // O nome aqui deve ser exatamente o que você usa na chamada
}

export function WeatherIcon({ code }: WeatherIconProps) {
    // Detectar dia/noite automaticamente
  const hour = new Date().getHours();
  const isNight = hour >= 18 || hour < 6;

   // 🌙 Ícone da Lua (noite clara)
  if (code === 0 && isNight)
    return (
      <DotLottieReact
        src="https://lottie.host/204c0d88-daad-45fd-91b3-c3add39054e8/y3a0sIsVNy.lottie" // animação da lua
        autoplay
        loop
        className="w-18 h-18"
      />
    );

    // ☀️ Sol (dia claro)
  if (code === 0 && !isNight)
    return (
      <DotLottieReact
        src="https://lottie.host/5be042f4-2d22-4479-809a-96d2d8fc7b48/zUyN3bXQ49.lottie"
        autoplay
        loop
        className="w-18 h-18"
      />
    );

   // 🌤️ e 🌥️ Sol com nuvens / Lua com nuvens
  if ([1, 2].includes(code))
    return (
      <DotLottieReact
        src={
          isNight
            ? "https://lottie.host/86089ba7-64e4-47e9-a52d-3c7119bc1a7f/iTgZRFk8fV.lottie" // nuvem + lua
            : "https://lottie.host/7739d001-14ba-43a1-8cce-30fa56980163/3Et0qdBaAC.lottie"
        }
        autoplay
        loop
        className="w-18 h-18"
      />
    );

   // ☁️ Nublado (dia) / 🌥️ Nublado noite
  if (code === 3)
    return (
      <DotLottieReact
        src={
          isNight
            ? "https://lottie.host/d89f9141-bad4-4c4c-8cb3-33e4ba379139/6CKxcpxcxW.lottie" // nublado com lua
            : "https://lottie.host/d89f9141-bad4-4c4c-8cb3-33e4ba379139/6CKxcpxcxW.lottie"
        }
        autoplay
        loop
        className="w-18 h-18"
      />
    );

   // 🌫️ Névoa
  if ([45, 48].includes(code))
    return (
      <DotLottieReact
        src={
          isNight
            ? "https://lottie.host/2585510f-b8b0-49a3-8656-af38ad98a6f5/Bk4QMdEAtc.lottie" // neblina noturna
            : "https://lottie.host/0cb9105b-5de9-41e7-a058-485008c85446/UwLzsBvCOs.lottie"
        }
        autoplay
        loop
        className="w-18 h-18"
      />
    );

   // 🌧️ Chuva dia / 🌧️ Chuva noite
  if ([51, 53, 55, 61, 63, 65].includes(code))
    return (
      <DotLottieReact
        src={
          isNight
            ? "https://lottie.host/8862532c-1559-4330-a9a5-8feab29ad6eb/11W1dzXWuY.lottie"
            : "https://lottie.host/00ea6d5b-bb86-45bc-834c-0ae3c277f7a3/lmrTr3ibLP.lottie"
        }
        autoplay
        loop
        className="w-18 h-18"
      />
    );

    // ⛈️ Tempestade (dia/noite)
  if ([95, 96, 99].includes(code))
    return (
      <DotLottieReact
        src={
          isNight
            ? "https://lottie.host/88c413c2-be8f-4b9f-89ea-3382cafc8410/K1n1NPGuKW.lottie"
            : "https://lottie.host/88c413c2-be8f-4b9f-89ea-3382cafc8410/K1n1NPGuKW.lottie"
        }
        autoplay
        loop
        className="w-18 h-18"
      />
    );

  // Padrão ☁️
  return (
    <DotLottieReact
      src="https://lottie.host/75db8744-2756-4046-bf2e-2266641c2398/2IwuTmWYtx.lottie"
      autoplay
      loop
      className="w-18 h-18"
    />
  );
}
"https://lottie.host/e770dca3-2fa0-48c6-9c07-e27cc9c1dc80/UjH06pZeYG.lottie"