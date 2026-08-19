"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { loteService } from "@/services/lote.service";

/**
 * @description Obtiene el token de autenticación.
 * @returns {Promise<string>} Token de sesión.
 * @throws {Error} Si no existe autenticación.
 */
async function getToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) throw new Error("No estás autenticado");
  return token;
}

/**
 * @description Obtiene el listado de lotes registrados.
 * @param {Object} params - Parámetros de búsqueda y paginación.
 * @returns {Promise<Object>} Lista de lotes.
 */
export async function getLotesAction(params) {
  try {
    const token = await getToken();
    const result = await loteService.obtenerLotes(token, params);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Crea un nuevo lote en el sistema.
 * @param {Object} data - Datos del lote a registrar.
 * @returns {Promise<Object>} Resultado del registro.
 */
export async function createLoteAction(data) {
  try {
    const token = await getToken();
    const result = await loteService.registrarLote(token, data);
    revalidatePath("/animals");
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Obtiene el detalle e información completa de un lote.
 * @param {string|number} id - Identificador del lote.
 * @returns {Promise<Object>} Datos del lote.
 */
export async function getLoteDetailsAction(id) {
  try {
    const token = await getToken();
    const result = await loteService.obtenerDetalleLote(token, id);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Actualiza los datos de un lote existente.
 * @param {string|number} id - Identificador del lote.
 * @param {Object} data - Nuevos datos del lote.
 * @returns {Promise<Object>} Resultado de la actualización.
 */
export async function updateLoteAction(id, data) {
  try {
    const token = await getToken();
    const result = await loteService.editarLote(token, id, data);
    revalidatePath("/animals");
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Elimina un lote del sistema.
 * @param {string|number} id - Identificador del lote a eliminar.
 * @returns {Promise<Object>} Resultado de la eliminación.
 */
export async function deleteLoteAction(id) {
  try {
    const token = await getToken();
    const result = await loteService.eliminarLote(token, id);
    revalidatePath("/animals");
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Registra un cambio de situación o estado general para un lote completo.
 * @param {string|number} id - Identificador del lote.
 * @param {Object} payload - Detalles de la nueva situación.
 * @returns {Promise<Object>} Resultado de la operación.
 */
export async function registrarSituacionLoteAction(id, payload) {
  try {
    const token = await getToken();
    const result = await loteService.registrarSituacion(token, id, payload);

    revalidatePath("/animals");

    if (payload.estado === "Vendido") {
      revalidatePath("/finances");
      revalidatePath("/overview");
    }

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}