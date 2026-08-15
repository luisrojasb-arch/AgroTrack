"use server";

import { cookies } from "next/headers";
import { reproductionService } from "@/services/reproduction.service";
import { revalidatePath } from "next/cache";

async function getToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) throw new Error("No estás autenticado");
  return token;
}

export async function getEstadisticasReproduccionAction() {
  try {
    const token = await getToken();
    const result = await reproductionService.obtenerEstadisticas(token);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getCelosAction(params) {
  try {
    const token = await getToken();
    const result = await reproductionService.obtenerCelos(token, params);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getPrenecesAction(params) {
  try {
    const token = await getToken();
    const result = await reproductionService.obtenerPreneces(token, params);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getNacimientosAction(params) {
  try {
    const token = await getToken();
    const result = await reproductionService.obtenerNacimientos(token, params);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getDetalleCicloAction(id) {
  try {
    const token = await getToken();
    const result = await reproductionService.obtenerDetalleCiclo(token, id);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

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
