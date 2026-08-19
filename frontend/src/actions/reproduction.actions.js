"use server";

import { cookies } from "next/headers";
import { reproductionService } from "@/services/reproduction.service";
import { revalidatePath } from "next/cache";

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
 * @description Obtiene las estadísticas y métricas del módulo de reproducción.
 * @returns {Promise<Object>} Estadísticas reproductivas.
 */
export async function getEstadisticasReproduccionAction() {
  try {
    const token = await getToken();
    const result = await reproductionService.obtenerEstadisticas(token);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Obtiene la lista de registros de celos.
 * @param {Object} params - Parámetros de búsqueda o paginación.
 * @returns {Promise<Object>} Listado de celos.
 */
export async function getCelosAction(params) {
  try {
    const token = await getToken();
    const result = await reproductionService.obtenerCelos(token, params);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Obtiene la lista de preñeces activas e históricas.
 * @param {Object} params - Parámetros de búsqueda o paginación.
 * @returns {Promise<Object>} Listado de preñeces.
 */
export async function getPrenecesAction(params) {
  try {
    const token = await getToken();
    const result = await reproductionService.obtenerPreneces(token, params);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Obtiene la lista de nacimientos y partos registrados.
 * @param {Object} params - Parámetros de búsqueda o paginación.
 * @returns {Promise<Object>} Listado de nacimientos.
 */
export async function getNacimientosAction(params) {
  try {
    const token = await getToken();
    const result = await reproductionService.obtenerNacimientos(token, params);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Obtiene los detalles específicos de un ciclo reproductivo.
 * @param {string|number} id - Identificador del ciclo.
 * @returns {Promise<Object>} Información detallada del ciclo.
 */
export async function getDetalleCicloAction(id) {
  try {
    const token = await getToken();
    const result = await reproductionService.obtenerDetalleCiclo(token, id);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Registra la ocurrencia de un nuevo celo en el sistema.
 * @param {Object} payload - Datos correspondientes al celo.
 * @returns {Promise<Object>} Resultado del registro.
 */
export async function registrarCeloAction(payload) {
  try {
    const token = await getToken();
    const result = await reproductionService.registrarCelo(token, payload);
    revalidatePath("/reproduction");
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Edita los datos de un celo registrado.
 * @param {string|number} id - Identificador del celo.
 * @param {Object} payload - Nuevos datos.
 * @returns {Promise<Object>} Resultado de la edición.
 */
export async function editarCeloAction(id, payload) {
  try {
    const token = await getToken();
    const result = await reproductionService.editarCelo(token, id, payload);
    revalidatePath("/reproduction");
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Confirma una preñez resultante de un celo/monta.
 * @param {string|number} id - Identificador del evento/celo.
 * @param {Object} payload - Datos de confirmación de la preñez.
 * @returns {Promise<Object>} Resultado de la confirmación.
 */
export async function confirmarPrenezAction(id, payload) {
  try {
    const token = await getToken();
    const result = await reproductionService.confirmarPrenez(
      token,
      id,
      payload,
    );
    revalidatePath("/reproduction");
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Edita los datos de un registro de preñez.
 * @param {string|number} id - Identificador de la preñez.
 * @param {Object} payload - Nuevos datos a actualizar.
 * @returns {Promise<Object>} Resultado de la actualización.
 */
export async function editarPrenezAction(id, payload) {
  try {
    const token = await getToken();
    const result = await reproductionService.editarPrenez(token, id, payload);
    revalidatePath("/reproduction");
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Confirma el parto o nacimiento resultante de una preñez.
 * @param {string|number} id - Identificador de la preñez.
 * @param {Object} payload - Datos correspondientes al parto (lechones vivos, muertos, etc).
 * @returns {Promise<Object>} Resultado de la confirmación del nacimiento.
 */
export async function confirmarNacimientoAction(id, payload) {
  try {
    const token = await getToken();
    const result = await reproductionService.confirmarNacimiento(
      token,
      id,
      payload,
    );
    revalidatePath("/reproduction");
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Edita los datos del registro de un nacimiento/parto.
 * @param {string|number} id - Identificador del registro de nacimiento.
 * @param {Object} payload - Datos actualizados del parto.
 * @returns {Promise<Object>} Resultado de la edición.
 */
export async function editarNacimientoAction(id, payload) {
  try {
    const token = await getToken();
    const result = await reproductionService.editarNacimiento(
      token,
      id,
      payload,
    );
    revalidatePath("/reproduction");
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Elimina por completo un ciclo reproductivo o evento específico del historial.
 * @param {string|number} id - Identificador del ciclo.
 * @returns {Promise<Object>} Resultado de la eliminación.
 */
export async function eliminarCicloAction(id) {
  try {
    const token = await getToken();
    const result = await reproductionService.eliminarCiclo(token, id);
    revalidatePath("/reproduction");
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}