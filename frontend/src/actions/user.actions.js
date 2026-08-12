"use server";

import { cookies } from "next/headers";
import { userService } from "@/services/user.service";

async function getToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) throw new Error("No estás autenticado");
  return token;
}

export async function getEstadisticasUsuariosAction() {
  try {
    const token = await getToken();
    const result = await userService.obtenerEstadisticas(token);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getUsuariosAction(params) {
  try {
    const token = await getToken();
    const result = await userService.obtenerMiembros(token, params);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

import { revalidatePath } from "next/cache";

export async function createMiembroAction(data) {
  try {
    const token = await getToken();
    const result = await userService.registrarMiembro(token, data);
    revalidatePath("/users");
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateMiembroAction(id, data) {
  try {
    const token = await getToken();
    const result = await userService.editarMiembro(token, id, data);
    revalidatePath("/users");
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteMiembroAction(id) {
  try {
    const token = await getToken();
    const result = await userService.eliminarMiembro(token, id);
    revalidatePath("/users");
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
