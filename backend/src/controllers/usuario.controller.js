import Usuario from "../models/usuario.model.js";
import Finca from "../models/finca.model.js";
import MiembroFinca from "../models/miembroFinca.model.js";
import { generarToken } from "../utils/jwt.util.js";
import { catchAsync } from "../middlewares/catch_async.middleware.js";
import crypto from "crypto";

/**
 * @description Registrar un nuevo usuario DUEÑO.
 */
export const registrarUsuario = catchAsync(async (req, res) => {
  const {
    nombre,
    apellido,
    correo,
    contrasenha,
    nombre_finca,
    acepto_terminos,
  } = req.body;

  if (acepto_terminos !== true) {
    return res
      .status(400)
      .json({ msg: "Debes aceptar los términos y condiciones." });
  }

  const nuevoUsuario = await Usuario.create({
    nombre,
    apellido,
    correo,
    contrasenha,
    acepto_terminos,
    requiere_cambio_contrasenha: false,
  });

  const nuevaFinca = await Finca.create({
    nombre_finca: nombre_finca,
    propietario_id: nuevoUsuario._id,
  });

  await MiembroFinca.create({
    usuario_id: nuevoUsuario._id,
    finca_id: nuevaFinca._id,
    rol: "admin",
  });

  const token = generarToken(nuevoUsuario, nuevaFinca._id, "admin");

  res.status(201).json({
    msg: "Registro exitoso.",
    token,
    finca_id: nuevaFinca._id,
    usuario: {
      id: nuevoUsuario._id,
      nombre: nuevoUsuario.nombre,
      apellido: nuevoUsuario.apellido,
    },
  });
});

/**
 * @description Admin registra a un nuevo MIEMBRO.
 */
export const registrarMiembro = catchAsync(async (req, res) => {
  const { nombre, apellido, correo, rol, contrasenha_temporal } = req.body;
  const fincaId = req.finca._id;

  const nuevoUsuario = await Usuario.create({
    nombre,
    apellido,
    correo,
    contrasenha: contrasenha_temporal,
    requiere_cambio_contrasenha: true,
    acepto_terminos: false,
  });

  await MiembroFinca.create({
    usuario_id: nuevoUsuario._id,
    finca_id: fincaId,
    rol: rol,
  });

  res.status(201).json({
    msg: "Miembro registrado exitosamente.",
    usuario: {
      id: nuevoUsuario._id,
      nombre: nuevoUsuario.nombre,
      correo: nuevoUsuario.correo,
      rol: rol,
    },
  });
});

/**
 * @description Iniciar sesión.
 */
export const loginUsuario = catchAsync(async (req, res) => {
  const { correo, contrasenha } = req.body;

  const usuario = await Usuario.findOne({ correo, esta_eliminado: false });
  if (!usuario) {
    return res.status(401).json({ msg: "Credenciales incorrectas" });
  }

  const passwordCorrecto = await usuario.compararContrasenha(contrasenha);
  if (!passwordCorrecto) {
    return res.status(401).json({ msg: "Credenciales incorrectas" });
  }

  const relaciones = await MiembroFinca.find({
    usuario_id: usuario._id,
    esta_eliminado: false,
  }).populate("finca_id");

  const fincas = relaciones.map((rel) => ({
    fincaId: rel.finca_id._id,
    nombre: rel.finca_id.nombre_finca,
    rol: rel.rol,
  }));

  const tieneFincaUnica = fincas.length === 1;
  const rolDefinido = tieneFincaUnica ? fincas[0].rol : null;
  const fincaId = tieneFincaUnica ? fincas[0].fincaId : null;

  const token = generarToken(usuario, fincaId, rolDefinido);

  res.status(200).json({
    token,
    usuario: {
      id: usuario._id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      requiereCambio: usuario.requiere_cambio_contrasenha,
      finca_actual_id: fincaId,
      foto_perfil_url: usuario.foto_perfil_url,
    },
    fincas,
  });
});

/**
 * @description Miembro activa su cuenta
 */
export const activarCuenta = catchAsync(async (req, res) => {
  const { nuevaContrasenha, confirmarContrasenha, acepto_terminos } = req.body;

  if (acepto_terminos !== true) {
    return res
      .status(400)
      .json({ msg: "Debes aceptar los Términos de Servicio para continuar." });
  }

  if (!nuevaContrasenha || !confirmarContrasenha) {
    return res
      .status(400)
      .json({ msg: "Debes completar ambos campos de contraseña." });
  }

  if (nuevaContrasenha !== confirmarContrasenha) {
    return res.status(400).json({ msg: "Las contraseñas no coinciden." });
  }

  const usuario = await Usuario.findById(req.usuario._id);

  usuario.contrasenha = nuevaContrasenha;
  usuario.requiere_cambio_contrasenha = false;
  usuario.acepto_terminos = true;

  await usuario.save();

  res.status(200).json({ msg: "Cuenta activada con éxito." });
});

/**
 * @description Obtener los datos para poblar la pantalla "Tus Datos de Usuario".
 */
export const obtenerPerfil = catchAsync(async (req, res) => {
  res.status(200).json({
    nombre: req.usuario.nombre,
    apellido: req.usuario.apellido,
    correo: req.usuario.correo,
    telefono: req.usuario.telefono || "",
    foto_perfil_url: req.usuario.foto_perfil_url,
    rol_finca: req.rol_finca || "N/A",
    nombre_finca: req.finca?.nombre_finca || "N/A",
  });
});

/**
 * @description Actualizar los datos desde el modal "Editar Perfil".
 */
export const actualizarPerfil = catchAsync(async (req, res) => {
  const { nombre, apellido, telefono } = req.body;

  const usuarioActualizado = await Usuario.findByIdAndUpdate(
    req.usuario._id,
    { nombre, apellido, telefono },
    { new: true, runValidators: true },
  ).select("-contrasenha");

  res.status(200).json({
    msg: "Perfil actualizado correctamente",
    usuario: usuarioActualizado,
  });
});

/**
 * @description Solicitar el enlace (Interfaz: ¿Olvidaste tu Contraseña?).
 */
export const solicitarRecuperacion = catchAsync(async (req, res) => {
  const { correo } = req.body;

  const usuario = await Usuario.findOne({ correo, esta_eliminado: false });
  if (!usuario) {
    return res.status(200).json({
      msg: "Si el correo está registrado, recibirás un enlace de recuperación.",
    });
  }

  const tokenLimpio = crypto.randomBytes(32).toString("hex");
  const tokenHasheado = crypto
    .createHash("sha256")
    .update(tokenLimpio)
    .digest("hex");

  usuario.restablecer_contrasenha_token = tokenHasheado;
  usuario.restablecer_contrasenha_expira = Date.now() + 3600000;

  await usuario.save({ validateBeforeSave: false });

  const url = `${process.env.FRONTEND_URL}/recuperar-password/${tokenLimpio}`;
  console.log(`URL de recuperación: ${url}`);

  res.status(200).json({
    msg: "Si el correo está registrado, recibirás un enlace de recuperación.",
  });
});

/**
 * @description Guardar la nueva clave (Interfaz: Restablecer Contraseña).
 */
export const restablecerContrasenha = catchAsync(async (req, res) => {
  const { token } = req.params;
  const { nuevaContrasenha, confirmarContrasenha } = req.body;

  if (!nuevaContrasenha || !confirmarContrasenha) {
    return res.status(400).json({ msg: "Debes completar ambos campos." });
  }

  if (nuevaContrasenha !== confirmarContrasenha) {
    return res.status(400).json({ msg: "Las contraseñas no coinciden." });
  }

  const tokenHasheado = crypto.createHash("sha256").update(token).digest("hex");

  const usuario = await Usuario.findOne({
    restablecer_contrasenha_token: tokenHasheado,
    restablecer_contrasenha_expira: { $gt: Date.now() },
  });

  if (!usuario) {
    return res
      .status(400)
      .json({ msg: "El enlace es inválido o ya ha expirado." });
  }

  usuario.contrasenha = nuevaContrasenha;
  usuario.restablecer_contrasenha_token = undefined;
  usuario.restablecer_contrasenha_expira = undefined;

  await usuario.save();

  res.status(200).json({
    msg: "Tu contraseña ha sido restablecida con éxito. Ya puedes iniciar sesión.",
  });
});


/**
 * @description Editar un miembro (Cambiar rol o corregir nombre/apellido).
 */
export const editarMiembro = catchAsync(async (req, res) => {
  const { miembroId } = req.params;
  const { nombre, apellido, rol } = req.body;
  const fincaId = req.finca._id;

  const relacion = await MiembroFinca.findOne({
    usuario_id: miembroId,
    finca_id: fincaId,
    esta_eliminado: false,
  });

  if (!relacion) {
    return res
      .status(404)
      .json({ msg: "El miembro no pertenece a esta finca." });
  }

  if (rol) {
    relacion.rol = rol;
    await relacion.save();
  }

  if (nombre || apellido) {
    await Usuario.findByIdAndUpdate(
      miembroId,
      { nombre, apellido },
      { new: true, runValidators: true },
    );
  }

  res.status(200).json({ msg: "Datos del miembro actualizados exitosamente." });
});

/**
 * @description Eliminar un miembro de la finca (Soft Delete de la relación).
 */
export const eliminarMiembro = catchAsync(async (req, res) => {
  const { miembroId } = req.params;
  const fincaId = req.finca._id;

  if (miembroId === req.usuario._id.toString()) {
    return res
      .status(400)
      .json({ msg: "No puedes eliminarte a ti mismo de la finca." });
  }

  const relacion = await MiembroFinca.findOneAndUpdate(
    { usuario_id: miembroId, finca_id: fincaId, esta_eliminado: false },
    { esta_eliminado: true, eliminado_at: new Date() },
    { new: true },
  );

  if (!relacion) {
    return res.status(404).json({ msg: "Miembro no encontrado." });
  }

  res
    .status(200)
    .json({ msg: "El miembro ha sido revocado de la finca exitosamente." });
});

/**
 * @description Obtener la lista de miembros de la finca con paginación y filtros para la tabla (10 en 10).
 */
export const obtenerMiembros = catchAsync(async (req, res) => {
  const fincaId = req.finca._id;
  const { page = 1, limit = 10, search = "", rol = "" } = req.query;

  const query = { finca_id: fincaId, esta_eliminado: false };

  if (rol && rol !== "Todos los roles" && rol !== "Todos") {
    const rolNormalizado = rol.toLowerCase();
    if (rolNormalizado.includes("admin")) query.rol = "admin";
    else if (rolNormalizado.includes("trabaja")) query.rol = "trabajador";
    else if (rolNormalizado.includes("veterinar")) query.rol = "veterinario";
    else query.rol = rol;
  }

  if (search) {
    const usuariosCoincidentes = await Usuario.find({
      esta_eliminado: false,
      $or: [
        { nombre: { $regex: search, $options: "i" } },
        { apellido: { $regex: search, $options: "i" } },
        { correo: { $regex: search, $options: "i" } },
      ],
    }).select("_id");

    query.usuario_id = { $in: usuariosCoincidentes.map((u) => u._id) };
  }

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 },
    populate: {
      path: "usuario_id",
      select:
        "nombre apellido correo telefono foto_perfil_url requiere_cambio_contrasenha ultimo_acceso createdAt",
    },
  };

  const resultado = await MiembroFinca.paginate(query, options);

  const miembrosFormateados = resultado.docs.map((rel) => {
    const usuario = rel.usuario_id || {};

    let rolDisplay = rel.rol;
    if (rel.rol === "admin") rolDisplay = "Administrador";
    if (rel.rol === "trabajador") rolDisplay = "Trabajador";
    if (rel.rol === "veterinario") rolDisplay = "Veterinario";

    const fechaAcceso = usuario.ultimo_acceso || usuario.createdAt;
    const ultimoAccesoStr = fechaAcceso
      ? new Date(fechaAcceso)
          .toISOString()
          .split("T")[0]
          .split("-")
          .reverse()
          .join("/")
      : "-";

    return {
      id: usuario._id,
      nombre: `${usuario.nombre || ""} ${usuario.apellido || ""}`.trim(),
      correo: usuario.correo || "-",
      rol: rolDisplay,
      ultimo_acceso: ultimoAccesoStr,
      cuenta_activa: !usuario.requiere_cambio_contrasenha,
    };
  });

  res.status(200).json({
    miembros: miembrosFormateados,
    paginacion: {
      totalRegistros: resultado.totalDocs,
      totalPaginas: resultado.totalPages,
      paginaActual: resultado.page,
      limite: resultado.limit,
      tienePaginaAnterior: resultado.hasPrevPage,
      tienePaginaSiguiente: resultado.hasNextPage,
    },
  });
});

/**
 * @description Obtener estadísticas de los usuarios de la finca (Tarjetas resumen).
 */
export const obtenerEstadisticasUsuarios = catchAsync(async (req, res) => {
  const fincaId = req.finca._id;

  const [total, administradores, trabajadores, veterinarios] =
    await Promise.all([
      MiembroFinca.countDocuments({ finca_id: fincaId, esta_eliminado: false }),
      MiembroFinca.countDocuments({
        finca_id: fincaId,
        rol: "admin",
        esta_eliminado: false,
      }),
      MiembroFinca.countDocuments({
        finca_id: fincaId,
        rol: "trabajador",
        esta_eliminado: false,
      }),
      MiembroFinca.countDocuments({
        finca_id: fincaId,
        rol: "veterinario",
        esta_eliminado: false,
      }),
    ]);

  res.status(200).json({
    estadisticas: {
      total_usuarios: total,
      administradores: administradores,
      trabajadores: trabajadores,
      veterinarios: veterinarios,
    },
  });
});
