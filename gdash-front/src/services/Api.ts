import axios from "axios";
import type UserLogin from "../model/UserLogin";
import type { Dashboard } from "../model/Dashboard";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

export const cadastrarUsuario = async (url: string, dados: any, setDados: Function) => {
    const payload = { ...dados };
    delete payload.id;

    const resposta = await api.post(url, payload);
    setDados(resposta.data);
};

export const login = async (url: string, dados: Object, setUsuario: unknown): Promise<UserLogin> => {
  const resposta = await api.post(url, dados);
  return resposta.data as UserLogin; // força o tipo para UserLogin
}

export const buscar = async(url: string, setDados: Function, header: Object) =>{
    const resposta = await api.get(url, header)
    setDados(resposta.data)
}

export const atualizar = async (
  url: string,
  dados: Object,
  setDados: Function,
  header?: Object
) => {
  const resposta = await api.put(url, dados, header)
  setDados(resposta.data)
}

export const buscarDashboard = async (token: string): Promise<Dashboard> => {
  const resposta = await api.get("/api/dashboard", {
    headers: { Authorization: token }
  });
  return resposta.data as Dashboard;
};

export const buscarCity = async (
  setDados: Function,
  city: string,
  token: string
) => {
  try {
    const resposta = await api.post(
      "/api/weather",
      { city },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json"
        }
      }
    );

    setDados(resposta.data);
    return resposta.data; // ESSENCIAL para o card atualizar
  } catch (err) {
    console.error("Erro ao buscar cidade", err);
    return null;
  }
};



export const buscarWeatherLogs = async (setDados: Function, token: string) => {
  try {
    const resposta = await api.get("/api/weather/logs", {
      headers: { Authorization: token },
    });
    setDados(resposta.data); // retorna um array de WeatherLogDto
  } catch (error) {
    console.error("Erro ao buscar histórico de clima", error);
  }
};

export const getWeatherLogs = async (token: string) => {
  const res = await api.get("/api/weather/logs", { headers: { Authorization: token } });
  return res.data; // array de WeatherLogDto
};


export default api;



