"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { animalService } from "@/services/animal.service";

/**
 * @description Obtiene el token de autenticación de las cookies.
 * @returns {Promise<string>} Token de sesión.
 * @throws {Error} Si el usuario no está autenticado.
 */
async function getToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) throw new Error("No estás autenticado");
  return token;
}

/**
 * @description Obtiene las estadísticas generales del módulo de animales.
 * @returns {Promise<Object>} Objeto con éxito y datos de estadísticas o error.
 */
export async function getEstadisticasAnimalesAction() {
  try {
    const token = await getToken();
    const stats = await animalService.obtenerEstadisticas(token);
    return { success: true, data: stats };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Obtiene la lista paginada y filtrada de animales.
 * @param {Object|string} params - Parámetros de búsqueda y paginación.
 * @returns {Promise<Object>} Lista de animales o mensaje de error.
 */
export async function getAnimalesAction(params) {
  try {
    const token = await getToken();
    const result = await animalService.obtenerAnimales(token, params);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Registra un nuevo animal en el sistema.
 * @param {Object} data - Datos del animal a crear.
 * @returns {Promise<Object>} Resultado de la creación.
 */
export async function createAnimalAction(data) {
  try {
    const token = await getToken();
    const result = await animalService.registrarAnimal(token, data);
    revalidatePath("/animals");
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Obtiene los detalles completos de un animal por su ID.
 * @param {string|number} id - Identificador del animal.
 * @returns {Promise<Object>} Datos del animal.
 */
export async function getAnimalDetailsAction(id) {
  try {
    const token = await getToken();
    const result = await animalService.obtenerDetalleAnimal(token, id);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Actualiza la información de un animal existente.
 * @param {string|number} id - Identificador del animal a actualizar.
 * @param {Object} data - Nuevos datos del animal.
 * @returns {Promise<Object>} Resultado de la actualización.
 */
export async function updateAnimalAction(id, data) {
  try {
    const token = await getToken();
    const result = await animalService.editarAnimal(token, id, data);
    revalidatePath("/animals");
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Elimina un animal del sistema.
 * @param {string|number} id - Identificador del animal a eliminar.
 * @returns {Promise<Object>} Resultado de la eliminación.
 */
export async function deleteAnimalAction(id) {
  try {
    const token = await getToken();
    const result = await animalService.eliminarAnimal(token, id);
    revalidatePath("/animals");
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * @description Registra un cambio en la situación o estado de un animal (ej. Venta, Muerte).
 * @param {string|number} id - Identificador del animal.
 * @param {Object} payload - Datos de la nueva situación.
 * @returns {Promise<Object>} Resultado de la operación.
 */
export async function registrarSituacionAction(id, payload) {
  try {
    const token = await getToken();
    const result = await animalService.registrarSituacion(token, id, payload);

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