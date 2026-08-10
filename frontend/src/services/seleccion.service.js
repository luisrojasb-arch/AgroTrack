const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const seleccionService = {
  obtenerSelecciones: async (token, params = {}) => {
    const { page = 1, limit = 10, search = "", estado = "Todos" } = params;

    const query = new URLSearchParams({
      page,
      limit,
      search,
      estado,
    }).toString();

    const res = await fetch(`${API_URL}/selecciones?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Error al obtener selecciones");
    return data;
  },
};
