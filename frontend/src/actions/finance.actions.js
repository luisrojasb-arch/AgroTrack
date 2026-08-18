"use server";

import { cookies } from "next/headers";
import { financeService } from "@/services/finance.service";

const getToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
};

export async function getFinanzasResumenAction(searchParams = "") {
  try {
    const token = await getToken();
    const data = await financeService.getResumen(token, searchParams);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getFinanzasEstadisticasAction() {
  try {
    const token = await getToken();
    const data = await financeService.getEstadisticas(token);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getTransaccionDetallesAction(id) {
  try {
    const token = await getToken();
    const data = await financeService.getDetalle(token, id);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function createTransaccionAction(payload) {
  try {
    const token = await getToken();
    const data = await financeService.create(token, payload);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateTransaccionAction(id, payload) {
  try {
    const token = await getToken();
    const data = await financeService.update(token, id, payload);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteTransaccionAction(id) {
  try {
    const token = await getToken();
    const data = await financeService.delete(token, id);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}