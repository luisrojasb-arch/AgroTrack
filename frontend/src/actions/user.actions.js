"use server";

import { cookies } from "next/headers";
import { userService } from "@/services/user.service";
import { revalidatePath } from "next/cache";

/**
 * @description Obtiene el token de autenticación de las cookies de la sesión.
 * @returns {Promise<string>} Token de sesión actual.
 * @throws {Error} Si no se encuentra el token de autenticación.
 */
async function getToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) throw new Error("No estás autenticado");
  return token;
}

/**
 * @description Obtiene las estadísticas y totales relacionados a los miembros/usuarios de la finca.
 * @returns {Promise<Object>} Estadísticas de los usuarios.
 */
export async function getEstadisticasUsuariosAction() {
  try {
    const token = await getToken();
    const result = await userService.obtenerEstadisticas(token);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Obtiene el listado de miembros asociados a la finca actual.
 * @param {Object} params - Parámetros de búsqueda o filtros (roles, estados).
 * @returns {Promise<Object>} Lista de miembros.
 */
export async function getUsuariosAction(params) {
  try {
    const token = await getToken();
    const result = await userService.obtenerMiembros(token, params);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Registra un nuevo miembro/empleado con acceso a la finca.
 * @param {Object} data - Datos personales y rol del nuevo miembro.
 * @returns {Promise<Object>} Resultado de la creación del usuario.
 */
export async function createMiembroAction(data) {
  try {
    const token = await getToken();
    const result = await userService.registrarMiembro(token, data);
    revalidatePath("/users");
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Actualiza los datos o el nivel de permisos de un miembro existente.
 * @param {string|number} id - Identificador del miembro.
 * @param {Object} data - Datos a modificar.
 * @returns {Promise<Object>} Resultado de la actualización.
 */
export async function updateMiembroAction(id, data) {
  try {
    const token = await getToken();
    const result = await userService.editarMiembro(token, id, data);
    revalidatePath("/users");
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Elimina o revoca el acceso de un miembro a la finca.
 * @param {string|number} id - Identificador del miembro a eliminar.
 * @returns {Promise<Object>} Resultado de la eliminación.
 */
export async function deleteMiembroAction(id) {
  try {
    const token = await getToken();
    const result = await userService.eliminarMiembro(token, id);
    revalidatePath("/users");
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Obtiene la información completa del perfil del usuario actualmente autenticado.
 * @returns {Promise<Object>} Datos del perfil de usuario.
 */
export async function getPerfilAction() {
  try {
    const token = await getToken();
    const result = await userService.obtenerPerfil(token);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Actualiza la información personal en el perfil del usuario autenticado.
 * @param {Object} data - Datos actualizados del perfil.
 * @returns {Promise<Object>} Resultado de la actualización de perfil.
 */
export async function updatePerfilAction(data) {
  try {
    const token = await getToken();
    const result = await userService.actualizarPerfil(token, data);
    revalidatePath("/settings");
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Inicia el proceso de recuperación enviando un enlace al correo del usuario.
 * @param {string} correo - Correo electrónico del usuario a recuperar.
 * @returns {Promise<Object>} Resultado de la solicitud.
 */
export async function solicitarRecuperacionAction(correo) {
  try {
    const result = await userService.solicitarRecuperacion(correo);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Restablece la contraseña utilizando un token de seguridad enviado por correo.
 * @param {string} token - Token temporal de recuperación.
 * @param {Object} data - Nueva contraseña.
 * @returns {Promise<Object>} Resultado del restablecimiento de contraseña.
 */
export async function restablecerContrasenhaAction(token, data) {
  try {
    const result = await userService.restablecerContrasenha(token, data);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Activa la cuenta de un usuario recién invitado y configura su contraseña inicial.
 * @param {Object} data - Datos de activación (incluyendo la nueva contraseña).
 * @returns {Promise<Object>} Resultado de la activación y establecimiento de sesión.
 */
export async function activarCuentaAction(data) {
  try {
    const tokenViejo = await getToken();
    const result = await userService.activarCuenta(tokenViejo, data);

    if (result.token) {
      const cookieStore = await cookies();

      cookieStore.set("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });

      const usuarioCookie = cookieStore.get("usuario")?.value;
      if (usuarioCookie) {
        const usuarioData = JSON.parse(usuarioCookie);
        usuarioData.requiereCambio = false;
        usuarioData.requiere_cambio_contrasenha = false;

        cookieStore.set("usuario", JSON.stringify(usuarioData), { path: "/" });
      }
    }

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}