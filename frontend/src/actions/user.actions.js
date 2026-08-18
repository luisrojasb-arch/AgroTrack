"use server";

import { cookies } from "next/headers";
import { userService } from "@/services/user.service";
import { revalidatePath } from "next/cache";

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

export async function getPerfilAction() {
  try {
    const token = await getToken();
    const result = await userService.obtenerPerfil(token);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updatePerfilAction(data) {
  try {
    const token = await getToken();
    const result = await userService.actualizarPerfil(token, data);
    revalidatePath("/settings");
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function solicitarRecuperacionAction(correo) {
  try {
    const result = await userService.solicitarRecuperacion(correo);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function restablecerContrasenhaAction(token, data) {
  try {
    const result = await userService.restablecerContrasenha(token, data);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function activarCuentaAction(data) {
  try {
    const tokenViejo = await getToken();
    const result = await userService.activarCuenta(tokenViejo, data);

    if (result.token) {
      const cookieStore = await cookies();

      cookieStore.set("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });

      const usuarioCookie = cookieStore.get("usuario")?.value;
      if (usuarioCookie) {
        const usuarioData = JSON.parse(usuarioCookie);
        usuarioData.requiereCambio = false;
        usuarioData.requiere_cambio_contrasenha = false;

        cookieStore.set("usuario", JSON.stringify(usuarioData), { path: "/" });
      }
    }

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
