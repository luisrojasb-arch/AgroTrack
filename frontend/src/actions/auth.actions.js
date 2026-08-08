"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authService } from "@/services/auth.service";

export async function registrarUsuarioAction(prevState, formData) {
  const nombre = formData.get("nombre");
  const apellido = formData.get("apellido");
  const correo = formData.get("correo");
  const contrasenha = formData.get("contrasenha");
  const nombre_finca = formData.get("nombre_finca");
  const acepto_terminos = formData.get("acepto_terminos") === "on";

  const nombreRegex = /^[A-Za-zÀ-ÿ\s]+$/;
  const passRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const fincaRegex = /^[a-zA-ZÀ-ÿ0-9\s]{2,50}$/;

  const errors = [];

  if (!nombreRegex.test(nombre) || !nombreRegex.test(apellido)) {
    errors.push("El nombre y apellido solo pueden contener letras.");
  }
  if (!passRegex.test(contrasenha)) {
    errors.push("Contraseña débil (Mín. 8 caracteres, 1 may, 1 num, 1 signo).");
  }
  if (!fincaRegex.test(nombre_finca)) {
    errors.push("El nombre de la finca debe tener entre 2 y 50 caracteres.");
  }
  if (!acepto_terminos) {
    errors.push("Debes aceptar los términos y condiciones.");
  }

  if (errors.length > 0) {
    return { error: errors.join(" ") };
  }

  try {
    const payload = {
      nombre,
      apellido,
      correo,
      contrasenha,
      nombre_finca,
      acepto_terminos,
    };

    const data = await authService.register(payload);

    const cookieStore = await cookies();
    cookieStore.set("token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  } catch (err) {
    if (err.message === "NEXT_REDIRECT") throw err;
    return { error: err.message || "Error al registrar la cuenta." };
  }

  redirect("/overview");
}

export async function loginAction(prevState, formData) {
  const correo = formData.get("correo");
  const contrasenha = formData.get("contrasenha");

  try {
    const data = await authService.login(correo, contrasenha);

    const cookieStore = await cookies();
    cookieStore.set("token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  } catch (err) {
    if (err.message === "NEXT_REDIRECT") throw err;
    return { error: err.message || "Credenciales incorrectas" };
  }

  redirect("/overview");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  redirect("/login");
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const payloadBase64 = token.split(".")[1];
    const payloadDecoded = Buffer.from(payloadBase64, "base64").toString(
      "utf-8",
    );
    return JSON.parse(payloadDecoded);
  } catch (error) {
    return null;
  }
}
