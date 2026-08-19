"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { saludService } from "@/services/salud.service";

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
 * @description Obtiene las estadísticas principales de salud y tareas sanitarias.
 * @returns {Promise<Object>} Estadísticas de salud.
 */
export async function getEstadisticasSaludAction() {
  try {
    const token = await getToken();
    const stats = await saludService.obtenerEstadisticas(token);
    return { success: true, data: stats };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Obtiene la lista de tareas sanitarias (vacunas, chequeos, etc).
 * @param {Object} params - Parámetros de búsqueda o filtros.
 * @returns {Promise<Object>} Listado de tareas de salud.
 */
export async function getTareasSaludAction(params) {
  try {
    const token = await getToken();
    const result = await saludService.obtenerTareas(token, params);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Obtiene el resumen del estado de salud enfocado a nivel de lotes.
 * @param {Object} params - Parámetros de filtrado.
 * @returns {Promise<Object>} Resumen sanitario por lotes.
 */
export async function getResumenSaludLotesAction(params) {
  try {
    const token = await getToken();
    const result = await saludService.obtenerResumenLotes(token, params);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Obtiene el resumen del estado de salud enfocado a nivel individual de animales.
 * @param {Object} params - Parámetros de filtrado.
 * @returns {Promise<Object>} Resumen sanitario por animales.
 */
export async function getResumenSaludAnimalesAction(params) {
  try {
    const token = await getToken();
    const result = await saludService.obtenerResumenAnimales(token, params);
    return { success: true, data: result };
  } catch (error) {
    console.log(error);
    return { success: false, error: error.message };
  }
}

/**
 * @description Registra una nueva tarea sanitaria o tratamiento a aplicar.
 * @param {Object} data - Datos de la tarea a programar o registrar.
 * @returns {Promise<Object>} Resultado del registro.
 */
export async function createTareaSaludAction(data) {
  try {
    const token = await getToken();
    const result = await saludService.registrarTarea(token, data);
    revalidatePath("/salud");
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Obtiene la información detallada de una tarea sanitaria específica.
 * @param {string|number} id - Identificador de la tarea.
 * @returns {Promise<Object>} Detalles de la tarea.
 */
export async function getDetalleTareaSaludAction(id) {
  try {
    const token = await getToken();
    const result = await saludService.obtenerDetalleTarea(token, id);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Actualiza la información de una tarea sanitaria existente.
 * @param {string|number} id - Identificador de la tarea a actualizar.
 * @param {Object} data - Nuevos datos de la tarea.
 * @returns {Promise<Object>} Resultado de la actualización.
 */
export async function updateTareaSaludAction(id, data) {
  try {
    const token = await getToken();
    const result = await saludService.editarTarea(token, id, data);
    revalidatePath("/salud");
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Alterna el estado de una tarea sanitaria entre pendiente y completada.
 * @param {string|number} id - Identificador de la tarea.
 * @returns {Promise<Object>} Resultado de la modificación de estado.
 */
export async function toggleTareaSaludAction(id) {
  try {
    const token = await getToken();
    const result = await saludService.toggleAplicarTarea(token, id);
    revalidatePath("/salud");
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Elimina una tarea sanitaria del registro.
 * @param {string|number} id - Identificador de la tarea a eliminar.
 * @returns {Promise<Object>} Resultado de la eliminación.
 */
export async function deleteTareaSaludAction(id) {
  try {
    const token = await getToken();
    const result = await saludService.eliminarTarea(token, id);
    revalidatePath("/salud");
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}