const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const animalService = {
  obtenerEstadisticas: async (token) => {
    const res = await fetch(`${API_URL}/animales/estadisticas`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Error al obtener estadísticas");
    return data.estadisticas;
  },

  obtenerAnimales: async (token, params = {}) => {
    const { page = 1, limit = 10, search = "", sexo = "" } = params;

    const query = new URLSearchParams({
      page,
      limit,
      search,
      sexo,
    }).toString();

    const res = await fetch(`${API_URL}/animales?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Error al obtener animales");
    return data;
  },
};
