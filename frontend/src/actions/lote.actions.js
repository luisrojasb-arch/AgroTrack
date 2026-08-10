"use server";

import { cookies } from "next/headers";
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
