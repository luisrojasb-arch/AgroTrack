"use server";

import { cookies } from "next/headers";
import { reportesService } from "@/services/reportes.service";

async function getToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) throw new Error("No estás autenticado");
  return token;
}

export async function getDatosProduccionAction(payload) {
  try {
    const token = await getToken();
    const result = await reportesService.obtenerDatosProduccion(token, payload);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getDatosSaludAction(payload) {
  try {
    const token = await getToken();
    const result = await reportesService.obtenerDatosSalud(token, payload);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getDatosFinancieroAction(payload) {
  try {
    const token = await getToken();
    const result = await reportesService.obtenerDatosFinanciero(token, payload);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getDatosInventarioAction(payload) {
  try {
    const token = await getToken();
    const result = await reportesService.obtenerDatosInventario(token, payload);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getDatosReproductivoAction(payload) {
  try {
    const token = await getToken();
    const result = await reportesService.obtenerDatosReproductivo(token, payload);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getDatosAnualAction(payload) {
  try {
    const token = await getToken();
    const result = await reportesService.obtenerDatosAnual(token, payload);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}