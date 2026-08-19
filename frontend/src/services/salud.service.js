const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * @description Servicio de salud. Gestiona las tareas sanitarias, tratamientos, vacunaciones y resúmenes médicos de la finca en la API.
 * @type {Object}
 */

export const saludService = {
  obtenerEstadisticas: async (token) => {
    const res = await fetch(`${API_URL}/salud/estadisticas`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok)
      throw new Error(data.msg || "Error al obtener estadísticas de salud");
    return data.estadisticas;
  },

  obtenerTareas: async (token, params = {}) => {
    const { page = 1, limit = 5, animal_id = "", lote_id = "" } = params;

    const queryParams = { page, limit };
    if (animal_id) queryParams.animal_id = animal_id;
    if (lote_id) queryParams.lote_id = lote_id;

    const query = new URLSearchParams(queryParams).toString();

    const res = await fetch(`${API_URL}/salud?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok)
      throw new Error(data.msg || "Error al obtener tareas de salud");
    return data;
  },

  obtenerResumenLotes: async (token, params = {}) => {
    const { page = 1, limit = 10, search = "" } = params;

    const query = new URLSearchParams({
      page,
      limit,
      search,
    }).toString();

    const res = await fetch(`${API_URL}/salud/resumen-lotes?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok)
      throw new Error(
        data.msg || "Error al obtener resumen de salud por lotes",
      );
    return data;
  },

  obtenerResumenAnimales: async (token, params = {}) => {
    const { page = 1, limit = 10, search = "" } = params;

    const query = new URLSearchParams({
      page,
      limit,
      search,
    }).toString();

    const res = await fetch(`${API_URL}/salud/resumen-animales?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok)
      throw new Error(
        data.msg || "Error al obtener resumen de salud por animales",
      );
    return data;
  },

  registrarTarea: async (token, saludData) => {
    const res = await fetch(`${API_URL}/salud`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(saludData),
    });

    const data = await res.json();
    if (!res.ok)
      throw new Error(data.msg || "Error al registrar la tarea de salud");
    return data;
  },

  obtenerDetalleTarea: async (token, id) => {
    const res = await fetch(`${API_URL}/salud/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok)
      throw new Error(
        data.msg || "Error al obtener detalles de la tarea de salud",
      );
    return data;
  },

  editarTarea: async (token, id, saludData) => {
    const res = await fetch(`${API_URL}/salud/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(saludData),
    });

    const data = await res.json();
    if (!res.ok)
      throw new Error(data.msg || "Error al editar la tarea de salud");
    return data;
  },

  toggleAplicarTarea: async (token, id) => {
    const res = await fetch(`${API_URL}/salud/${id}/toggle`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok)
      throw new Error(data.msg || "Error al actualizar el estado de la tarea");
    return data;
  },

  eliminarTarea: async (token, id) => {
    const res = await fetch(`${API_URL}/salud/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok)
      throw new Error(data.msg || "Error al eliminar la tarea de salud");
    return data;
  },
};
