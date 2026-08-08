import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

import configurarCors from "./config/cors.js";

import usuarioRoutes from "./routes/usuario.routes.js";
import fincaRoutes from "./routes/finca.routes.js";
import animalRoutes from "./routes/animal.routes.js";
import loteRoutes from "./routes/lote.routes.js";
import seleccionRoutes from "./routes/seleccion.routes.js";
import saludRoutes from "./routes/salud.routes.js";
import inventarioRoutes from "./routes/inventario.routes.js";
import finanzasRoutes from "./routes/finanzas.routes.js";
import reproduccionRoutes from "./routes/reproduccion.routes.js";

dotenv.config();

const app = express();

app.use(configurarCors);

const limonero = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { msg: "Demasiadas peticiones, intenta más tarde." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(morgan("dev"));
app.use(helmet());
app.use(limonero);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensaje: "API de AgroTrack funcionando correctamente",
    version: "1.0.0",
    estado: "En línea",
  });
});

// RUTAS DE LA API
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/fincas", fincaRoutes);
app.use("/api/animales", animalRoutes);
app.use("/api/lotes", loteRoutes);
app.use("/api/selecciones", seleccionRoutes);
app.use("/api/salud", saludRoutes);
app.use("/api/inventario", inventarioRoutes);
app.use("/api/finanzas", finanzasRoutes);
app.use("/api/reproduccion", reproduccionRoutes);

app.use((req, res, next) => {
  res.status(404).json({ msg: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  if (err.name === "ValidationError") {
    error.message = Object.values(err.errors)
      .map((el) => el.message)
      .join(". ");
    error.statusCode = 400;
  }

  if (err.code === 11000) {
    const campo = Object.keys(err.keyValue)[0];
    error.message = `El ${campo} ya está registrado. Intenta con otro.`;
    error.statusCode = 400;
  }

  if (err.name === "JsonWebTokenError") {
    error.message = "Sesión inválida. Por favor, inicia sesión de nuevo.";
    error.statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    error.message = "Tu sesión ha expirado. Inicia sesión otra vez.";
    error.statusCode = 401;
  }

  res.status(error.statusCode || 500).json({
    msg: error.message || "Error interno del servidor",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

export default app;