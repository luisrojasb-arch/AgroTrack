"use server";

import { cookies } from "next/headers";
import { inventoryService } from "@/services/inventory.service";

// 1. Convertimos esta función en asíncrona para esperar las cookies
const getToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
};

export async function getInventarioResumenAction(searchParams = "") {
  try {
    const token = await getToken(); // 2. Esperamos el token
    const data = await inventoryService.getResumen(token, searchParams);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getInventarioEstadisticasAction() {
  try {
    const token = await getToken();
    const data = await inventoryService.getEstadisticas(token);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getArticuloDetallesAction(id) {
  try {
    const token = await getToken();
    const data = await inventoryService.getDetalle(token, id);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function createArticuloAction(payload) {
  try {
    const token = await getToken();
    const data = await inventoryService.create(token, payload);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateArticuloAction(id, payload) {
  try {
    const token = await getToken();
    const data = await inventoryService.update(token, id, payload);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function ajustarStockAction(id, payload) {
  try {
    const token = await getToken();
    const data = await inventoryService.ajustarStock(token, id, payload);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteArticuloAction(id) {
  try {
    const token = await getToken();
    const data = await inventoryService.delete(token, id);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}