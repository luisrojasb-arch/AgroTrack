const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fincaService = {
  obtenerFinca: async (token) => {
    const res = await fetch(`${API_URL}/finca`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Error al obtener la finca");
    return data.finca;
  },

  actualizarFinca: async (token, payload) => {
    const res = await fetch(`${API_URL}/finca`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Error al actualizar la finca");
    return data;
  },

  eliminarFinca: async (token) => {
    const res = await fetch(`${API_URL}/finca`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Error al eliminar la finca");
    return data;
  },

  obtenerTasasCambio: async (token) => {
    const res = await fetch(`${API_URL}/finca/tasas-cambio`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok)
      throw new Error(data.msg || "Error al obtener las tasas de cambio");
    return data.tasas_cambio;
  },

  actualizarTasasCambio: async (token, payload) => {
    const res = await fetch(`${API_URL}/finca/tasas-cambio`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok)
      throw new Error(data.msg || "Error al actualizar las tasas de cambio");
    return data;
  },

  obtenerDashboardGeneral: async (token) => {
    const res = await fetch(`${API_URL}/finca/dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok)
      throw new Error(data.msg || "Error al obtener el dashboard");
    return data;
  },

  obtenerAlertasDashboard: async (token, params = {}) => {
    const { page = 1, limit = 5 } = params;

    const query = new URLSearchParams({
      page,
      limit,
    }).toString();

    const res = await fetch(`${API_URL}/finca/dashboard/alertas?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Error al obtener las alertas");
    return data;
  },
};