const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const reproductionService = {
  obtenerEstadisticas: async (token) => {
    const res = await fetch(`${API_URL}/reproduccion/estadisticas`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Error al obtener estadísticas");
    return data.estadisticas;
  },

  obtenerCelos: async (token, params = {}) => {
    const { page = 1, limit = 10, search = "" } = params;
    const query = new URLSearchParams({ page, limit, search }).toString();

    const res = await fetch(`${API_URL}/reproduccion/celos?${query}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Error al obtener celos");
    return { docs: data.celos, paginacion: data.paginacion };
  },

  obtenerPreneces: async (token, params = {}) => {
    const { page = 1, limit = 10, search = "", metodo = "" } = params;
    const query = new URLSearchParams({
      page,
      limit,
      search,
      metodo,
    }).toString();

    const res = await fetch(`${API_URL}/reproduccion/preneces?${query}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Error al obtener preñeces");
    return { docs: data.preneces, paginacion: data.paginacion };
  },

  obtenerNacimientos: async (token, params = {}) => {
    const { page = 1, limit = 10, search = "", tipo = "" } = params;
    const query = new URLSearchParams({ page, limit, search, tipo }).toString();

    const res = await fetch(`${API_URL}/reproduccion/nacimientos?${query}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Error al obtener nacimientos");
    return { docs: data.nacimientos, paginacion: data.paginacion };
  },

  registrarCelo: async (token, payload) => {
    const res = await fetch(`${API_URL}/reproduccion/celo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Error al registrar celo");
    return data;
  },

  editarCelo: async (token, id, payload) => {
    const res = await fetch(`${API_URL}/reproduccion/celo/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Error al editar celo");
    return data;
  },

  confirmarPrenez: async (token, id, payload) => {
    const res = await fetch(
      `${API_URL}/reproduccion/celo/${id}/confirmar-prenez`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      },
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Error al confirmar preñez");
    return data;
  },

  editarPrenez: async (token, id, payload) => {
    const res = await fetch(`${API_URL}/reproduccion/prenez/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Error al editar preñez");
    return data;
  },

  confirmarNacimiento: async (token, id, payload) => {
    const res = await fetch(
      `${API_URL}/reproduccion/prenez/${id}/confirmar-nacimiento`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      },
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Error al confirmar nacimiento");
    return data;
  },

  editarNacimiento: async (token, id, payload) => {
    const res = await fetch(`${API_URL}/reproduccion/nacimiento/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Error al editar nacimiento");
    return data;
  },

  eliminarCiclo: async (token, id) => {
    const res = await fetch(`${API_URL}/reproduccion/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Error al eliminar registro");
    return data;
  },

  obtenerDetalleCiclo: async (token, id) => {
    const res = await fetch(`${API_URL}/reproduccion/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Error al obtener detalle");
    return data.ciclo;
  },
};
