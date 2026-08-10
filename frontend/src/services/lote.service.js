const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const loteService = {
  obtenerLotes: async (token, params = {}) => {
    const { page = 1, limit = 10, search = "" } = params;
    const query = new URLSearchParams({ page, limit, search }).toString();

    const res = await fetch(`${API_URL}/lotes?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Error al obtener lotes");
    return data;
  },
};
