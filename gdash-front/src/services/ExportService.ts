import api from "./Api";



export const exportCSV = async (token: string) => {
  try {
    const resposta = await api.get("/api/weather/export.csv", {
      headers: { Authorization: token },
      responseType: "blob" // importante para download
    });

    const url = window.URL.createObjectURL(new Blob([resposta.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "weather_logs.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error("Erro ao exportar CSV", err);
  }
}

export const exportXLSX = async (token: string) => {
  try {
    const resposta = await api.get("/api/weather/export.xlsx", {
      headers: { Authorization: token },
      responseType: "blob"
    });

    const url = window.URL.createObjectURL(new Blob([resposta.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "weather_logs.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error("Erro ao exportar XLSX", err);
  }
}
