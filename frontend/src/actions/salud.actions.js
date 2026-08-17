"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { saludService } from "@/services/salud.service";

async function getToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) throw new Error("No estás autenticado");
  return token;
}

export async function getEstadisticasSaludAction() {
  try {
    const token = await getToken();
    const stats = await saludService.obtenerEstadisticas(token);
    return { success: true, data: stats };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getTareasSaludAction(params) {
  try {
    const token = await getToken();
    const result = await saludService.obtenerTareas(token, params);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getResumenSaludLotesAction(params) {
  try {
    const token = await getToken();
    const result = await saludService.obtenerResumenLotes(token, params);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getResumenSaludAnimalesAction(params) {
  try {
    const token = await getToken();
    const result = await saludService.obtenerResumenAnimales(token, params);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

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

export async function getDetalleTareaSaludAction(id) {
  try {
    const token = await getToken();
    const result = await saludService.obtenerDetalleTarea(token, id);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

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