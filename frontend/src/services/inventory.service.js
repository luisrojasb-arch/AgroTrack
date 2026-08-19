const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * @description Servicio de inventario. Encargado de las operaciones de stock, ajustes, registro y eliminación de artículos en la API.
 * @type {Object}
 */

export const inventoryService = {
  getResumen: async (token, params = "") => {
    const res = await fetch(`${API_URL}/inventario/resumen?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Error al obtener resumen de inventario");
    return res.json();
  },

  getEstadisticas: async (token) => {
    const res = await fetch(`${API_URL}/inventario/estadisticas`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Error al obtener estadísticas");
    return res.json();
  },

  getDetalle: async (token, id) => {
    const res = await fetch(`${API_URL}/inventario/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Error al obtener detalles");
    return res.json();
  },

  create: async (token, data) => {
    const res = await fetch(`${API_URL}/inventario`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.msg || "Error al crear artículo");
    return json;
  },

  update: async (token, id, data) => {
    const res = await fetch(`${API_URL}/inventario/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.msg || "Error al actualizar artículo");
    return json;
  },

  delete: async (token, id) => {
    const res = await fetch(`${API_URL}/inventario/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.msg || "Error al eliminar artículo");
    return json;
  },

  ajustarStock: async (token, id, data) => {
    const res = await fetch(`${API_URL}/inventario/${id}/ajustar-stock`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.msg || "Error al ajustar stock");
    return json;
  },
};