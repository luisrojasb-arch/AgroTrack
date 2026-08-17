const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const animalService = {
  obtenerEstadisticas: async (token) => {
    const res = await fetch(`${API_URL}/animales/estadisticas`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Error al obtener estadísticas");
    return data.estadisticas;
  },

  obtenerAnimales: async (token, params = {}) => {
    const { page = 1, limit = 10, search = "", sexo = "" } = params;

    const query = new URLSearchParams({
      page,
      limit,
      search,
      sexo,
    }).toString();

    const res = await fetch(`${API_URL}/animales?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Error al obtener animales");
    return data;
  },

  registrarAnimal: async (token, animalData) => {
    const res = await fetch(`${API_URL}/animales`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(animalData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Error al registrar el animal");
    return data;
  },

  obtenerDetalleAnimal: async (token, id) => {
    const res = await fetch(`${API_URL}/animales/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok)
      throw new Error(data.msg || "Error al obtener detalles del animal");
    return data;
  },

  editarAnimal: async (token, id, animalData) => {
    const res = await fetch(`${API_URL}/animales/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(animalData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Error al editar el animal");
    return data;
  },

  eliminarAnimal: async (token, id) => {
    const res = await fetch(`${API_URL}/animales/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Error al eliminar el animal");
    return data;
  },

  registrarSituacion: async (token, id, payload) => {
    const res = await fetch(`${API_URL}/animales/${id}/situacion`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok)
      throw new Error(data.msg || "Error al registrar la situación del animal");
    return data;
  },
};
