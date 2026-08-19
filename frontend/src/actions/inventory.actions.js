"use server";

import { cookies } from "next/headers";
import { inventoryService } from "@/services/inventory.service";

/**
 * @description Extrae el token de las cookies.
 * @returns {Promise<string|undefined>} Token de sesión.
 */
const getToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
};

/**
 * @description Obtiene el listado de artículos del inventario basado en filtros.
 * @param {string|Object} searchParams - Parámetros de filtrado/paginación.
 * @returns {Promise<Object>} Lista de inventario.
 */
export async function getInventarioResumenAction(searchParams = "") {
  try {
    const token = await getToken(); // 2. Esperamos el token
    const data = await inventoryService.getResumen(token, searchParams);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Obtiene las estadísticas generales del inventario (valor, alertas, etc).
 * @returns {Promise<Object>} Estadísticas de inventario.
 */
export async function getInventarioEstadisticasAction() {
  try {
    const token = await getToken();
    const data = await inventoryService.getEstadisticas(token);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Obtiene los detalles de un artículo específico del inventario.
 * @param {string|number} id - Identificador del artículo.
 * @returns {Promise<Object>} Datos detallados del artículo.
 */
export async function getArticuloDetallesAction(id) {
  try {
    const token = await getToken();
    const data = await inventoryService.getDetalle(token, id);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Registra un nuevo artículo en el inventario.
 * @param {Object} payload - Datos del artículo a crear.
 * @returns {Promise<Object>} Resultado de la creación.
 */
export async function createArticuloAction(payload) {
  try {
    const token = await getToken();
    const data = await inventoryService.create(token, payload);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Actualiza la información de un artículo existente del inventario.
 * @param {string|number} id - Identificador del artículo.
 * @param {Object} payload - Nuevos datos del artículo.
 * @returns {Promise<Object>} Resultado de la actualización.
 */
export async function updateArticuloAction(id, payload) {
  try {
    const token = await getToken();
    const data = await inventoryService.update(token, id, payload);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Ajusta el stock de un artículo (entradas o salidas manuales).
 * @param {string|number} id - Identificador del artículo.
 * @param {Object} payload - Detalles del ajuste de stock.
 * @returns {Promise<Object>} Resultado del ajuste.
 */
export async function ajustarStockAction(id, payload) {
  try {
    const token = await getToken();
    const data = await inventoryService.ajustarStock(token, id, payload);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Elimina un artículo del inventario.
 * @param {string|number} id - Identificador del artículo a eliminar.
 * @returns {Promise<Object>} Resultado de la eliminación.
 */
export async function deleteArticuloAction(id) {
  try {
    const token = await getToken();
    const data = await inventoryService.delete(token, id);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}