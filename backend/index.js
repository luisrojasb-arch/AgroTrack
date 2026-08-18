import app from "./src/app.js";
import dotenv from "dotenv";
import conectarDB from "./src/config/db.js";

/**
 * @description Punto de entrada de la aplicación. Configura y arranca el servidor.
 * Utiliza variables de entorno y conecta a la base de datos.
 */

dotenv.config();

conectarDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});