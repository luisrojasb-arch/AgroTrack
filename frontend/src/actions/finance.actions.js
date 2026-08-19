"use server";

import { cookies } from "next/headers";
import { financeService } from "@/services/finance.service";

/**
 * @description Obtiene el token de sesión almacenado en las cookies.
 * @returns {Promise<string|undefined>} Token de sesión o indefinido.
 */
const getToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
};

/**
 * @description Obtiene el listado de transacciones financieras.
 * @param {string|Object} searchParams - Parámetros de búsqueda o filtros.
 * @returns {Promise<Object>} Resultado con los datos de las transacciones.
 */
export async function getFinanzasResumenAction(searchParams = "") {
  try {
    const token = await getToken();
    const data = await financeService.getResumen(token, searchParams);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Obtiene las estadísticas y totales financieros.
 * @returns {Promise<Object>} Resultado con las estadísticas (ingresos, gastos, ganancias).
 */
export async function getFinanzasEstadisticasAction() {
  try {
    const token = await getToken();
    const data = await financeService.getEstadisticas(token);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Obtiene el detalle de una transacción financiera específica.
 * @param {string|number} id - Identificador de la transacción.
 * @returns {Promise<Object>} Detalles de la transacción.
 */
export async function getTransaccionDetallesAction(id) {
  try {
    const token = await getToken();
    const data = await financeService.getDetalle(token, id);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Registra una nueva transacción financiera (ingreso/egreso).
 * @param {Object} payload - Datos de la transacción.
 * @returns {Promise<Object>} Resultado de la creación.
 */
export async function createTransaccionAction(payload) {
  try {
    const token = await getToken();
    const data = await financeService.create(token, payload);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Actualiza una transacción financiera existente.
 * @param {string|number} id - Identificador de la transacción a actualizar.
 * @param {Object} payload - Nuevos datos de la transacción.
 * @returns {Promise<Object>} Resultado de la actualización.
 */
export async function updateTransaccionAction(id, payload) {
  try {
    const token = await getToken();
    const data = await financeService.update(token, id, payload);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Elimina una transacción financiera del sistema.
 * @param {string|number} id - Identificador de la transacción a eliminar.
 * @returns {Promise<Object>} Resultado de la eliminación.
 */
export async function deleteTransaccionAction(id) {
  try {
    const token = await getToken();
    const data = await financeService.delete(token, id);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}