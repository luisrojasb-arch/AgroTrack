"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { seleccionService } from "@/services/seleccion.service";

async function getToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) throw new Error("No estás autenticado");
  return token;
}

export async function getSeleccionesAction(params) {
  try {
    const token = await getToken();
    const result = await seleccionService.obtenerSelecciones(token, params);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

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

export async function getSeleccionDetailsAction(id) {
  try {
    const token = await getToken();
    const result = await seleccionService.obtenerDetalleSeleccion(token, id);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

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
