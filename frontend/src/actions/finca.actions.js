"use server";

import { cookies } from "next/headers";
import { fincaService } from "@/services/finca.service";
import { revalidatePath } from "next/cache";

async function getToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) throw new Error("No estás autenticado");
  return token;
}

export async function getFincaAction() {
  try {
    const token = await getToken();
    const finca = await fincaService.obtenerFinca(token);
    return { success: true, data: finca };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function actualizarFincaAction(payload) {
  try {
    const token = await getToken();
    const result = await fincaService.actualizarFinca(token, payload);

    revalidatePath("/settings");

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function eliminarFincaAction() {
  try {
    const token = await getToken();
    const result = await fincaService.eliminarFinca(token);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getTasasCambioAction() {
  try {
    const token = await getToken();
    const tasas = await fincaService.obtenerTasasCambio(token);
    return { success: true, data: tasas };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function actualizarTasasCambioAction(payload) {
  try {
    const token = await getToken();
    const result = await fincaService.actualizarTasasCambio(token, payload);

    revalidatePath("/settings");

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getDashboardGeneralAction() {
  try {
    const token = await getToken();
    const dashboard = await fincaService.obtenerDashboardGeneral(token);
    return { success: true, data: dashboard };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getAlertasDashboardAction(params) {
  try {
    const token = await getToken();
    const alertas = await fincaService.obtenerAlertasDashboard(token, params);
    return { success: true, data: alertas };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
