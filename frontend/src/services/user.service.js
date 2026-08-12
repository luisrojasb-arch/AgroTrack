const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const userService = {
  obtenerEstadisticas: async (token) => {
    const res = await fetch(`${API_URL}/usuarios/estadisticas`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Error al obtener estadísticas");
    return data;
  },

  obtenerMiembros: async (token, params = {}) => {
    const { page = 1, limit = 10, search = "", rol = "" } = params;

    const query = new URLSearchParams({
      page,
      limit,
      search,
      rol,
    }).toString();

    const res = await fetch(`${API_URL}/usuarios/miembros?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Error al obtener miembros");
    return data;
  },

  registrarMiembro: async (token, data) => {
    const res = await fetch(`${API_URL}/usuarios/registrar-miembro`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.msg || "Error al registrar miembro");
    return result;
  },

  editarMiembro: async (token, id, data) => {
    const res = await fetch(`${API_URL}/usuarios/miembros/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.msg || "Error al editar miembro");
    return result;
  },

  eliminarMiembro: async (token, id) => {
    const res = await fetch(`${API_URL}/usuarios/miembros/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.msg || "Error al eliminar miembro");
    return result;
  },
};
