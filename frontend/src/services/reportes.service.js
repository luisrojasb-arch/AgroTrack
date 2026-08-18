const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetchJSON = async (token, endpoint, params = {}) => {
  const query = new URLSearchParams(params).toString();
  console.log(`${API_URL}/reportes/${endpoint}?${query}`)
  const res = await fetch(`${API_URL}/reportes/${endpoint}?${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || "Error al obtener los datos del reporte");
  return data;
};

export const reportesService = {
  obtenerDatosProduccion: async (token, params) => fetchJSON(token, "produccion", params),
  obtenerDatosSalud: async (token, params) => fetchJSON(token, "salud", params),
  obtenerDatosFinanciero: async (token, params) => fetchJSON(token, "financiero", params),
  obtenerDatosInventario: async (token, params) => fetchJSON(token, "inventario", params),
  obtenerDatosReproductivo: async (token, params) => fetchJSON(token, "reproductivo", params),
  obtenerDatosAnual: async (token, params) => fetchJSON(token, "anual", params),
};