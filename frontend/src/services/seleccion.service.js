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

  obtenerDashboardSeleccion: async (token) => {
    const res = await fetch(`${API_URL}/selecciones/dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok)
      throw new Error(data.msg || "Error al obtener dashboard de selección");
    return data;
  },

  registrarSeleccion: async (token, data) => {
    const res = await fetch(`${API_URL}/selecciones`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok)
      throw new Error(result.msg || "Error al registrar la selección");
    return result;
  },

  obtenerDetalleSeleccion: async (token, id) => {
    const res = await fetch(`${API_URL}/selecciones/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.msg || "Error al obtener detalles");
    return result;
  },

  editarSeleccion: async (token, id, data) => {
    const res = await fetch(`${API_URL}/selecciones/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.msg || "Error al editar la selección");
    return result;
  },

  eliminarSeleccion: async (token, id) => {
    const res = await fetch(`${API_URL}/selecciones/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();
    if (!res.ok)
      throw new Error(result.msg || "Error al eliminar la selección");
    return result;
  },

  registrarPeso: async (token, id, payload) => {
    const res = await fetch(`${API_URL}/selecciones/${id}/pesos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.msg || "Error al registrar el peso");
    return result;
  },

  aprobarSeleccion: async (token, id, payload) => {
    const res = await fetch(`${API_URL}/selecciones/${id}/aprobar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.msg || "Error al aprobar la selección");
    return result;
  },
};
