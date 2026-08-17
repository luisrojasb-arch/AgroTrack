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

  registrarLote: async (token, data) => {
    const res = await fetch(`${API_URL}/lotes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.msg || "Error al registrar el lote");
    return result;
  },

  obtenerDetalleLote: async (token, id) => {
    const res = await fetch(`${API_URL}/lotes/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const result = await res.json();
    if (!res.ok)
      throw new Error(result.msg || "Error al obtener detalles del lote");
    return result;
  },

  editarLote: async (token, id, data) => {
    const res = await fetch(`${API_URL}/lotes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.msg || "Error al editar el lote");
    return result;
  },

  eliminarLote: async (token, id) => {
    const res = await fetch(`${API_URL}/lotes/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.msg || "Error al eliminar el lote");
    return result;
  },

  registrarSituacion: async (token, id, payload) => {
    const res = await fetch(`${API_URL}/lotes/${id}/situacion`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok)
      throw new Error(data.msg || "Error al registrar la situación del lote");
    return data;
  },
};
