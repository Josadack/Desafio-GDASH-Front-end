import { useEffect, useState } from "react";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import {
  fetchCapitalsWeather,
  type CapitalWeather,
} from "../../services/CapitalWeather";

import CapitalCard from "./CapitalCard";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function CapitaisCarousel() {
  const [capitais, setCapitais] = useState<CapitalWeather[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await fetchCapitalsWeather();
      setCapitais(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
     <div className="w-full flex justify-center py-8">
         <DotLottieReact
      src="https://lottie.host/e7d03e74-00cf-4253-8e3c-2166a921747d/3mkvsClcLh.lottie"
      loop
      autoplay
    />
    
    </div>
    );
  }

  return (
    <div className="mt-14 w-full">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={16}
        slidesPerView={2} // 🔑 BASE obrigatória
        loop
        speed={6000}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}
        allowTouchMove={false}
        style={{ padding: "0 40px" }}
        breakpoints={{
          300: {
            slidesPerView: 1,
          },
          450: {
            slidesPerView: 2,
          },
          740: {
            slidesPerView: 3,
          },
          768: {
            slidesPerView: 4,
          },
          1024: {
            slidesPerView: 5,
          },
          1280: {
            slidesPerView: 7,
          },
          1320: {
            slidesPerView: 8,
          },
        }}
      >
        {capitais.map((capital, index) => (
          <SwiperSlide
            key={capital.city + index}
            className="flex justify-center"
          >
            <CapitalCard
              cidade={capital.city}
              temperatura={capital.temperature}
              condicao={capital.condition}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
