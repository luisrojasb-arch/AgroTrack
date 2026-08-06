import cors from "cors";

const whitelist = ["http://localhost:3000", "http://26.219.230.58:3000"];

/**
 * @description Configuración de CORS para permitir solicitudes solo desde orígenes en la lista blanca.
 */
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS - Acceso denegado"));
    }
  },
  credentials: true,
};

const configurarCors = cors(corsOptions);

export default configurarCors;
