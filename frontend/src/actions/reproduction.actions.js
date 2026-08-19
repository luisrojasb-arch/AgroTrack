"use server";

import { cookies } from "next/headers";
import { reportesService } from "@/services/reportes.service";

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
 * @description Genera y obtiene los datos del reporte de producción.
 * @param {Object} payload - Parámetros y filtros para el reporte.
 * @returns {Promise<Object>} Datos generados para el reporte de producción.
 */
export async function getDatosProduccionAction(payload) {
  try {
    const token = await getToken();
    const result = await reportesService.obtenerDatosProduccion(token, payload);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Genera y obtiene los datos del reporte de salud.
 * @param {Object} payload - Parámetros y filtros para el reporte.
 * @returns {Promise<Object>} Datos generados para el reporte de salud.
 */
export async function getDatosSaludAction(payload) {
  try {
    const token = await getToken();
    const result = await reportesService.obtenerDatosSalud(token, payload);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Genera y obtiene los datos del reporte financiero.
 * @param {Object} payload - Parámetros y filtros para el reporte.
 * @returns {Promise<Object>} Datos generados para el reporte financiero.
 */
export async function getDatosFinancieroAction(payload) {
  try {
    const token = await getToken();
    const result = await reportesService.obtenerDatosFinanciero(token, payload);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Genera y obtiene los datos del reporte de inventario.
 * @param {Object} payload - Parámetros y filtros para el reporte.
 * @returns {Promise<Object>} Datos generados para el reporte de inventario.
 */
export async function getDatosInventarioAction(payload) {
  try {
    const token = await getToken();
    const result = await reportesService.obtenerDatosInventario(token, payload);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Genera y obtiene los datos del reporte reproductivo.
 * @param {Object} payload - Parámetros y filtros para el reporte.
 * @returns {Promise<Object>} Datos generados para el reporte reproductivo.
 */
export async function getDatosReproductivoAction(payload) {
  try {
    const token = await getToken();
    const result = await reportesService.obtenerDatosReproductivo(token, payload);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Genera y obtiene los datos consolidados para el reporte general anual.
 * @param {Object} payload - Parámetros del año o filtros adicionales.
 * @returns {Promise<Object>} Datos generados para el reporte anual.
 */
export async function getDatosAnualAction(payload) {
  try {
    const token = await getToken();
    const result = await reportesService.obtenerDatosAnual(token, payload);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}