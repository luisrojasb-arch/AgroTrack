const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const financeService = {
  getResumen: async (token, params = "") => {
    const res = await fetch(`${API_URL}/finanzas/resumen?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Error al obtener el resumen de finanzas");
    return res.json();
  },

  getEstadisticas: async (token) => {
    const res = await fetch(`${API_URL}/finanzas/estadisticas`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Error al obtener las estadísticas financieras");
    return res.json();
  },

  getDetalle: async (token, id) => {
    const res = await fetch(`${API_URL}/finanzas/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Error al obtener los detalles de la transacción");
    return res.json();
  },

  create: async (token, data) => {
    const res = await fetch(`${API_URL}/finanzas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.msg || "Error al registrar la transacción");
    return json;
  },

  update: async (token, id, data) => {
    const res = await fetch(`${API_URL}/finanzas/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.msg || "Error al actualizar la transacción");
    return json;
  },

  delete: async (token, id) => {
    const res = await fetch(`${API_URL}/finanzas/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.msg || "Error al eliminar la transacción");
    return json;
  },
};