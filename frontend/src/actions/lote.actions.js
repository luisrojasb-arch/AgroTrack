"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { loteService } from "@/services/lote.service";

async function getToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) throw new Error("No estás autenticado");
  return token;
}

export async function getLotesAction(params) {
  try {
    const token = await getToken();
    const result = await loteService.obtenerLotes(token, params);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

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

export async function getLoteDetailsAction(id) {
  try {
    const token = await getToken();
    const result = await loteService.obtenerDetalleLote(token, id);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

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
