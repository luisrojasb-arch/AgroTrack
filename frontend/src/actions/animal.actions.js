"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { animalService } from "@/services/animal.service";

async function getToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) throw new Error("No estás autenticado");
  return token;
}

export async function getEstadisticasAnimalesAction() {
  try {
    const token = await getToken();
    const stats = await animalService.obtenerEstadisticas(token);
    return { success: true, data: stats };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getAnimalesAction(params) {
  try {
    const token = await getToken();
    const result = await animalService.obtenerAnimales(token, params);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

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

export async function getAnimalDetailsAction(id) {
  try {
    const token = await getToken();
    const result = await animalService.obtenerDetalleAnimal(token, id);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

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
