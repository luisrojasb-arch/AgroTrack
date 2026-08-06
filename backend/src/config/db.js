import mongoose from 'mongoose';

/**
 * @description Conectar a la base de datos MongoDB utilizando Mongoose.
 * @returns {Promise<void>} Promesa que se resuelve cuando la conexión es exitosa.
 */
const conectarDB = async () => {
  try {
    const conexion = await mongoose.connect(process.env.MONGO_URL);
    console.log(`✅ MongoDB Conectado: ${conexion.connection.host}`);
  } catch (error) {
    console.error(`❌ Error de conexión: ${error.message}`);
    process.exit(1);
  }
};

export default conectarDB;