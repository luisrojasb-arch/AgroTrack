const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * @description Servicio de autenticación. Maneja el inicio de sesión, registro y validación de usuarios con la API.
 * @type {Object}
 */

export const authService = {
  login: async (correo, contrasenha) => {
    const res = await fetch(`${API_URL}/usuarios/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, contrasenha }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Error al iniciar sesión");
    return data;
  },

  register: async (datos) => {
    const res = await fetch(`${API_URL}/usuarios/registrar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Error al registrar usuario");
    return data;
  },
};
