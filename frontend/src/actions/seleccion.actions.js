"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { seleccionService } from "@/services/seleccion.service";

/**
 * @description Obtiene el token de autenticación de la sesión actual.
 * @returns {Promise<string>} Token de sesión.
 * @throws {Error} Si no hay sesión iniciada.
 */
async function getToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) throw new Error("No estás autenticado");
  return token;
}

/**
 * @description Obtiene la lista de animales en proceso de selección o engorde.
 * @param {Object} params - Filtros y parámetros de búsqueda.
 * @returns {Promise<Object>} Lista de selecciones.
 */
export async function getSeleccionesAction(params) {
  try {
    const token = await getToken();
    const result = await seleccionService.obtenerSelecciones(token, params);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Obtiene las métricas necesarias para alimentar el dashboard de la sección de selección.
 * @returns {Promise<Object>} Datos del dashboard de selección.
 */
export async function getSeleccionDashboardAction() {
  try {
    const token = await getToken();
    const result = await seleccionService.obtenerDashboardSeleccion(token);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Inicia y registra un nuevo proceso de selección para un animal.
 * @param {Object} data - Datos del animal y etapa a registrar.
 * @returns {Promise<Object>} Resultado del registro de selección.
 */
export async function createSeleccionAction(data) {
  try {
    const token = await getToken();
    const result = await seleccionService.registrarSeleccion(token, data);
    revalidatePath("/animals");
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Obtiene los detalles y el progreso completo de un registro de selección específico.
 * @param {string|number} id - Identificador del registro.
 * @returns {Promise<Object>} Detalle de la selección.
 */
export async function getSeleccionDetailsAction(id) {
  try {
    const token = await getToken();
    const result = await seleccionService.obtenerDetalleSeleccion(token, id);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Actualiza los datos o la etapa actual de un registro de selección.
 * @param {string|number} id - Identificador de la selección.
 * @param {Object} data - Nuevos datos de la etapa o proceso.
 * @returns {Promise<Object>} Resultado de la actualización.
 */
export async function updateSeleccionAction(id, data) {
  try {
    const token = await getToken();
    const result = await seleccionService.editarSeleccion(token, id, data);
    revalidatePath("/animals");
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Elimina un registro del proceso de selección.
 * @param {string|number} id - Identificador de la selección a borrar.
 * @returns {Promise<Object>} Resultado de la eliminación.
 */
export async function deleteSeleccionAction(id) {
  try {
    const token = await getToken();
    const result = await seleccionService.eliminarSeleccion(token, id);
    revalidatePath("/animals");
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Agrega un nuevo registro de pesaje al historial del animal en selección.
 * @param {string|number} id - Identificador de la selección o animal.
 * @param {Object} payload - Datos del pesaje (fecha, peso, notas).
 * @returns {Promise<Object>} Resultado del registro del peso.
 */
export async function registrarPesoAction(id, payload) {
  try {
    const token = await getToken();
    const result = await seleccionService.registrarPeso(token, id, payload);
    revalidatePath("/animals");
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Aprueba y finaliza satisfactoriamente el proceso de selección de un animal.
 * @param {string|number} id - Identificador del registro de selección.
 * @param {Object} payload - Datos finales de la aprobación.
 * @returns {Promise<Object>} Resultado de la aprobación.
 */
export async function aprobarSeleccionAction(id, payload) {
  try {
    const token = await getToken();
    const result = await seleccionService.aprobarSeleccion(token, id, payload);
    revalidatePath("/animals");
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}